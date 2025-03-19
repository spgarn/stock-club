import { colors, Typography } from "@mui/material";
import { StockHoldings } from "../../../api";
import { translate } from "../../../i18n";
import portfolioStyles from "../../portfolio/portfolio.module.scss";

// Helper function for formatting percentage values
const formatPercentage = (value: number): string => `${value.toFixed(2)}%`;

export const StockPerformance = ({ stocks }: { stocks: StockHoldings[] }) => {
    // Compute the percentage difference for each stock.
    const stocksWithDiff = stocks.map(stock => ({
        ...stock,
        percentageDifference: ((stock.currentPrice - stock.openingPrice) / stock.openingPrice) * 100
    }));

    // Sort stocks based on the percentage difference in descending order.
    const sortedStocks = stocksWithDiff.sort(
        (a, b) => b.percentageDifference - a.percentageDifference
    );

    // Get the 5 biggest upward movements and 5 biggest downward movements.
    const biggestUp = sortedStocks.slice(0, 5);
    const biggestDown = sortedStocks.slice(-5);

    return (
        <>
            <div className="content-box" style={{ padding: "12px" }}>
                <Typography variant="h6">{translate["todays_winner"]}</Typography>
                {biggestUp.map(stock => (
                    <div key={stock.id} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <a
                            href={`https://finance.yahoo.com/quote/${stock.stockName}/`}
                            style={{
                                color: colors.blueGrey["400"],
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            {stock.stockName}:
                        </a>
                        <span className={portfolioStyles.positiveBubble}>
                            {formatPercentage(stock.percentageDifference)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="content-box" style={{ padding: "12px" }}>
                <Typography variant="h6">{translate["todays_loser"]}</Typography>
                {biggestDown.map(stock => (
                    <div key={stock.id} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <a
                            href={`https://finance.yahoo.com/quote/${stock.stockName}/`}
                            style={{
                                color: colors.blueGrey["400"],
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            {stock.stockName}:
                        </a>
                        <span className={portfolioStyles.negativeBubble}>
                            {formatPercentage(stock.percentageDifference)}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}