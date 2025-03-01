import { useMemo, useEffect } from 'react';
import { StockHoldings } from '../../../api';
import { convertCurrency } from '../../../funcs/funcs';

export default function useStocks(
  data: StockHoldings[] | undefined,
  displayMethod: string,
  setPage: (v: number) => void,
  reverseRates: { EUR?: number; USD?: number; GBP?: number }
) {
  // Ensure page resets when data changes
  useEffect(() => {
    setPage(1);
  }, [data, setPage]);

  return useMemo(() => {
    if (!data) {
      return { totalAmount: 0, list: [], totalValue: 0, development: 0 };
    }

    // Separate active and sold stocks
    const activeStocks = data.filter((stock) => !stock.sold);
    const soldStocks = data.filter((stock) => stock.sold);

    // For active stocks, the initial investment and current value are based on the unit cost multiplied by the amount.
    const activeInitial = activeStocks.reduce(
      (prev, stock) =>
        prev +
        stock.amount *
          convertCurrency(stock.buyPrice, stock.currency, reverseRates),
      0
    );
    const activeValue = activeStocks.reduce(
      (prev, stock) =>
        prev +
        stock.amount *
          convertCurrency(stock.currentPrice, stock.currency, reverseRates),
      0
    );

    // For sold stocks, assume the sellPrice is the aggregated sale price.
    // Thus, the sold initial is computed per unit (without multiplying by amount)
    // so that the percent development is calculated per stock.
    const soldInitial = soldStocks.reduce(
      (prev, stock) =>
        prev + convertCurrency(stock.buyPrice, stock.currency, reverseRates),
      0
    );
    const soldValue = soldStocks.reduce(
      (prev, stock) => prev + Number(stock.sellPrice),
      0
    );

    if (displayMethod === 'all_stocks') {
      // For all stocks, combine the active and sold sides.
      const totalInitial = activeInitial + soldInitial;
      const totalValue = activeValue + soldValue;
      return {
        totalAmount: data.length,
        list: data,
        totalValue,
        development:
          totalInitial > 0 ? ((totalValue / totalInitial - 1) * 100) : 0,
      };
    }

    if (displayMethod === 'active_stocks') {
      return {
        totalAmount: activeStocks.length,
        list: activeStocks,
        totalValue: activeValue,
        development:
          activeInitial > 0 ? ((activeValue / activeInitial - 1) * 100) : 0,
      };
    } else {
      // For sold stocks, use their own initial and value
      return {
        totalAmount: soldStocks.length,
        list: soldStocks,
        totalValue: soldValue,
        development:
          soldInitial > 0 ? ((soldValue / soldInitial - 1) * 100) : 0,
      };
    }
  }, [data, displayMethod, reverseRates]);
}