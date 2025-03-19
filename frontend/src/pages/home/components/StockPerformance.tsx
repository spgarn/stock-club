import { colors, Typography } from "@mui/material";
import { StockHoldings } from "../../../api";
import { translate } from "../../../i18n";
import portfolioStyles from "../../portfolio/portfolio.module.scss";
import { formatCurrency } from "../../../funcs/funcs";

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
            <div className="content-box" style={{ padding: "12px", rowGap: "8px" }}>
                <Typography variant="h6">{translate["todays_winner"]}</Typography>
                {biggestUp.map(stock => (
                    <div style={{ display: "grid", gridTemplateColumns: "25% min-content min-content", placeItems: "start", columnGap: "8px" }}>

                        <a
                            href={`https://finance.yahoo.com/quote/${stock.stockName}/`}
                            style={{
                                color: colors.blueGrey["400"],
                                alignSelf: "center"
                            }}
                        >
                            {stock.stockName}:
                        </a>
                        <span className={portfolioStyles.positiveBubble} style={{ minWidth: "75px", textAlign: "center" }}>
                            {formatPercentage(stock.percentageDifference)}
                        </span>


                        <span className={portfolioStyles.positive} style={{ alignSelf: "center", }}>
                            +{formatCurrency(stock.amount * (stock.currentPrice - stock.openingPrice), true, 0)}
                        </span>

                    </div>
                ))}
            </div >
            <div className="content-box" style={{ padding: "12px", rowGap: "8px" }}>
                <Typography variant="h6">{translate["todays_loser"]}</Typography>
                {biggestDown.map(stock => (
                    <div style={{ display: "grid", gridTemplateColumns: "25% min-content min-content", placeItems: "start", columnGap: "8px" }}>
                        <a
                            href={`https://finance.yahoo.com/quote/${stock.stockName}/`}
                            style={{
                                color: colors.blueGrey["400"],
                                alignSelf: "center"
                            }}
                        >
                            {stock.stockName}:
                        </a>
                        <span className={portfolioStyles.negativeBubble} style={{ minWidth: "75px", textAlign: "center" }}>
                            {formatPercentage(stock.percentageDifference)}
                        </span>

                        <span className={portfolioStyles.negative} style={{ alignSelf: "center" }}>
                            {formatCurrency(stock.amount * (stock.currentPrice - stock.openingPrice), true, 0)}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}