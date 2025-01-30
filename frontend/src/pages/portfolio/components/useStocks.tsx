import { useMemo } from 'react'
import { StockHoldings } from '../../../api';

export default function useStocks(data: StockHoldings[] | undefined, displayMethod: string, setPage: (v: number) => void) {
    return useMemo(() => {
        setPage(1);
        if (!data) {
            return { totalAmount: 0, list: [], totalValue: 0, development: 0 }
        }
        const currentStocks = data.filter(stock => !stock.sold);
        const soldStocks = data.filter(stock => stock.sold);

        const initial = currentStocks.reduce((prev, stock) => prev + (stock.amount * stock.buyPrice), 0);
        if (displayMethod === "all_stocks") {
            const value = currentStocks.reduce((prev, stock) => prev + (stock.amount * (stock?.sellPrice ? Number(stock.sellPrice) : stock.currentPrice)), 0);
            return { totalAmount: data.length, list: data, totalValue: value, development: ((value / initial - 1) * 100) }
        }
        if (displayMethod === "active_stocks") {
            const currentValue = currentStocks.reduce((prev, stock) => prev + (stock.amount * stock.currentPrice), 0);
            return { totalAmount: currentStocks.length, list: currentStocks, totalValue: currentValue, development: ((currentValue / initial - 1) * 100) }


        } else {
            //Not active
            const soldValue = soldStocks.reduce((prev, stock) => prev + (stock.amount * Number(stock.sellPrice)), 0);
            return { totalAmount: soldStocks.length, totalValue: soldValue, list: soldStocks, development: ((soldValue / initial - 1) * 100) }

        }
    }, [data, displayMethod]);
}
