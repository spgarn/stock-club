
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons/faScaleBalanced";
import PaginatedTable from "../../../components/PaginatedTable";
import {
    CellContext,
    ColumnDef,
    createColumnHelper
} from '@tanstack/react-table'
import  { StockHoldings } from "../../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../../funcs/funcs";
import { translate } from "../../../i18n";
import { useMemo } from "react";
import portfolioStyles from "../portfolio.module.scss";


const columnHelper = createColumnHelper<StockHoldings>();

type IProps = { list: StockHoldings[], page: number, rowCount: number, currencyDisplay: "kr" | "percent", displayMethod: "active_stocks" | "sold_stocks" | "all_stocks", removeStock: (id: number) => void, setEditStock: (v: StockHoldings) => void, setSellPortion: (v: StockHoldings) => void }

export default function RenderStocks({ list, page, rowCount, currencyDisplay, displayMethod, removeStock, setEditStock, setSellPortion }: IProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: ColumnDef<StockHoldings, any>[] = useMemo(() => [
        columnHelper.accessor('stockName', {
            header: () => translate["stockName"],
            cell: info => <a href={`https://finance.yahoo.com/quote/${info.renderValue()}/`} className="clickable">{info.renderValue()}</a>,
        }),
        columnHelper.accessor('investedAt', {
            header: () => translate["investedAt"],
            cell: info => dayjs(info.renderValue() as Date).format("DD/MM/YYYY")
        }),
        ...(displayMethod != "active_stocks" ? [ //Sold or ALL
            columnHelper.accessor('soldAt', {
                header: () => translate["soldAt"],
                cell: info => info.renderValue() ? dayjs(info.renderValue() as Date).format("DD/MM/YYYY") : translate["not_sold"]
            })
        ] : []),
        columnHelper.accessor('buyPrice', {
            header: () => translate["buyPrice"],
            cell: info => formatCurrency(info.renderValue(), true, 3),
        }),
        columnHelper.accessor('amount', {
            header: translate["amount"],
            cell: info => formatCurrency(info.renderValue(), false, 2),
        }),
        ...(displayMethod != "active_stocks" ? [ //Sold or ALL
            columnHelper.accessor('sellPrice', {
                header: translate["sellPrice"],
                cell: info => info.renderValue() ? formatCurrency(Number(info.renderValue()), true, 3) : translate["not_sold"],
            })
        ] : []),
        ...(displayMethod != "sold_stocks" ? [ //Active or ALL
            columnHelper.accessor('currentPrice', {
                header: translate["currentPrice"],
                cell: info => formatCurrency(Number(info.renderValue()), true, 3),
            })
        ] : []),
        ...(displayMethod != "active_stocks" ? [ //Active or ALL
            {
                id: 'yield',
                header: translate["yield"],
                enableSorting: true,
                accessorFn: (original: StockHoldings) => Number(original.sellPrice) - Number(original.buyPrice),
                cell: (info: CellContext<StockHoldings, never>) => {
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
            }
        ] : []),
        ...(displayMethod != "sold_stocks" ? [ //Active or ALL
            {
                id: 'devSinceBuy',
                header: translate["dev_since_buy"],
                accessorFn: (original: StockHoldings) => Number(original.currentPrice) - Number(original.buyPrice),
                enableSorting: true,
                cell: (info: CellContext<StockHoldings, never>) => {
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
            }
        ] : []),
        {
            id: 'value',
            enableSorting: true,
            accessorFn: (original) => Number(original?.sellPrice ?? original.currentPrice) * Number(original.amount),
            header: translate["value"],
            cell: (info: CellContext<StockHoldings, never>) => {
                const original = info.row.original;
                const price = Number(original?.sellPrice ?? original.currentPrice);
                const amount = Number(original.amount);
                const value = price * amount;
                return <p>{formatCurrency(value, true, 2, false)}</p>;
            },
        },
        columnHelper.accessor('id', {
            header: "",
            enableSorting: false,
            cell: info => {
                const original = info.row.original;
                return <div>
                    <div className="icon-container">
                        <div className={"edit"} onClick={() => setEditStock(original)} title={translate["edit"]} role="button">
                            <FontAwesomeIcon icon={faEdit} />
                        </div>
                        {original.sold ? <div className={"delete"} onClick={() => removeStock(info.renderValue() as number)} role="button" title={translate["remove"]}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div> : <div className={"edit"} onClick={() => setSellPortion(info.row.original)} title={translate["sell"]} role="button">
                            <FontAwesomeIcon icon={faScaleBalanced} />
                        </div>}
                    </div>
                </div>
            },
        })
    ], [currencyDisplay, displayMethod]);

    return <PaginatedTable columns={columns} data={list} page={page} rowCount={rowCount} />
}