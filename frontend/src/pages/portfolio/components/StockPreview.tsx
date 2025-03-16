import { useState } from "react";
import { getCurrencyRates, StockHoldings } from "../../../api";
import RenderStocks from "./RenderStocks";
import Pagination from "@mui/material/Pagination";
import DisplayToggle from "./DisplayToggle";
import useStocks from "./hooks/useStocks";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "./history/components/Transactions";
import useTransactions from "./hooks/useTransactions";

type IProps = { data: StockHoldings[], transactions: Transaction[] };
export default function StockPreview({ data, transactions }: IProps) {
    const [page, setPage] = useState(1);
    const [displayMethod, setDisplayMethod] = useState<"active_stocks" | "history">("active_stocks");
    const { data: currencies } = useQuery({
        queryKey: ["currency"],
        queryFn: getCurrencyRates,
    });


    const {
        list
    } = useStocks(data, displayMethod, setPage, currencies ?? []);
    const maxPages = Math.ceil(list.length / 10);
    const {
        transactionList
    } = useTransactions(transactions, displayMethod, setPage);
    return <div>
        <div className="p-1">
            <DisplayToggle displayMethod={displayMethod} setDisplayMethod={setDisplayMethod} />
        </div>
        <RenderStocks transactions={transactionList ?? []} currencies={currencies ?? []} list={list} page={page} rowCount={20} currencyDisplay={"kr"} displayMethod={displayMethod} removeStock={() => console.log("remove")} setEditStock={() => console.log("edit")} setSellPortion={() => console.log("sell")} withLivePrice={false} />
        <div className="pagination-container">
            <Pagination size="small" color="primary" count={maxPages} page={page} onChange={(_e, v) => setPage(v)} />
        </div>
    </div>
}