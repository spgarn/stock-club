/* eslint-disable @typescript-eslint/no-explicit-any */
/* Transactions.tsx */
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useMemo } from "react";
import PaginatedTable from "../../../../../components/PaginatedTable";

export type Transaction = {
  date: Date;
  type: string;
  amount: string;
};

const columnHelper = createColumnHelper<Transaction>();

type TransactionsProps = {
  list: Transaction[];
  page: number;
  rowCount: number;
};

export default function Transactions({
  list,
  page,
  rowCount,
}: TransactionsProps) {
  const columns: ColumnDef<Transaction, any>[] = useMemo(
    () => [
      // Date column
      columnHelper.accessor("date", {
        header: "DATE",
        cell: (info) => dayjs(info.renderValue()).format("DD/MM/YYYY"),
      }),
      // Type column
      columnHelper.accessor("type", {
        header: "TYPE",
        cell: (info) => info.renderValue(),
      }),
      // Amount column
      columnHelper.accessor("amount", {
        header: "AMOUNT",
        cell: (info) => info.renderValue(),
      }),
    ],
    []
  );

  return (
    <PaginatedTable columns={columns} data={list} page={page} rowCount={rowCount} />
  );
}