/* eslint-disable @typescript-eslint/no-explicit-any */
/* ActiveStocks.tsx */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons/faScaleBalanced";
import PaginatedTable from "../../../../components/PaginatedTable";
import { CellContext, ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { StockHoldings } from "../../../../api";
import dayjs from "dayjs";
import { formatCurrency } from "../../../../funcs/funcs";
import { translate } from "../../../../i18n";
import { useMemo } from "react";
import portfolioStyles from "../../portfolio.module.scss";

const columnHelper = createColumnHelper<StockHoldings>();

type ActiveStocksProps = {
  list: StockHoldings[];
  page: number;
  rowCount: number;
  currencyDisplay: "kr" | "percent";
  removeStock: (id: number) => void;
  setEditStock: (stock: StockHoldings) => void;
  setSellPortion: (stock: StockHoldings) => void;
  withLivePrice?: boolean;
  isPublic?: boolean;
};

export default function ActiveStocks({
  list,
  page,
  rowCount,
  currencyDisplay,
  setEditStock,
  setSellPortion,
  withLivePrice = true,
  isPublic = false,
}: ActiveStocksProps) {
  const columns: ColumnDef<StockHoldings, any>[] = useMemo(() => {
    const cols: ColumnDef<StockHoldings, any>[] = [
      // Stock Name (with link)
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
      // Current Price
      columnHelper.accessor("currentPrice", {
        header: translate["currentPrice"],
        cell: (info) => {
          const original = info.row.original;
          const price = Number(info.renderValue());
          return original.sellPrice ? translate["sold"] : formatCurrency(price, true, 0);
        },
      }),
    ];

    // Optionally add "Deviation Since Buy" when using live prices
    if (withLivePrice) {
      cols.push({
        id: "devSinceBuy",
        header: translate["dev_since_buy"],
        accessorFn: (original: StockHoldings) => {
          const buyPrice = Number(original.buyPrice);
          const currentPrice = Number(original.currentPrice);

          if (!buyPrice) return 0; // Prevents NaN errors

          return currencyDisplay === "percent"
            ? ((currentPrice - buyPrice) / buyPrice) * 100
            : (currentPrice * original.amount) - buyPrice;
        },
        enableSorting: true,
        cell: (info: CellContext<StockHoldings, any>) => {
          const original = info.row.original;
          const buyPrice = Number(original.buyPrice) || 1; // Prevent division by zero
          const currentPrice = Number(original.currentPrice);
          const amount = Number(original.amount);
          const value = (currentPrice * amount) - buyPrice;
          if (original?.sellPrice) return translate["sold"];

          if (currencyDisplay === "percent") {
            const percent = (value / buyPrice) * 100;
            return (
              <span
                className={
                  percent >= 0 ? portfolioStyles.positiveBubble : portfolioStyles.negativeBubble
                }
              >
                {formatCurrency(percent, false, 2, true)} %
              </span>
            );
          }

          
          return (
            <span className={value >= 0 ? portfolioStyles.positive : portfolioStyles.negative}>
              {formatCurrency(value, true, 0, true)}
            </span>
          );
        },
      });
    }

    // Stock Value
    cols.push({
      id: "value",
      enableSorting: true,
      accessorFn: (original: StockHoldings) =>
        Number(original?.sellPrice ?? original.currentPrice) * Number(original.amount),
      header: translate["value"],
      cell: (info: CellContext<StockHoldings, any>) => {
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
                  className="edit"
                  onClick={() => setSellPortion(original)}
                  title={translate["sell"]}
                  role="button"
                >
                  <FontAwesomeIcon icon={faScaleBalanced} />
                </div>
              </div>
            );
          },
        })
      );
    }
    return cols;
  }, [withLivePrice, currencyDisplay, isPublic, setEditStock, setSellPortion]);

  return (
    <PaginatedTable columns={columns} data={list} page={page} rowCount={rowCount} />
  );
}