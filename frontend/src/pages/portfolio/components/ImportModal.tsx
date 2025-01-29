import Dialog from "@mui/material/Dialog";
import { BootstrapDialogTitle } from "../../../components/BootstrapDialogTitle";
import { translate } from "../../../i18n";
import DialogContent from "@mui/material/DialogContent";
import useClubs from "../../../hooks/useClubs";
import CSVParser, { CSVRow } from "../../../components/CSVParser";
import LineMatcher, { colors, Connection } from "../../../components/LineMatcher";
import { useMemo, useState } from "react";
import { StockHoldings } from "../../../api";
import StockPreview from "./StockPreview";

const STATIC_KEYS = ["csv_import_date", "csv_import_transaction_type", "csv_import_price", "csv_import_quantity", "csv_import_ISIN", "csv_import_diff"]
type Action = {
    csv_import_date: Date;
    csv_import_transaction_type: string;
    csv_import_price: number;
    csv_import_quantity: number;
    csv_import_diff: string;
};
type AggregatedData = {
    actions: Action[]
    csv_import_ISIN: string;
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
        }
        return prev;
    }, [] as Connection[])
}

export default function ImportModal({ handleClose, refetch }: { handleClose: () => void; refetch: () => void; }) {
    const { clubId } = useClubs();
    // const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
    const [table, setTable] = useState<{ keys: string[], values: string[], connections: Connection[], data: CSVRow[] }>({ keys: STATIC_KEYS, values: [], connections: [], data: [] })
    const { keys, values, connections, data } = table;
    console.log(connections);
    const parseData = (data: CSVRow[]) => {
        console.log(data);
        console.log(Object.keys(data[0]));
        const columns = Object.keys(data[0]);
        const connections = bindDefaultConnections(columns);
        setTable({ keys, values: columns, data: data, connections })
    }

    const interpretedData = useMemo(() => {
        if (connections.length < 6) return [];
        const aggregated = table.data.reduce((agg, row) => {
            //Map the keys to the data
            const [csv_import_date, csv_import_transaction_type, csv_import_price, csv_import_quantity, csv_import_ISIN, csv_import_diff] = STATIC_KEYS.map(key => {
                const conn = table.connections.find(conn => conn.start === key);
                if (conn === undefined) return null;
                return row[conn.end]
            })
            if (!csv_import_date || !csv_import_transaction_type || !csv_import_price || !csv_import_quantity || !csv_import_ISIN || !csv_import_diff) return agg;
            const existing = agg.findIndex(v => v.csv_import_ISIN == csv_import_ISIN);
            if (existing < 0) {
                //Add
                agg.push({
                    actions: [{
                        csv_import_date: new Date(String(csv_import_date)),
                        csv_import_transaction_type: String(csv_import_transaction_type),
                        csv_import_price: Number(csv_import_price),
                        csv_import_quantity: Number(csv_import_quantity),
                        csv_import_diff: String(csv_import_diff)
                    }],
                    csv_import_ISIN: String(csv_import_ISIN),
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
                            csv_import_price: Number(csv_import_price),
                            csv_import_quantity: Number(csv_import_quantity),
                            csv_import_diff: String(csv_import_diff)
                        }
                    ]
                })
            }
            return agg;
        }, [] as AggregatedData[]);

        const stocks: StockHoldings[] = [];
        const sumBy = (actions: Action[], type: string) => {
            const { date, price, amount, count } = actions.reduce((prev, v) => {
                if (v.csv_import_transaction_type === type) {
                    //Add
                    prev.count++;
                    prev.price += v.csv_import_price;
                    prev.amount += v.csv_import_quantity;
                    if (v.csv_import_date > prev.date) {
                        prev.date = v.csv_import_date;
                    }
                }
                return prev;
            }, { date: new Date(), price: 0, amount: 0, count: 0 })
            return { date, price: price / count, amount: amount / count }
        }
        for (const data of aggregated) {
            //buy: 10 amount
            const buys = sumBy(data.actions, "Köp");
            //sell: 3 amount
            const sells = sumBy(data.actions, "Sälj");

            const effectiveBuysAmount = buys.amount - sells.amount; //10-3 = 7 still remaining in bought cat

            const effectiveSellsAmount = sells.amount;

            if (effectiveBuysAmount > 0) {
                stocks.push({
                    sellPrice: null,
                    id: 0,
                    stockName: data.csv_import_ISIN,
                    investedAt: buys.date,
                    buyPrice: buys.price,
                    amount: effectiveBuysAmount,
                    currentPrice: 0,
                    sold: false,
                    soldAt: null,
                    overridePrice: null
                })
            }

            if (effectiveSellsAmount > 0) {
                stocks.push({
                    sellPrice: sells.price,
                    id: 0,
                    stockName: data.csv_import_ISIN,
                    investedAt: buys.date,
                    buyPrice: buys.price,
                    amount: effectiveSellsAmount,
                    currentPrice: 0,
                    sold: true,
                    soldAt: sells.date,
                    overridePrice: null
                })
            }
        }
        console.log(stocks);
    }, [table])

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
                <CSVParser parseData={parseData} />
                {/* <Container sx={{ height: 300 }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        defaultEdgeOptions={edgeOptions}
                        fitView
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </Container> */}
                <LineMatcher keys={keys} values={values} connections={connections} setConnections={(connections) => setTable(t => ({ ...t, connections }))} />

                <StockPreview list={[]} />
            </DialogContent>
        </Dialog>
    )
}
