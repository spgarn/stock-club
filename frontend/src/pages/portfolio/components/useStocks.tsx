import { useMemo, useEffect } from 'react';
import { StockHoldings } from '../../../api';
import { convertCurrency } from '../../../funcs/funcs';

export default function useStocks(
  data: StockHoldings[] | undefined,
  displayMethod: string,
  setPage: (v: number) => void,
  reverseRates: { EUR?: number; USD?: number; GBP?: number }
) {
  useEffect(() => {
    // Reset page whenever 'data' changes
    setPage(1);
  }, [data, setPage]);

  return useMemo(() => {
    if (!data) {
      return { totalAmount: 0, list: [], totalValue: 0, development: 0 };
    }

    // Separate active and sold
    const activeStocks = data.filter(s => !s.sold);
    const soldStocks = data.filter(s => s.sold);

    // --- ACTIVE STOCKS ---
    // cost basis for active stocks (buyPrice * amount, converted)
    const activeInitial = activeStocks.reduce(
      (sum, s) => sum + s.amount * convertCurrency(s.buyPrice, s.currency, reverseRates),
      0
    );
    // current market value for active stocks (currentPrice * amount, converted)
    const activeValue = activeStocks.reduce(
      (sum, s) => sum + s.amount * convertCurrency(s.currentPrice, s.currency, reverseRates),
      0
    );

    // --- SOLD STOCKS ---
    // cost basis for sold stocks
    // (Depending on your data, you may need to multiply by amount or convertCurrency
    //  if buyPrice is a per-share figure. If buyPrice is already total cost, skip the multiply.)
    const soldInitial = soldStocks.reduce(
      (sum, s) => sum + convertCurrency(s.buyPrice, s.currency, reverseRates),
      0
    );
    // total proceeds for sold stocks (assuming sellPrice is already total, no multiply)
    const soldValue = soldStocks.reduce(
      (sum, s) => sum + Number(s.sellPrice),
      0
    );

    if (displayMethod === 'all_stocks') {
      // Combine both active and sold for total
      const totalInitial = activeInitial + soldInitial;
      const totalValue = activeValue + soldValue;
      const development = totalInitial
        ? ((totalValue / totalInitial) - 1) * 100
        : 0;

      return {
        totalAmount: data.length,
        list: data,
        totalValue,
        development,
      };
    } 
    
    if (displayMethod === 'active_stocks') {
      // Only active
      const development = activeInitial
        ? ((activeValue / activeInitial) - 1) * 100
        : 0;

      return {
        totalAmount: activeStocks.length,
        list: activeStocks,
        totalValue: activeValue,
        development,
      };
    }

    // Otherwise "sold_stocks"
    // Only sold
    const development = soldInitial
      ? ((soldValue / soldInitial) - 1) * 100
      : 0;

    return {
      totalAmount: soldStocks.length,
      list: soldStocks,
      totalValue: soldValue,
      development,
    };
  }, [data, displayMethod, reverseRates]);
}