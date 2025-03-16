import { useMemo, useEffect } from 'react';
import { Transaction } from '../history/components/Transactions';

export default function useTransactions(
  list: Transaction[] | undefined,
  displayMethod: string,
  setPage: (v: number) => void,
) {
  useEffect(() => {
    setPage(1);
  }, [list, setPage]);

  return useMemo(() => {
    if (!list) {
      return { amount: 0, transactionList: [], cash:0, netDeposit: 0 };
    }

    const netDeposit = list.reduce((sum, s) => sum + +s.amount, 0);




    return {
      netDeposit: netDeposit,
      transactionList: list ?? [],
    };
  }, [list, displayMethod, setPage]);
}