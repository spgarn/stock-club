
import { useMemo, useState } from "react";
import { translate } from "../../i18n";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import portfolioStyles from "./portfolio.module.scss";
import { formatCurrency } from "../../funcs/funcs";
import {
    ColumnDef,
    createColumnHelper
} from '@tanstack/react-table'
import BasicTable from "../../components/BasicTable";
import { getStocks, StockHoldings } from "../../api";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import AddStockModal from "./components/AddStockModal";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import EditStockModal from "./components/EditStockModal";
const columnHelper = createColumnHelper<StockHoldings>();
export default function Portfolio() {
    const { data, refetch } = useQuery({
        queryKey: ['club-stocks-user'],
        queryFn: () => getStocks(),
    });
    const [addStockOpen, setAddStockOpen] = useState(false);
    const [editStock, setEditStock] = useState<null | StockHoldings>(null);

    const [displayMethod, setDisplayMethod] = useState<"active_stocks" | "sold_stocks">("active_stocks");
    const [currencyDisplay, setCurrencyDisplay] = useState<"kr" | "percent">("kr");
    const {
        totalValue, totalAmount, development, list
    } = useMemo(() => {
        if (!data) {
            return { totalAmount: 0, list: [], totalValue: 0, development: 0 }
        }
        const currentStocks = data.filter(stock => !stock.sold);
        const soldStocks = data.filter(stock => stock.sold);

        const initial = currentStocks.reduce((prev, stock) => prev + (stock.amount * stock.buyPrice), 0);
        if (displayMethod === "active_stocks") {
            const currentValue = currentStocks.reduce((prev, stock) => prev + (stock.amount * stock.currentPrice), 0);
            return { totalAmount: currentStocks.length, list: currentStocks, totalValue: currentValue, development: ((1 - currentValue / initial) * 100).toFixed(2) }


        } else {
            //Not active
            const soldValue = soldStocks.reduce((prev, stock) => prev + (stock.amount * Number(stock.sellPrice)), 0);
            return { totalAmount: soldStocks.length, totalValue: soldValue, list: soldStocks, development: ((1 - soldValue / initial) * 100).toFixed(2) }

        }
    }, [data, displayMethod]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnsSold: ColumnDef<StockHoldings, any>[] = useMemo(() => [
        columnHelper.accessor('stockName', {
            header: () => translate["stockName"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('investedAt', {
            header: () => translate["investedAt"],
            cell: info => dayjs(info.renderValue() as Date).format("DD/MM/YYYY")
        }),
        columnHelper.accessor('soldAt', {
            header: () => translate["soldAt"],
            cell: info => dayjs(info.renderValue() as Date).format("DD/MM/YYYY")
        }),
        columnHelper.accessor('buyPrice', {
            header: () => translate["buyPrice"],
            cell: info => info.renderValue() + " kr",
        }),
        columnHelper.accessor('amount', {
            header: translate["amount"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('sellPrice', {
            header: translate["sellPrice"],
            cell: info => info.renderValue() + " kr",
        }),
        {
            id: 'yield',  // Change this to an id instead of accessor
            header: translate["yield"],
            cell: info => {
                const original = info.row.original;
                const buyPrice = original.buyPrice;
                const sellPrice = Number(original.sellPrice);

                if (currencyDisplay === "percent") {
                    const percent = 100 * (1 - (sellPrice / buyPrice));
                    return <p>{percent >= 0 ? "+" : ""}{percent.toFixed(2)} %</p>;
                }
                const value = sellPrice - buyPrice;
                return <p>{value >= 0 ? "+" : ""}{value.toFixed(2)} kr</p>; // Ensure to return the value
            },
        },
        {
            id: 'value',  // Change this to an id instead of accessor
            header: translate["value"],
            cell: info => {
                const original = info.row.original;
                const soldPrice = Number(original.sellPrice);
                const amount = Number(original.amount);
                const value = soldPrice * amount;
                return <p>{formatCurrency(value, true, 2, true)}</p>; // Ensure to return the value
            },
        },
        columnHelper.accessor('id', {
            header: "",
            cell: info => (
                <div>
                    <div className={"edit"} onClick={() => setEditStock(info.row.original)} title={translate["edit"]} role="button">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>
                </div>
            ),
        }),
    ], [currencyDisplay]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnsCurrent: ColumnDef<StockHoldings, any>[] = useMemo(() => [
        columnHelper.accessor('stockName', {
            header: () => translate["stockName"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('investedAt', {
            header: () => translate["investedAt"],
            cell: info => dayjs(info.renderValue() as Date).format("DD/MM/YYYY")
        }),
        columnHelper.accessor('buyPrice', {
            header: () => translate["buyPrice"],
            cell: info => info.renderValue() + " kr",
        }),
        columnHelper.accessor('amount', {
            header: translate["amount"],
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('currentPrice', {
            header: translate["currentPrice"],
            cell: info => info.renderValue() + " kr",
        }),
        {
            id: 'devSinceBuy',  // Change this to an id instead of accessor
            header: translate["dev_since_buy"],
            cell: info => {
                const original = info.row.original;
                const buyPrice = original.buyPrice;
                const currentPrice = Number(original.currentPrice);

                if (currencyDisplay === "percent") {
                    const percent = 100 * (1 - (currentPrice / buyPrice));
                    return <p>{percent >= 0 ? "+" : ""}{percent.toFixed(2)} %</p>;
                }
                const value = currentPrice - buyPrice;
                return <p>{value >= 0 ? "+" : ""}{value.toFixed(2)} kr</p>; // Ensure to return the value
            },
        },
        {
            id: 'value',  // Change this to an id instead of accessor
            header: translate["value"],
            cell: info => {
                const original = info.row.original;
                const currentPrice = Number(original.currentPrice);
                const amount = Number(original.amount);
                const value = currentPrice * amount;
                return <p>{formatCurrency(value, true, 2, true)}</p>; // Ensure to return the value
            },
        },
        columnHelper.accessor('id', {
            header: "",
            cell: info => (
                <div>
                    <div className={"edit"} onClick={() => setEditStock(info.row.original)} title={translate["edit"]} role="button">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>
                </div>
            ),
        }),
    ], [currencyDisplay]);
    if (!data) {
        return <div>
            <Loading />
        </div>
    }
    return (
        <div>
            <div className={portfolioStyles.header}>
                <ToggleButtonGroup
                    color="primary"
                    value={displayMethod}
                    exclusive
                    onChange={(_v, r) => setDisplayMethod(r)}
                    aria-label="Display Type"
                >
                    <ToggleButton value="active_stocks">{translate["active_stocks"]}</ToggleButton>
                    <ToggleButton value="sold_stocks">{translate["sold_stocks"]}</ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                    color="primary"
                    value={currencyDisplay}
                    exclusive
                    onChange={(_v, r) => setCurrencyDisplay(r)}
                    aria-label="Currency"
                >
                    <ToggleButton value="percent">%</ToggleButton>
                    <ToggleButton value="kr">kr</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className={portfolioStyles.overview}>
                <div>
                    <p>{translate["total_stocks"]}</p>
                    <p>{formatCurrency(totalAmount, false, 0, false)} {translate["individual_metric"]}</p>
                </div>
                <div>
                    <p>{translate["total_value"]}</p>
                    <p>{formatCurrency(totalValue, false, 2, true)} {translate["price_metric"]}</p>
                </div>
                <div>
                    <p>{translate[displayMethod === "active_stocks" ? "dev_since_start" : "yield"]}</p>
                    <p>{formatCurrency(development, false, 2, true)}%</p>
                </div>
            </div>

            <BasicTable columns={displayMethod === "active_stocks" ? columnsCurrent : columnsSold} data={list} />
            <Button sx={{ marginTop: "2rem" }} onClick={() => setAddStockOpen(true)}>{translate["add_investment"]}</Button>
            {addStockOpen && <AddStockModal refetch={refetch} handleClose={() => setAddStockOpen(false)} />}
            {!!editStock && <EditStockModal refetch={refetch} handleClose={() => setEditStock(null)} stock={editStock} />}

        </div>
    )
}
