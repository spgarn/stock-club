import { colors, Typography } from "@mui/material";
import { CurrencyRate, StockHoldings } from "../../../api";
import { translate } from "../../../i18n";
import portfolioStyles from "../../portfolio/portfolio.module.scss";
import { formatCurrency } from "../../../funcs/funcs";
import Loading from "../../../components/Loading";

// Helper function for formatting percentage values
const formatPercentage = (value: number): string => `${value.toFixed(2)}%`;

export const StockPerformance = ({ stocks, currencies }: { stocks: StockHoldings[], currencies: CurrencyRate[] }) => {

    const totalStockDifference = stocks.reduce(
        (acc, stock) => {
            const valueDiff = (stock.currentPrice - stock.openingPrice) * stock.amount;
            const totalOpeningValue = stock.openingPrice * stock.amount;

            return {
                numberDiff: acc.numberDiff + valueDiff,
                percentDiff: acc.percentDiff + totalOpeningValue,
            };
        },
        { numberDiff: 0, percentDiff: 0 }
    );

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

    // Create a currency lookup object for quick access
    const currencyLookup = currencies.reduce((acc, c) => {
        acc[c.name] = c.rate;
        return acc;
    }, {} as Record<string, number>);

    // Function to convert prices using the lookup
    const getConvertedPrice = (price: number, currency: string): number => {
        return price * (currencyLookup[currency] || 1);
    };

    if (stocks.length === 0) return <Loading />

    return (
        <>
            <div className="content-box" style={{ padding: "12px", rowGap: "8px" }}>
                <Typography variant="h6">{translate["todays_difference"]}</Typography>
                <div style={{ display: "grid", gridTemplateColumns: "25% min-content min-content", placeItems: "center", columnGap: "8px" }}>
                    <Typography
                        style={{
                            color: colors.blueGrey["400"],
                            alignSelf: "center",
                            justifySelf: "start"
                        }}
                    >
                        {translate["total_value"]}:
                    </Typography>
                    <span className={totalStockDifference.numberDiff >= 0 ? portfolioStyles.positiveBubble : portfolioStyles.negativeBubble} style={{ minWidth: "75px", textAlign: "center" }}>
                        {formatPercentage((totalStockDifference.numberDiff / totalStockDifference.percentDiff) * 100)}
                    </span>
                    <span className={totalStockDifference.numberDiff >= 0 ? portfolioStyles.positive : portfolioStyles.negative}>
                        {totalStockDifference.numberDiff >= 0 ? "+" + formatCurrency(totalStockDifference.numberDiff, true, 0) : "-" + formatCurrency(totalStockDifference.numberDiff, true, 0)}
                    </span>
                </div>
            </div>
            <div className="content-box" style={{ padding: "12px", rowGap: "8px" }}>
                <Typography variant="h6">{translate["todays_winner"]}</Typography>
                {biggestUp.map(stock => (
                    <div key={stock.id} style={{ display: "grid", gridTemplateColumns: "25% min-content min-content", placeItems: "start", columnGap: "8px" }}>

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
                            +{formatCurrency(stock.amount * getConvertedPrice((stock.currentPrice - stock.openingPrice), stock.currency), true, 0)}
                        </span>

                    </div>
                ))}
            </div >
            <div className="content-box" style={{ padding: "12px", rowGap: "8px" }}>
                <Typography variant="h6">{translate["todays_loser"]}</Typography>
                {biggestDown.map(stock => (
                    <div key={stock.id + stock.currentPrice} style={{ display: "grid", gridTemplateColumns: "25% min-content min-content", placeItems: "start", columnGap: "8px" }}>
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
                            {formatCurrency(stock.amount * getConvertedPrice((stock.currentPrice - stock.openingPrice), stock.currency), true, 0)}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}