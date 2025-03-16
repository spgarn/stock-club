/* eslint-disable @typescript-eslint/no-explicit-any */
/* SoldStocks.tsx */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { CellContext, ColumnDef, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo } from "react";
import portfolioStyles from "../../../portfolio.module.scss";
import { StockHoldings } from "../../../../../api";
import { translate } from "../../../../../i18n";
import { formatCurrency } from "../../../../../funcs/funcs";
import PaginatedTable from "../../../../../components/PaginatedTable";

const columnHelper = createColumnHelper<StockHoldings>();

type SoldStocksProps = {
  list: StockHoldings[];
  page: number;
  rowCount: number;
  currencyDisplay: "kr" | "percent";
  removeStock: (id: number) => void;
  setEditStock: (stock: StockHoldings) => void;
  isPublic?: boolean;
};

export default function SoldStocks({
  list,
  page,
  rowCount,
  currencyDisplay,
  removeStock,
  setEditStock,
  isPublic = false,
}: SoldStocksProps) {
  const columns: ColumnDef<StockHoldings, any>[] = useMemo(() => {
    const cols: ColumnDef<StockHoldings, any>[] = [
      // Stock Name with a link to Yahoo Finance
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
      // Invested at Date
      columnHelper.accessor("investedAt", {
        header: () => translate["investedAt"],
        cell: (info) => dayjs(info.renderValue() as Date).format("DD/MM/YYYY"),
      }),
      // Buy Price
      columnHelper.accessor("buyPrice", {
        header: () => translate["buyPrice"],
        cell: (info) => formatCurrency(info.renderValue(), true, 0),
      }),
      // Amount
      columnHelper.accessor("amount", {
        header: translate["amount"],
        cell: (info) => formatCurrency(info.renderValue(), false, 2),
      }),
      // Sold at Date
      columnHelper.accessor("soldAt", {
        header: () => translate["soldAt"],
        cell: (info) =>
          info.renderValue()
            ? dayjs(info.renderValue() as Date).format("DD/MM/YYYY")
            : translate["not_sold"],
      }),
      // Sell Price
      columnHelper.accessor("sellPrice", {
        header: () => translate["sellPrice"],
        cell: (info) =>
          info.renderValue()
            ? formatCurrency(Number(info.renderValue()), true, 3)
            : translate["not_sold"],
      }),
      // Yield Calculation
      {
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
              className={value >= 0 ? portfolioStyles.positive : portfolioStyles.negative}
            >
              {formatCurrency(value, true, 2, true)}
            </span>
          );
        },
      },
    ];

    // Action Buttons (if not public)
    if (!isPublic) {
      cols.push(
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
                <div
                  className="delete"
                  onClick={() => removeStock(info.renderValue() as number)}
                  title={translate["remove"]}
                  role="button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </div>
            );
          },
        })
      );
    }
    return cols;
  }, [currencyDisplay, isPublic, removeStock, setEditStock]);

  return (
    <PaginatedTable columns={columns} data={list} page={page} rowCount={rowCount} />
  );
}