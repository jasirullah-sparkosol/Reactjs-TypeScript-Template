import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// third-party
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    HeaderGroup,
    OnChangeFn,
    RowSelectionState,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
import { LabelKeyObject } from 'react-csv/lib/core';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { EmptyTable, Filter, HeaderSort, TablePagination } from 'components/third-party/react-table';

interface ReactTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    allowRowSelection?: boolean;
    rowSelection?: RowSelectionState;
    setRowSelection?: OnChangeFn<RowSelectionState>;
}
``;

// ==============================|| REACT TABLE - PAGINATION - FILTERING - SORTING ||============================== //

export default function DataTable<T>({ columns, data, rowSelection, setRowSelection, allowRowSelection }: ReactTableProps<T>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [sorting, setSorting] = useState<SortingState>([
        {
            // @ts-ignore
            id: columns[0].accessorKey, // Sort by the first column
            desc: false
        }
    ]);

    const dateFilter = (row: any, columnId: string, [from, to]: [string, string]) => {
        const date = new Date(row.getValue(columnId));
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
            return date <= toDate;
        } else if (!isNaN(fromDate.getTime()) && isNaN(toDate.getTime())) {
            return date >= fromDate;
        } else if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
            return date >= fromDate && date <= toDate;
        } else {
            return true;
        }
    };

    const table = useReactTable<T>({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            rowSelection
        },
        filterFns: {
            dateFilter: dateFilter
        },
        enableRowSelection: allowRowSelection,
        getRowId: (row: any) => row?._id,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFacetedRowModel: getFacetedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedUniqueValues: getFacetedUniqueValues()
    });

    let headers: LabelKeyObject[] = [];
    table.getAllColumns().map((columns) =>
        headers.push({
            label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
            // @ts-ignore
            key: columns.columnDef.accessorKey
        })
    );

    return (
        <MainCard content={false}>
            <ScrollX>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                                            Object.assign(header.column.columnDef.meta, {
                                                className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                                            });
                                        }

                                        return (
                                            <TableCell
                                                key={header.id}
                                                {...header.column.columnDef.meta}
                                                onClick={header.column.getToggleSortingHandler()}
                                                {...(header.column.getCanSort() &&
                                                    header.column.columnDef.meta === undefined && {
                                                        className: 'cursor-pointer prevent-select'
                                                    })}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                                        {header.column.getCanSort() && <HeaderSort column={header.column} />}
                                                    </Stack>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell key={header.id} {...header.column.columnDef.meta}>
                                            {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.length > 0 ? (
                                <>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <EmptyTable msg="Data not found!" />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <TablePagination
                        {...{
                            setPageSize: table.setPageSize,
                            setPageIndex: table.setPageIndex,
                            getState: table.getState,
                            getPageCount: table.getPageCount
                        }}
                    />
                </Box>
            </ScrollX>
        </MainCard>
    );
}
