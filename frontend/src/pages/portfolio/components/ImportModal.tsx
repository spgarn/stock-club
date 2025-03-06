import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import useClubs from "../../../hooks/useClubs";
import CSVParser, { CSVRow } from "../../../components/CSVParser";
import LineMatcher, { colors, Connection } from "../../../components/LineMatcher";
import { useMemo, useState } from "react";
import api, { StockHoldings } from "../../../api";
import StockPreview from "./StockPreview";
import { convertToNumber } from "../../../funcs/funcs";
import ModalNav from "./ModalNav";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { LinearProgressWithLabel } from "./LinearProgressWithLabel";
import Box from "@mui/material/Box";
import { mergeBTAIntoLatest } from "../utils/mergeBTAIntoLatest";
import { calculateRemainingBuyCostAndDate, calculateSoldCostAndDate } from "../utils/fifoDetailed";
import { adaptForSplits } from "../utils/adaptForSplits";

const STATIC_KEYS = ["csv_import_date", "csv_import_transaction_type", "csv_import_price", "csv_import_quantity", "csv_import_ISIN", "csv_import_diff", "csv_import_name", "csv_import_currency", "csv_import_share_price"]
export type Action = {
    csv_import_date: Date;
    csv_import_transaction_type: string;
    csv_import_price: number;
    csv_import_quantity: number;
    csv_import_diff: string;
    csv_import_currency: string;
    csv_import_share_price: number;
};
export type AggregatedData = {
    actions: Action[]
    csv_import_ISIN: string;
    csv_import_name: string;
}

type YahooISINResponse = {
    explains: [],
    count: number;
    quotes: {
        exchange: string;
        shortname: string;
        quoteType: string;
        symbol: string;
        index: string;
        score: number;
        typeDisp: string;
        exchDisp: string;
        sector: string;
        desctorDisp: string;
        industry: string;
        industryDisp: string;
        isYahooFinance: boolean;
    }[];
    news: [],
    nav: [],
    lists: []
}

const getConnection = (key: string, col: string) => {
    return {
        start: key,
        end: col,
        color: colors[key as keyof typeof colors]
    };
}



const bindDefaultConnections = (columns: string[]) => {
    return columns.reduce((prev, col) => {
        //Datum;Konto;Typ av transaktion;Värdepapper/beskrivning;Antal;Kurs;Belopp;Transaktionsvaluta;Courtage (SEK);Valutakurs;Instrumentvaluta;ISIN;Resultat
        switch (col) {
            case "Datum": {
                const key = "csv_import_date";
                prev.push(getConnection(key, col))
                break;
            }
            case "Typ av transaktion": {
                const key = "csv_import_transaction_type";
                prev.push(getConnection(key, col))
                break;
            }
            case "Antal": {
                const key = "csv_import_quantity";
                prev.push(getConnection(key, col))
                break;
            }
            case "Belopp": {
                const key = "csv_import_price";
                prev.push(getConnection(key, col))
                break;
            }
            case "ISIN": {
                const key = "csv_import_ISIN";
                prev.push(getConnection(key, col))
                break;
            }
            case "Resultat": {
                const key = "csv_import_diff";
                prev.push(getConnection(key, col))
                break;
            }
            case "Värdepapper/beskrivning": {
                const key = "csv_import_name";
                prev.push(getConnection(key, col))
                break;
            }
            case "Instrumentvaluta": {
                const key = "csv_import_currency";
                prev.push(getConnection(key, col))
                break;
            }
            case "Kurs": {
                const key = "csv_import_share_price";
                prev.push(getConnection(key, col))
                break;
            }
        }
        return prev;
    }, [] as Connection[])
}

