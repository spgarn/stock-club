import { useState } from "react";
import { getCurrencyRates, StockHoldings } from "../../../api";
import RenderStocks from "./RenderStocks";
import Pagination from "@mui/material/Pagination";
import DisplayToggle from "./DisplayToggle";
import useStocks from "./useStocks";
import { useQuery } from "@tanstack/react-query";

type IProps = { data: StockHoldings[] }
export default function StockPreview({ data }: IProps) {
    const [page, setPage] = useState(1);
    const [displayMethod, setDisplayMethod] = useState<"active_stocks" | "sold_stocks" | "all_stocks">("active_stocks");
    const { data: currency } = useQuery({
        queryKey: ["currency"],
        queryFn: getCurrencyRates,
    });

    const { EUR, USD, GBP } = currency?.rates ?? {
        EUR: undefined,
        USD: undefined,
        GBP: undefined,
    };

    const reverseRates = {
        EUR: EUR ? 1 / EUR : undefined,
        USD: USD ? 1 / USD : undefined,
        GBP: GBP ? 1 / GBP : undefined,
    };

    const {
        list
    } = useStocks(data, displayMethod, setPage,reverseRates);
    const maxPages = Math.ceil(list.length / 10);
    return <div>
        <div className="p-1">
            <DisplayToggle displayMethod={displayMethod} setDisplayMethod={setDisplayMethod} />
        </div>
        <RenderStocks reverseRates={reverseRates} list={list} page={page} rowCount={10} currencyDisplay={"kr"} displayMethod={displayMethod} removeStock={() => console.log("remove")} setEditStock={() => console.log("edit")} setSellPortion={() => console.log("sell")} withLivePrice={false} />
        <div className="pagination-container">
            <Pagination size="small" color="primary" count={maxPages} page={page} onChange={(_e, v) => setPage(v)} />
        </div>
    </div>
}