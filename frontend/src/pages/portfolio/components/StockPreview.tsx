import { useState } from "react";
import { StockHoldings } from "../../../api";
import RenderStocks from "./RenderStocks";
import Pagination from "@mui/material/Pagination";
import DisplayToggle from "./DisplayToggle";
import useStocks from "./useStocks";

type IProps = { data: StockHoldings[] }
export default function StockPreview({ data }: IProps) {
    const [page, setPage] = useState(1);
    const [displayMethod, setDisplayMethod] = useState<"active_stocks" | "sold_stocks" | "all_stocks">("active_stocks");
    const {
        list
    } = useStocks(data, displayMethod, setPage);
    const maxPages = Math.ceil(list.length / 10);
    return <div>
        <div>
            <DisplayToggle displayMethod={displayMethod} setDisplayMethod={setDisplayMethod} />
        </div>
        <RenderStocks list={list} page={page} rowCount={10} currencyDisplay={"kr"} displayMethod={displayMethod} removeStock={() => console.log("remove")} setEditStock={() => console.log("edit")} setSellPortion={() => console.log("sell")} withLivePrice={false} />
        <div className="pagination-container">
            <Pagination size="small" color="primary" count={maxPages} page={page} onChange={(_e, v) => setPage(v)} />
        </div>
    </div>
}