import { CurrencyRate, StockHoldings } from "../../../api";
import ActiveStocks from "./activeStocks/ActiveStocks";
import { Transaction } from "./history/components/Transactions";
import History from "./history/History";

type RenderStocksProps = {
    list: StockHoldings[];
    transactions: Transaction[]
    page: number;
    rowCount: number;
    currencyDisplay: "kr" | "percent";
    displayMethod: "active_stocks" | "history";
    removeStock: (id: number) => void;
    setEditStock: (stock: StockHoldings) => void;
    setSellPortion: (stock: StockHoldings) => void;
    withLivePrice?: boolean;
    isPublic?: boolean;
    currencies: CurrencyRate[];
};

export default function RenderStocks(props: RenderStocksProps) {
    return props.displayMethod === "active_stocks" ? (
        <ActiveStocks {...props} />
    ) : (
        <History {...props} />
    );
}