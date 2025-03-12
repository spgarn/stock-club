import { useMemo, useEffect } from 'react';
import { CurrencyRate, StockHoldings } from '../../../api';

export default function useStocks(
  data: StockHoldings[] | undefined,
  displayMethod: string,
  setPage: (v: number) => void,
  currencies: CurrencyRate[]
) {
  useEffect(() => {
    setPage(1);
  }, [data, setPage]);

  return useMemo(() => {
    if (!data || currencies.length === 0) {
      return { totalAmount: 0, list: [], totalValue: 0, development: 0 };
    }

    console.log(data);

    // Create a currency lookup object for quick access
    const currencyLookup = currencies.reduce((acc, c) => {
      acc[c.name] = c.rate;
      return acc;
    }, {} as Record<string, number>);

    // Function to convert prices using the lookup
    const getConvertedPrice = (price: number, currency: string): number => {
      return price * (currencyLookup[currency] || 1);
    };

    // Update current prices based on currency conversion
    const updatedStocks = data.map(stock => ({
      ...stock,
      currentPrice: getConvertedPrice(stock.currentPrice, stock.currency),
    }));

    // Split into active vs. sold
    const activeStocks = updatedStocks.filter(s => !s.sold);
    const soldStocks = updatedStocks.filter(s => s.sold);

    // Cost basis
    const activeCost = activeStocks.reduce((sum, s) => sum + s.buyPrice, 0);
    const soldCost = soldStocks.reduce((sum, s) => sum + s.buyPrice, 0);

    // Current value calculation
    const activeValue = activeStocks.reduce((sum, s) => sum + s.currentPrice * s.amount, 0);
    const soldValue = soldStocks.reduce((sum, s) => sum + (s.sellPrice ?? 0), 0);

    // Compute the displayed totals and development
    if (displayMethod === 'all_stocks') {
      const totalCost = activeCost + soldCost;
      const totalValue = activeValue + soldValue;
      const development = totalCost > 0 ? ((totalValue / totalCost) - 1) * 100 : 0;
      return {
        totalAmount: updatedStocks.length,
        list: updatedStocks,
        totalValue,
        development,
      };
    }

    if (displayMethod === 'active_stocks') {
      const development = activeCost > 0 ? ((activeValue / activeCost) - 1) * 100 : 0;
      return {
        totalAmount: activeStocks.length,
        list: activeStocks,
        totalValue: activeValue,
        development,
      };
    }

    const development = soldCost > 0 ? ((soldValue / soldCost) - 1) * 100 : 0;
    return {
      totalAmount: soldStocks.length,
      list: soldStocks,
      totalValue: soldValue,
      development,
    };
  }, [data, displayMethod, currencies, setPage]);
}