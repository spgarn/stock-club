/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { getCurrencyRates, StockHoldings } from "../../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../../funcs/funcs";
import { translate } from "../../../i18n";
import { useMemo } from "react";
import portfolioStyles from "../portfolio.module.scss";
import { useQuery } from "@tanstack/react-query";


const columnHelper = createColumnHelper<StockHoldings>();

type IProps = { list: StockHoldings[], page: number, rowCount: number, currencyDisplay: "kr" | "percent", displayMethod: "active_stocks" | "sold_stocks" | "all_stocks", removeStock: (id: number) => void, setEditStock: (v: StockHoldings) => void, setSellPortion: (v: StockHoldings) => void, withLivePrice?: boolean; isPublic?: boolean; }

export default function RenderStocks({ list, page, rowCount, currencyDisplay, displayMethod, removeStock, setEditStock, setSellPortion, withLivePrice = true, isPublic = false }: IProps) {

    const { data } = useQuery({
        queryKey: ['currency'],
        queryFn: getCurrencyRates,
    });

    const { EUR, USD, GBP } = data?.rates ?? { EUR: undefined, USD: undefined, GBP: undefined };

    const reverseRates = {
        EUR: EUR ? 1 / EUR : undefined,
        USD: USD ? 1 / USD : undefined,
        GBP: GBP ? 1 / GBP : undefined,
    };


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
        ...(displayMethod !== "sold_stocks" ? [
            columnHelper.accessor('currentPrice', {
                header: translate["currentPrice"],
                cell: (info) => {
                    const original = info.row.original;
                    let price = Number(info.renderValue());
                    // If the currency is USD, convert the price using the usdRate
                    if (original.currency === "USD") {
                        price = price * (reverseRates.USD ?? 1);
                    }
                    if (original.currency === "EUR") {
                        price = price * (reverseRates.EUR ?? 1);
                    }
                    if (original.currency === "GBP") {
                        price = price * (reverseRates.GBP ?? 1);
                    }
                    return original.sellPrice ? translate["sold"] : formatCurrency(price, true, 3);
                },
            }),
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
        ...(displayMethod != "sold_stocks" && withLivePrice ? [ //Active or ALL
            {
                id: 'devSinceBuy',
                header: translate["dev_since_buy"],
                accessorFn: (original: StockHoldings) => Number(original.currentPrice) - Number(original.buyPrice),
                enableSorting: true,
                cell: (info: CellContext<StockHoldings, never>) => {
                    const original = info.row.original;
                    const buyPrice = original.buyPrice;
                    const currentPrice = Number(original.currentPrice);

                    if (original?.sellPrice) return translate["sold"]

                    if (currencyDisplay === "percent") {
                        const percent = 100 * ((currentPrice / buyPrice) - 1);
                        return <span className={percent >= 0 ? portfolioStyles.positiveBubble : portfolioStyles.negativeBubble}>{formatCurrency(percent, false, 2, true)} %</span>;
                    }
                    const value = currentPrice - buyPrice;
                    return <span className={value >= 0 ? portfolioStyles.positive : portfolioStyles.negative}>{formatCurrency(value, true, 2, true)}</span>; // Ensure to return the value
                },
            }
        ] : []),
        ...(
            displayMethod !== "sold_stocks"
                ? [{
                    id: 'value',
                    enableSorting: true,
                    accessorFn: (original: StockHoldings) =>
                        Number(original?.sellPrice ?? original.currentPrice) *
                        Number(original.amount),
                    header: translate["value"],
                    cell: (info: CellContext<StockHoldings, never>) => {
                        const original = info.row.original;
                        let price = Number(original?.sellPrice ?? original.currentPrice);
                        const amount = Number(original.amount);
                        // If the currency is USD, convert the price using the usdRate
                        if (original.currency === "USD") {
                            price = price * (reverseRates.USD ?? 1);
                        }
                        if (original.currency === "EUR") {
                            price = price * (reverseRates.EUR ?? 1);
                        }
                        if (original.currency === "GBP") {
                            price = price * (reverseRates.GBP ?? 1);
                        }
                        const value = price * amount;
                        return (

                            <p>
                                {
                                    original?.sellPrice
                                        ? translate["sold"]
                                        : formatCurrency(value, true, 2, false)}
                            </p>
                        );
                    },
                }]
                : []
        ),
        ...(!isPublic ? [columnHelper.accessor('id', {
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
        })] : [])
    ], [currencyDisplay, displayMethod, withLivePrice, isPublic]);

    return <PaginatedTable columns={columns} data={list} page={page} rowCount={rowCount} />
}