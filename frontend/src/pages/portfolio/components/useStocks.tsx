import { useMemo, useEffect } from 'react';
import { StockHoldings } from '../../../api';
import { convertCurrency } from '../../../funcs/funcs';

export default function useStocks(
    data: StockHoldings[] | undefined,
    displayMethod: string,
    setPage: (v: number) => void,
    reverseRates: { EUR?: number; USD?: number; GBP?: number }
) {
    // Move side-effects out of useMemo
    useEffect(() => {
        setPage(1);
    }, [data, setPage]);

    return useMemo(() => {
        if (!data) {
            return { totalAmount: 0, list: [], totalValue: 0, development: 0 };
        }

        // Separate active and sold stocks
        const currentStocks = data.filter((stock) => !stock.sold);
        const soldStocks = data.filter((stock) => stock.sold);

        // Calculate initial investment from active stocks (using buyPrice converted to base currency)
        const initial = currentStocks.reduce(
            (prev, stock) =>
                prev +
                stock.amount * convertCurrency(stock.buyPrice, stock.currency, reverseRates),
            0
        );

        console.log({ currentStocks, soldStocks, initial });


        if (displayMethod === 'all_stocks') {
            // For active stocks, we use the current or sellPrice (if available) multiplied by the amount
            const activeValue = currentStocks.reduce((prev, stock) => {
                const price = stock.sellPrice ? Number(stock.sellPrice) : stock.currentPrice;
                return prev + stock.amount * convertCurrency(price, stock.currency, reverseRates);
            }, 0);
            // For sold stocks, we now simply use the sellPrice directly (without conversion or multiplication)
            const soldValue = soldStocks.reduce(
                (prev, stock) => prev + Number(stock.sellPrice),
                0
            );
            const totalValue = activeValue + soldValue;
            return {
                totalAmount: data.length,
                list: data,
                totalValue,
                development: ((totalValue / initial - 1) * 100),
            };
        }

        if (displayMethod === 'active_stocks') {
            const activeValue = currentStocks.reduce(
                (prev, stock) =>
                    prev +
                    stock.amount *
                    convertCurrency(stock.currentPrice, stock.currency, reverseRates),
                0
            );
            return {
                totalAmount: currentStocks.length,
                list: currentStocks,
                totalValue: activeValue,
                development: ((activeValue / initial - 1) * 100),
            };
        } else {
            // For sold stocks, simply sum the sellPrice values without converting or multiplying by the amount
            const soldValue = soldStocks.reduce(
                (prev, stock) => prev + Number(stock.sellPrice),
                0
            );
            return {
                totalAmount: soldStocks.length,
                list: soldStocks,
                totalValue: soldValue,
                development: ((soldValue / initial - 1) * 100),
            };
        }
    }, [data, displayMethod, reverseRates]);
}