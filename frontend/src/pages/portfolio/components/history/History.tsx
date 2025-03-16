// HistoryPreview.tsx
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import { CurrencyRate, StockHoldings } from "../../../../api";
import Transactions, { Transaction } from "./components/Transactions";
import HistoryDisplayToggle, { HistoryOptions } from "./components/HistoryDisplayToggle";
import SoldStocks from "./components/SoldStocks";

type HistoryProps = {
  list: StockHoldings[];
  transactions: Transaction[];
  currencyDisplay: "kr" | "percent";
  removeStock: (id: number) => void;
  setEditStock: (stock: StockHoldings) => void;
  withLivePrice?: boolean;
  isPublic?: boolean;
  currencies: CurrencyRate[];
  rowCount: number;
};

export default function History({
  currencyDisplay, list, removeStock, setEditStock, rowCount, transactions,
}: HistoryProps) {
  // Use the new history options state.
  const [displayMethod, setDisplayMethod] = useState<HistoryOptions>("sold_stocks");
  const [page, setPage] = useState(1);

  // Calculate pages based on which dataset is rendered.
  const localRowCount =
    displayMethod === "sold_stocks" ? list.length : transactions?.length;
  const maxPages = Math.ceil(localRowCount / rowCount);


  return (
    <div>
      <div className="p-1">
        <HistoryDisplayToggle
          displayMethod={displayMethod}
          setDisplayMethod={setDisplayMethod}
        />
      </div>
      {displayMethod === "sold_stocks" ? (
        <SoldStocks
          list={list}
          page={page}
          rowCount={rowCount} // adjust as needed
          currencyDisplay={currencyDisplay}
          removeStock={removeStock}
          setEditStock={setEditStock}
          isPublic={false}
        />
      ) : (
        <Transactions
          list={transactions}
          page={page}
          rowCount={rowCount} // adjust as needed
        />
      )}
      <div className="pagination-container">
        <Pagination
          size="small"
          color="primary"
          count={maxPages}
          page={page}
          onChange={(_e, v) => setPage(v)}
        />
      </div>
    </div>
  );
}