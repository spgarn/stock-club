import { useMemo, useEffect } from 'react';
import { StockHoldings } from '../../../api';
import { convertCurrency } from '../../../funcs/funcs';

interface ReverseRates {
  EUR?: number;
  USD?: number;
  GBP?: number;
}

export default function useStocks(
  data: StockHoldings[] | undefined,
  displayMethod: string,
  setPage: (v: number) => void,
  reverseRates: ReverseRates
) {
  // Reset pagination whenever data changes
  useEffect(() => {
    setPage(1);
  }, [data, setPage]);

  return useMemo(() => {
    if (!data) {
      return { totalAmount: 0, list: [], totalValue: 0, development: 0 };
    }

    // Split into active vs. sold
    const activeStocks = data.filter(s => !s.sold);
    const soldStocks = data.filter(s => s.sold);

    // 1) COST BASIS (buyPrice):
    //    - Active: buyPrice is already in base currency (total), so just sum.
    //    - Sold: buyPrice is also already in base currency (total), so just sum.
    const activeCost = activeStocks.reduce((sum, s) => sum + s.buyPrice, 0);
    const soldCost = soldStocks.reduce((sum, s) => sum + s.buyPrice, 0);

    // 2) CURRENT or FINAL VALUE:
    //    - Active: currentPrice is *per share* in a foreign currency => multiply by amount, then convert.
    //    - Sold: sellPrice is already total in base currency => just sum it.
    const activeValue = activeStocks.reduce((sum, s) => {
      // multiply by amount only if s.currentPrice is per-share
      const totalPerShare = s.currentPrice * s.amount;
      return sum + convertCurrency(totalPerShare, s.currency, reverseRates);
    }, 0);

    const soldValue = soldStocks.reduce((sum, s) => sum + s.sellPrice, 0);

    // Now compute the displayed totals and development
    if (displayMethod === 'all_stocks') {
      const totalCost = activeCost + soldCost;
      const totalValue = activeValue + soldValue;
      const development = totalCost > 0 ? ((totalValue / totalCost) - 1) * 100 : 0;
      return {
        totalAmount: data.length,
        list: data,
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

    // Otherwise "sold_stocks"
    const development = soldCost > 0 ? ((soldValue / soldCost) - 1) * 100 : 0;
    return {
      totalAmount: soldStocks.length,
      list: soldStocks,
      totalValue: soldValue,
      development,
    };
  }, [data, displayMethod, reverseRates, setPage]);
}