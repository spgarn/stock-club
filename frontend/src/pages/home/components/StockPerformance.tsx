import { colors, Typography } from "@mui/material";
import { StockHoldings } from "../../../api";
import { formatCurrency } from "../../../funcs/funcs";
import { translate } from "../../../i18n";

export const StockPerformance = ({ stocks }: { stocks: StockHoldings[] }) => {
    // Compute the difference for each stock
    const stocksWithDiff = stocks.map(stock => ({
        ...stock,
        priceDifference: stock.currentPrice - stock.openingPrice
    }));

    // Sort stocks based on the price difference in descending order
    const sortedStocks = stocksWithDiff.sort(
        (a, b) => b.priceDifference - a.priceDifference
    );

    // Get the 5 biggest upward movements and 5 biggest downward movements
    const biggestUp = sortedStocks.slice(0, 5);
    const biggestDown = sortedStocks.slice(-5);

    return (
        <>
            <Typography variant="h5">{translate["info"]}</Typography>
            <div className="content-box" style={{ padding: "12px" }}>
                <Typography variant="h6">{translate["todays_winner"]}</Typography>
                {biggestUp.map(stock => (
                    <div key={stock.id} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <a
                            href={`https://finance.yahoo.com/quote/${stock.stockName}/`}
                            style={{ color: colors.blueGrey["400"] }}
                        >
                            {stock.stockName}:</a>
                        <span>{formatCurrency(stock.priceDifference)}</span>
                    </div>
                ))}
            </div>
            <div className="content-box" style={{ padding: "12px" }}>
                <Typography variant="h6">{translate["todays_loser"]}</Typography>
                {biggestDown.map(stock => (
                    <div key={stock.id} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <span style={{ color: colors.blueGrey["400"] }}>{stock.stockName}:</span>
                        <span>{formatCurrency(stock.priceDifference)}</span>
                    </div>
                ))}
            </div>
        </>
    );
};