export default function ImportModal({ handleClose, refetch }: { handleClose: () => void; refetch: () => void; }) {
    const { clubId } = useClubs();
    const [scanning, setScanning] = useState(false);
    const [page, setPage] = useState(1);
    const [progressBar, setProgressbar] = useState([0, 0]);
    // const [failedFinds, setFailedFinds] = useState<{ id: string; name: string }[]>([]);
    const [ISIN_Relations, set_ISIN_Relations] = useState(new Map<string, { shortname: string, symbol: string, stockName?: string; overridePrice?: number; }>());
    // const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
    const [table, setTable] = useState<{ keys: string[], values: string[], connections: Connection[], data: CSVRow[] }>({ keys: STATIC_KEYS, values: [], connections: [], data: [] })
    const { keys, values, connections } = table;
    const parseData = (data: CSVRow[]) => {
        console.log("All columns:", Object.keys(data[0]));
        const columns = Object.keys(data[0]);
        const connections = bindDefaultConnections(columns);
        setTable({ keys, values: columns, data: data, connections })

        if (columns.length > 0) {
            setPage(2);
        } else {
            alert(translate["no_columns"])
        }
    }

    const interpretedData = useMemo(() => {
        if (connections.length < 6) return [];
        console.log("Interpreting data");
        console.log(table.data);

        const aggregated = table.data.reduce((agg, row) => {
            //Map the keys to the data
            const [csv_import_date, csv_import_transaction_type, csv_import_price, csv_import_quantity, csv_import_ISIN, csv_import_diff, csv_import_name, csv_import_currency, csv_import_share_price] = STATIC_KEYS.map(key => {
                const conn = table.connections.find(conn => conn.start === key);
                if (conn === undefined) return null;
                return row[conn.end]
            })
            if (!csv_import_date || !csv_import_transaction_type || !csv_import_ISIN) return agg;
            if (csv_import_transaction_type !== "Övrigt" && (!csv_import_price || !csv_import_quantity)) return agg;
            const existing = agg.findIndex(v => v.csv_import_ISIN == csv_import_ISIN);
            if (existing < 0) {
                //Add
                agg.push({
                    actions: [{
                        csv_import_date: new Date(String(csv_import_date)),
                        csv_import_transaction_type: String(csv_import_transaction_type),
                        csv_import_price: Math.abs(convertToNumber(csv_import_price ?? 0)),
                        csv_import_quantity: Math.abs(convertToNumber(csv_import_quantity ?? 0)),
                        csv_import_diff: String(csv_import_diff),
                        csv_import_currency: String(csv_import_currency),
                        csv_import_share_price: Math.abs(convertToNumber(csv_import_share_price ?? 0)),
                    }],
                    csv_import_ISIN: String(csv_import_ISIN),
                    csv_import_name: String(csv_import_name),
                })
            } else {
                const prev = agg[existing];
                //Edit
                agg.splice(existing, 1, {
                    ...prev,
                    actions: [
                        ...prev.actions,
                        {
                            csv_import_date: new Date(String(csv_import_date)),
                            csv_import_transaction_type: String(csv_import_transaction_type),
                            csv_import_price: Math.abs(convertToNumber(csv_import_price ?? 0)),
                            csv_import_quantity: Math.abs(convertToNumber(csv_import_quantity ?? 0)),
                            csv_import_diff: String(csv_import_diff),
                            csv_import_currency: String(csv_import_currency),
                            csv_import_share_price: Math.abs(convertToNumber(csv_import_share_price ?? 0)),
                        }
                    ]
                })
            }
            return agg;
        }, [] as AggregatedData[]);

        mergeBTAIntoLatest(aggregated);
        const newAgg = adaptForSplits(aggregated)

        const stocks: StockHoldings[] = [];
        for (const data of newAgg) {
            // Filter out buy and sell actions

            const buyActions = data.actions.filter(
                (a) => a.csv_import_transaction_type === "Köp"
            );
            const sellActions = data.actions.filter(
                (a) => a.csv_import_transaction_type === "Sälj"
            );
            const totalSellQty = sellActions.reduce(
                (sum, a) => sum + a.csv_import_quantity,
                0
            );
            const totalBuyQty = buyActions.reduce(
                (sum, a) => sum + a.csv_import_quantity,
                0
            );
            const effectiveBuysAmount = totalBuyQty - totalSellQty;

            if (effectiveBuysAmount > 0) {
                // Use FIFO matching to calculate the remaining cost basis.
                const { remainingCost, remainingBuyDate } =
                    calculateRemainingBuyCostAndDate(buyActions, totalSellQty);

                stocks.push({
                    sellPrice: null,
                    id: 0,
                    stockName: data.csv_import_ISIN,
                    investedAt: new Date(remainingBuyDate),
                    buyPrice: remainingCost, // Now set based on FIFO calculation
                    amount: effectiveBuysAmount,
                    currentPrice: 0,
                    sold: false,
                    soldAt: null,
                    overridePrice: null,
                    avanzaName: data.csv_import_name,
                    currency:
                        data.actions.find((a) => a.csv_import_currency)?.csv_import_currency ||
                        "SEK",
                });
            }

            if (totalSellQty > 0) {
                // Compute the cost basis for sold shares using FIFO
                const { soldCost, lastSellBuyDate } = calculateSoldCostAndDate(buyActions, totalSellQty);

                // Aggregate sell transactions for revenue and last sell date.
                const sellAggregate = sellActions.reduce(
                    (prev, v) => {
                        prev.amount += v.csv_import_quantity;
                        prev.price += v.csv_import_price;
                        if (v.csv_import_date > prev.date) {
                            prev.date = v.csv_import_date;
                        }
                        return prev;
                    },
                    { date: new Date(), price: 0, amount: 0 }
                );

                stocks.push({
                    sellPrice: sellAggregate.price, // Total revenue from sells
                    id: 0,
                    stockName: data.csv_import_ISIN,
                    investedAt: lastSellBuyDate, // Date of the last buy that contributed to the sold shares
                    buyPrice: soldCost,          // FIFO cost basis for sold shares
                    amount: totalSellQty,
                    currentPrice: 0,
                    sold: true,
                    soldAt: sellAggregate.date,  // Latest sell date
                    overridePrice: null,
                    avanzaName: data.csv_import_name,
                    currency:
                        data.actions.find((a) => a.csv_import_currency)?.csv_import_currency || "SEK",
                });
            }
        }
        return stocks;

    }, [connections.length, table.connections, table.data]);

    //How many ISIN tags there are which have not been connected
    const totalISIN = new Set(interpretedData.map(d => d.stockName)).size
    const diff = totalISIN - ISIN_Relations.size;
    const maxPage = () => {
        if (values.length > 0) {
            if (connections.length >= keys.length) {
                if (diff == 0) {
                    return 4;
                }
                return 3;
            }
            return 2;

        }
        return 1;

    }

    const scan = () => {
        if (scanning) return;
        setScanning(true);
        const list = new Set(interpretedData.map(d => d.stockName));

        // Scan through and index all
        const interval = setInterval(async () => {
            const next = list.entries().next().value;
            if (next) {
                const [key] = next;
                list.delete(key);
                const backupName = interpretedData.find(d => d.stockName === key)?.avanzaName;

                // Primary search by ISIN (stockName)
                let res = await api.get<YahooISINResponse>(`/yahoo/info?ISIN=${key}`, {
                    headers: { "Access-Control-Allow-Origin": "*" },
                    withCredentials: true
                });
                let data = res.data;

                // If no results from primary call, try backup search using avanzaName
                if (!data || data.count === 0) {

                    if (backupName) {
                        res = await api.get<YahooISINResponse>(`/yahoo/info?ISIN=${encodeURIComponent(backupName)}`, {
                            headers: { "Access-Control-Allow-Origin": "*" },
                            withCredentials: true
                        });
                        data = res.data;
                    }
                }

                // Process the results
                if (data && data.count > 0 && Array.isArray(data.quotes) && data.quotes.length > 0) {
                    const quote = data.quotes[0];
                    const symbol = quote.symbol;
                    console.log(symbol)
                    set_ISIN_Relations(existing => {
                        existing.set(key, { shortname: quote.shortname, symbol });
                        return new Map(existing);
                    });
                } else {
                    // Fallback: mark with a special indicator and an override price
                    const nameWithIndicator = backupName ? backupName + "⛔️" : key;
                    const overridePrice = 1;
                    set_ISIN_Relations(existing => {
                        existing.set(key, { shortname: nameWithIndicator, symbol: nameWithIndicator, overridePrice });
                        return new Map(existing);
                    });
                }
            } else {
                clearInterval(interval);
            }
        }, 1000);
    };

    const stocks = interpretedData.map(d => {
        const existing = ISIN_Relations.get(d.stockName);
        return { ...d, stockName: existing?.symbol ?? d.stockName, ...existing }
    });

    const addStocks = async () => {
        setPage(5);
        setProgressbar([0, stocks.length]);
        let i = 0;
        for (const data of stocks) {
            i++;
            setProgressbar([i, stocks.length]);
            try {
                const res = await api.post<unknown>
                    ("/stocks/add/" + clubId, {
                        ...data,
                    }, {
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        withCredentials: true
                    });
                const resData = res.data;
                console.log(resData);
            } catch (err) {
                console.error(err);
                console.error(data);
                toast.error(String(err))
            }
        }
        setProgressbar([0, 0]);
        toast.success(translate["stock_created_success"]);
        refetch();
        handleClose();
    }
    return (
        <Dialog
            open={true}
            onClose={handleClose}
            aria-labelledby="Stock"
            aria-describedby="Stock"
            fullWidth
            maxWidth="md"
        >
            <BootstrapDialogTitle
                id="edit_alert-dialog-title"
                onClose={() => handleClose()}
            >
                {translate["import_csv"]}
            </BootstrapDialogTitle>

            <DialogContent>
                <ModalNav page={page} setPage={setPage} maxPage={maxPage()} finishPage={4} onFinish={() => addStocks()} />
                {progressBar[1] != 0 && <LinearProgressWithLabel value={Math.round(((progressBar[0] / progressBar[1]) * 100))} />}
                {page === 1 && <CSVParser parseData={parseData} />}
                {page === 2 && <LineMatcher keys={keys} values={values} connections={connections} setConnections={(connections) => setTable(t => ({ ...t, connections }))} />}
                {page === 3 && <div>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>{ISIN_Relations.size != totalISIN && <Button onClick={() => scan()} disabled={scanning}>{scanning ? `${translate["scanning"]}... ${ISIN_Relations.size} / ${totalISIN}` : translate["convert_ISIN"]}</Button>}
                    </Box>
                    {/* {failedFinds.length > 0 && <FailedFind item={failedFinds[0]} updateStock={(v) => console.log(v)} />} */}
                    <StockPreview data={stocks} />
                </div>}

            </DialogContent>
        </Dialog>
    )
}
