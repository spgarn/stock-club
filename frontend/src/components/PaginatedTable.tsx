
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { translate } from '../i18n';
import { faSortUp } from "@fortawesome/free-solid-svg-icons/faSortUp";
import { faSortDown } from "@fortawesome/free-solid-svg-icons/faSortDown";
import { faSort } from "@fortawesome/free-solid-svg-icons/faSort";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    loading?: boolean;
    sorting?: boolean;
    page: number;
    rowCount: number;
}
const PaginatedTable = <T,>({ columns, data, rowCount, page, }: TableProps<T>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const pagination = {
        pageIndex: page - 1,
        pageSize: rowCount
    };
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            pagination,
            sorting
        },
        onSortingChange: setSorting,
    });
    if (data?.length === 0) {
        return <div className='align-center'>
            <Typography variant='h5'>{translate["empty_table"]}</Typography>
        </div>
    }
    return (
        <TableContainer component={Paper}>
            <Table aria-label="Sorted table" className='sort-table'>
                <TableHead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        whiteSpace: "nowrap",
                                    }}
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={
                                        header.column.getCanSort()
                                            ? "clickable"
                                            : ""
                                    }
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef
                                                .header,
                                            header.getContext()
                                        )}
                                    {{
                                        asc: (
                                            <FontAwesomeIcon
                                                icon={faSortUp}
                                                style={{
                                                    marginLeft: 5,
                                                }}
                                                size='sm'
                                            />
                                        ),
                                        desc: (
                                            <FontAwesomeIcon
                                                icon={faSortDown}
                                                style={{
                                                    marginLeft: 5,
                                                }}
                                                size='sm'
                                            />
                                        ),
                                    }[
                                        header.column.getIsSorted() as string
                                    ] ?? (header.column.getCanSort() &&
                                        <FontAwesomeIcon
                                            icon={faSort}
                                            style={{
                                                marginLeft: 5,
                                            }}
                                            size='sm'
                                        />
                                        )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PaginatedTable;