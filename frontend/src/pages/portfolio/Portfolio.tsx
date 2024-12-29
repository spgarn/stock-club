
import { useMemo, useState } from "react";
import { translate, translateText } from "../../i18n";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import portfolioStyles from "./portfolio.module.scss";
import { formatCurrency } from "../../funcs/funcs";
import {
    ColumnDef,
    createColumnHelper
} from '@tanstack/react-table'
import api, { getStocks, StockHoldings } from "../../api";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import AddStockModal from "./components/AddStockModal";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import EditStockModal from "./components/EditStockModal";
import SellPortionModal from "./components/SellPortionModal";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons/faScaleBalanced";
import { toast } from "react-toastify";
import axios from "axios";
import RowSelect from "../../components/RowSelect";
import Pagination from "@mui/material/Pagination";
import PaginatedTable from "../../components/PaginatedTable";
const columnHelper = createColumnHelper<StockHoldings>();
export default function Portfolio() {
    const { data, refetch } = useQuery({
        queryKey: ['club-stocks-user'],
        queryFn: () => getStocks(),
    });
    const [rowCount, setRowCount] = useState(10);
    const [page, setPage] = useState(1);
    const [addStockOpen, setAddStockOpen] = useState(false);
    const [editStock, setEditStock] = useState<null | StockHoldings>(null);
    const [sellPortion, setSellPortion] = useState<null | StockHoldings>(null);
    const [loading, setLoading] = useState(false);
    const [displayMethod, setDisplayMethod] = useState<"active_stocks" | "sold_stocks">("active_stocks");
    const [currencyDisplay, setCurrencyDisplay] = useState<"kr" | "percent">("kr");
    const {
        totalValue, totalAmount, development, list
    } = useMemo(() => {
        setPage(1);
        if (!data) {
            return { totalAmount: 0, list: [], totalValue: 0, development: 0 }
        }
        const currentStocks = data.filter(stock => !stock.sold);
        const soldStocks = data.filter(stock => stock.sold);

        const initial = currentStocks.reduce((prev, stock) => prev + (stock.amount * stock.buyPrice), 0);
        if (displayMethod === "active_stocks") {
            const currentValue = currentStocks.reduce((prev, stock) => prev + (stock.amount * stock.currentPrice), 0);
            return { totalAmount: currentStocks.length, list: currentStocks, totalValue: currentValue, development: ((currentValue / initial - 1) * 100) }


        } else {
            //Not active
            const soldValue = soldStocks.reduce((prev, stock) => prev + (stock.amount * Number(stock.sellPrice)), 0);
            return { totalAmount: soldStocks.length, totalValue: soldValue, list: soldStocks, development: ((soldValue / initial - 1) * 100) }

        }
    }, [data, displayMethod]);

    const changeRow = (row: number) => {
        setRowCount(row);
        setPage(1);
    }

    const removeStock = async (id: number) => {

        if (loading) return;
        if (!confirm(translate["confirm_delete_stock"])) return;
        setLoading(true);
        try {
            const res = await api.delete<unknown>
                ("/stocks/" + id, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    withCredentials: true
                });
            const resData = res.data;
            toast.success(translate["stock_deleted"]);
            refetch();
            console.log(resData);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data) {
                    toast.error(translateText(err.response?.data?.title, err.response?.data?.title));
                } else {
                    toast.error(err.message);
                }
            } else {
                toast.error(translate["something_went_wrong"])
            }
        }
        setLoading(false);
    }

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
            cell: info => formatCurrency(info.renderValue(), true, 2),
        }),
        columnHelper.accessor('amount', {
            header: translate["amount"],
            cell: info => formatCurrency(info.renderValue(), false, 2),
        }),
        columnHelper.accessor('sellPrice', {
            header: translate["sellPrice"],
            cell: info => formatCurrency(info.renderValue(), true, 2),
        }),
        {
            id: 'yield',
            header: translate["yield"],
            enableSorting: true,
            accessorFn: (original) => Number(original.sellPrice) - Number(original.buyPrice),
            cell: info => {
                const original = info.row.original;
                const buyPrice = original.buyPrice;
                const sellPrice = Number(original.sellPrice);

                if (currencyDisplay === "percent") {
                    const percent = 100 * ((sellPrice / buyPrice) - 1);
                    return <span className={percent >= 0 ? portfolioStyles.positiveBubble : portfolioStyles.negativeBubble}>
                        {formatCurrency(percent, false, 2, true)} %</span>;
                }
                const value = sellPrice - buyPrice;
                return <span className={value >= 0 ? portfolioStyles.positive : portfolioStyles.negative}>
                    {formatCurrency(value, true, 2, true)}</span>; // Ensure to return the value
            },
        },
        {
            id: 'value',
            enableSorting: true,
            accessorFn: (original) => Number(original.currentPrice) * Number(original.amount),
            header: translate["value"],
            cell: info => {
                const original = info.row.original;
                const soldPrice = Number(original.sellPrice);
                const amount = Number(original.amount);
                const value = soldPrice * amount;
                return <p>{formatCurrency(value, true, 2, false)}</p>;
            },
        },
        columnHelper.accessor('id', {
            header: "",
            enableSorting: false,
            cell: info => (
                <div>
                    <div className={"edit"} onClick={() => setEditStock(info.row.original)} title={translate["edit"]} role="button">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>
                    <div className={"delete"} onClick={() => removeStock(info.renderValue() as number)} role="button" title={translate["remove"]}>
                        <FontAwesomeIcon icon={faTrash} />
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
            cell: info => formatCurrency(info.renderValue(), true, 2),
        }),
        columnHelper.accessor('amount', {
            header: translate["amount"],
            cell: info => formatCurrency(info.renderValue(), false, 2),
        }),
        columnHelper.accessor('currentPrice', {
            header: translate["currentPrice"],
            cell: info => formatCurrency(info.renderValue(), true, 2),
        }),
        {
            id: 'devSinceBuy',
            header: translate["dev_since_buy"],
            accessorFn: (original) => Number(original.currentPrice) - Number(original.buyPrice),
            enableSorting: true,
            cell: info => {
                const original = info.row.original;
                const buyPrice = original.buyPrice;
                const currentPrice = Number(original.currentPrice);

                if (currencyDisplay === "percent") {
                    const percent = 100 * ((currentPrice / buyPrice) - 1);
                    return <span className={percent >= 0 ? portfolioStyles.positiveBubble : portfolioStyles.negativeBubble}>{formatCurrency(percent, false, 2, true)} %</span>;
                }
                const value = currentPrice - buyPrice;
                return <span className={value >= 0 ? portfolioStyles.positive : portfolioStyles.negative}>{formatCurrency(value, true, 2, true)}</span>; // Ensure to return the value
            },
        },
        {
            id: 'value',
            accessorFn: (original) => Number(original.currentPrice) * Number(original.amount),
            header: translate["value"],
            enableSorting: true,
            cell: info => {
                const original = info.row.original;
                const currentPrice = Number(original.currentPrice);
                const amount = Number(original.amount);
                const value = currentPrice * amount;
                return <p>{formatCurrency(value, true, 2, false)}</p>; // Ensure to return the value
            },
        },
        columnHelper.accessor('id', {
            header: "",
            enableSorting: false,
            cell: info => (
                <div>
                    <div className={"edit"} onClick={() => setEditStock(info.row.original)} title={translate["edit"]} role="button">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>
                    <div className={"edit"} onClick={() => setSellPortion(info.row.original)} title={translate["sell"]} role="button">
                        <FontAwesomeIcon icon={faScaleBalanced} />
                    </div>
                </div>
            ),
        }),
    ], [currencyDisplay]);
    const maxPages = Math.ceil(list.length / rowCount);
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
                    <p>{formatCurrency(totalValue, false, 2, false)} {translate["price_metric"]}</p>
                </div>
                <div>
                    <p>{translate[displayMethod === "active_stocks" ? "dev_since_start" : "yield"]}</p>
                    <p className={development >= 0 ? portfolioStyles.positive : portfolioStyles.negative}>{formatCurrency(development, false, 2, true)}%</p>
                </div>
            </div>
            <div className={portfolioStyles.actionContainer}>
                <Button onClick={() => setAddStockOpen(true)}>{translate["add_investment"]}</Button>
                <div>
                    <RowSelect
                        value={rowCount}
                        changeValue={changeRow}
                    />
                </div>
            </div>

            <PaginatedTable columns={displayMethod === "active_stocks" ? columnsCurrent : columnsSold} data={list} page={page} rowCount={rowCount} />
            {addStockOpen && <AddStockModal refetch={refetch} handleClose={() => setAddStockOpen(false)} />}
            {!!editStock && <EditStockModal refetch={refetch} handleClose={() => setEditStock(null)} stock={editStock} />}
            {!!sellPortion && <SellPortionModal refetch={refetch} handleClose={() => setSellPortion(null)} stock={sellPortion} />}
            <div className="pagination-container">
                <Pagination size="small" color="primary" count={maxPages} page={page} onChange={(_e, v) => setPage(v)} />
            </div>
        </div>
    )
}
