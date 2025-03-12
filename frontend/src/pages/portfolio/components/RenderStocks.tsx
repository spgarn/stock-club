/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons/faScaleBalanced";
import PaginatedTable from "../../../components/PaginatedTable";
import {
    CellContext,
    ColumnDef,
    createColumnHelper,
} from "@tanstack/react-table";
import { CurrencyRate, StockHoldings } from "../../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../../funcs/funcs";
import { translate } from "../../../i18n";
import { useMemo } from "react";
import portfolioStyles from "../portfolio.module.scss";

const columnHelper = createColumnHelper<StockHoldings>();

type IProps = {
    list: StockHoldings[];
    page: number;
    rowCount: number;
    currencyDisplay: "kr" | "percent";
    displayMethod: "active_stocks" | "sold_stocks" | "all_stocks";
    removeStock: (id: number) => void;
    setEditStock: (v: StockHoldings) => void;
    setSellPortion: (v: StockHoldings) => void;
    withLivePrice?: boolean;
    isPublic?: boolean;
    currencies: CurrencyRate[];
};


export default function RenderStocks({
    list,
    page,
    rowCount,
    currencyDisplay,
    displayMethod,
    removeStock,
    setEditStock,
    setSellPortion,
    withLivePrice = true,
    isPublic = false,
}: IProps) {

    const columns: ColumnDef<StockHoldings, any>[] = useMemo(() => {
        const baseColumns: ColumnDef<StockHoldings, any>[] = [
            // Stock name with link to Yahoo Finance
            columnHelper.accessor("stockName", {
                header: () => translate["stockName"],
                cell: (info) => (
                    <a
                        href={`https://finance.yahoo.com/quote/${info.renderValue()}/`}
                        className="clickable"
                    >
                        {info.renderValue()}
                    </a>
                ),
            }),
            // Invested at date
            columnHelper.accessor("investedAt", {
                header: () => translate["investedAt"],
                cell: (info) => dayjs(info.renderValue() as Date).format("DD/MM/YYYY"),
            }),
            // Buy price
            columnHelper.accessor("buyPrice", {
                header: () => translate["buyPrice"],
                cell: (info) => formatCurrency(info.renderValue(), true, 0),
            }),
            // Amount
            columnHelper.accessor("amount", {
                header: translate["amount"],
                cell: (info) => formatCurrency(info.renderValue(), false, 2),
            }),
        ];

        // Sold or All stocks: add soldAt and sellPrice columns
        if (displayMethod !== "active_stocks") {
            baseColumns.push(
                columnHelper.accessor("soldAt", {
                    header: () => translate["soldAt"],
                    cell: (info) =>
                        info.renderValue()
                            ? dayjs(info.renderValue() as Date).format("DD/MM/YYYY")
                            : translate["not_sold"],
                }),
                columnHelper.accessor("sellPrice", {
                    header: () => translate["sellPrice"],
                    cell: (info) =>
                        info.renderValue()
                            ? formatCurrency(Number(info.renderValue()), true, 3)
                            : translate["not_sold"],
                })
            );
        }

        // Active stocks: add currentPrice column (skip for sold stocks)
        if (displayMethod !== "sold_stocks") {
            baseColumns.push(
                columnHelper.accessor("currentPrice", {
                    header: translate["currentPrice"],
                    cell: (info) => {
                        const original = info.row.original;
                        const price = Number(info.renderValue());
                        return original.sellPrice
                            ? translate["sold"]
                            : formatCurrency(price, true, 0);
                    },
                })
            );
        }

        // Sold or All stocks: add yield column
        if (displayMethod !== "active_stocks") {
            baseColumns.push({
                id: "yield",
                header: translate["yield"],
                enableSorting: true,
                accessorFn: (original: StockHoldings) =>
                    Number(original.sellPrice) - Number(original.buyPrice),
                cell: (info: CellContext<StockHoldings, any>) => {
                    const original = info.row.original;
                    const buyPrice = original.buyPrice;
                    const sellPrice = Number(original.sellPrice);

                    if (currencyDisplay === "percent") {
                        const percent = 100 * ((sellPrice / buyPrice) - 1);
                        return (
                            <span
                                className={
                                    percent >= 0
                                        ? portfolioStyles.positiveBubble
                                        : portfolioStyles.negativeBubble
                                }
                            >
                                {formatCurrency(percent, false, 2, true)} %
                            </span>
                        );
                    }
                    const value = sellPrice - buyPrice;
                    return (
                        <span
                            className={
                                value >= 0 ? portfolioStyles.positive : portfolioStyles.negative
                            }
                        >
                            {formatCurrency(value, true, 2, true)}
                        </span>
                    );
                },
            });
        }

        // Active stocks with live price: add devSinceBuy column
        if (displayMethod !== "sold_stocks" && withLivePrice) {
            baseColumns.push({
                id: "devSinceBuy",
                header: translate["dev_since_buy"],
                accessorFn: (original: StockHoldings) =>
                    Number(original.currentPrice) - Number(original.buyPrice),
                enableSorting: true,
                cell: (info: CellContext<StockHoldings, any>) => {
                    const original = info.row.original;
                    const buyPrice = original.buyPrice;
                    const currentPrice = Number(original.currentPrice);

                    if (original?.sellPrice) return translate["sold"];


                    if (currencyDisplay === "percent") {
                        const percent = 100 * ((currentPrice / buyPrice) - 1);
                        return (
                            <span
                                className={
                                    percent >= 0
                                        ? portfolioStyles.positiveBubble
                                        : portfolioStyles.negativeBubble
                                }
                            >
                                {formatCurrency(percent, false, 2, true)} %
                            </span>
                        );
                    }
                    const value = (currentPrice * original.amount) - buyPrice;
                    return (
                        <span
                            className={
                                value >= 0 ? portfolioStyles.positive : portfolioStyles.negative
                            }
                        >
                            {formatCurrency(value, true, 0, true)}
                        </span>
                    );
                },
            });
        }

        // Active stocks: add value column
        if (displayMethod !== "sold_stocks") {
            baseColumns.push({
                id: "value",
                enableSorting: true,
                accessorFn: (original: StockHoldings) =>
                    Number(original?.sellPrice ?? original.currentPrice) *
                    Number(original.amount),
                header: translate["value"],
                cell: (info: CellContext<StockHoldings, never>) => {
                    const original = info.row.original;
                    const price = Number(original?.sellPrice ?? original.currentPrice);

                    const value = price * Number(original.amount);
                    return (
                        <p>
                            {original?.sellPrice
                                ? translate["sold"]
                                : formatCurrency(value, true, 0, false)}
                        </p>
                    );
                },
            });
        }

        // Actions column (if not public)
        if (!isPublic) {
            baseColumns.push(
                columnHelper.accessor("id", {
                    header: "",
                    enableSorting: false,
                    cell: (info) => {
                        const original = info.row.original;
                        return (
                            <div className="icon-container">
                                <div
                                    className="edit"
                                    onClick={() => setEditStock(original)}
                                    title={translate["edit"]}
                                    role="button"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </div>
                                {original.sold ? (
                                    <div
                                        className="delete"
                                        onClick={() => removeStock(info.renderValue() as number)}
                                        role="button"
                                        title={translate["remove"]}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                ) : (
                                    <div
                                        className="edit"
                                        onClick={() => setSellPortion(original)}
                                        title={translate["sell"]}
                                        role="button"
                                    >
                                        <FontAwesomeIcon icon={faScaleBalanced} />
                                    </div>
                                )}
                            </div>
                        );
                    },
                })
            );
        }

        return baseColumns;
    }, [
        displayMethod,
        withLivePrice,
        isPublic,
        currencyDisplay,
    ]);


    return (
        <PaginatedTable columns={columns} data={list} page={page} rowCount={rowCount} />
    );
}