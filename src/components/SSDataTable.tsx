import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, HeaderGroup, useReactTable } from '@tanstack/react-table';
import { Box, Divider, Paper, Stack, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { EmptyTable, Filter, HeaderSort, TablePagination } from 'components/third-party/react-table';
import { MutableRefObject, useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Spinning from './Spinning';

interface ReactTableProps<T> {
    columns: ColumnDef<T>[];
    initialData: T[];
    abortControllerRef: MutableRefObject<AbortController | null>;
    fetchData: (params: { page: number; pageSize: number; filters: ColumnFiltersState }) => Promise<{
        rows: T[];
        totalRows: number;
    }>;
    totalPages: number;
}

export default function SSDataTable<T>({ abortControllerRef, columns, initialData, fetchData, totalPages }: ReactTableProps<T>) {
    const [data, setData] = useState<T[]>(initialData);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTableData = async () => {
            let shouldFetch = true;

            columnFilters.forEach(({ value }) => {
                const searchValue = value as any;
                // Skip fetching if the search value is an array with only one item
                if (Array.isArray(searchValue) && searchValue.filter(Boolean).length === 1) {
                    shouldFetch = false;
                }
            });

            if (!shouldFetch) return;

            // Abort the previous request if it exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            setLoading(true);
            const { rows = [] } = await fetchData({ page, pageSize, filters: columnFilters });
            setData(rows);

            setLoading(false);
        };

        loadTableData();

        return () => abortControllerRef.current?.abort();
    }, [page, pageSize, columnFilters, fetchData, abortControllerRef]);

    const table = useReactTable<T>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: { columnFilters, pagination: { pageIndex: page, pageSize } },
        onColumnFiltersChange: (value) => {
            setColumnFilters(value);
            setPage(0);
        },
        manualPagination: true,
        manualFiltering: true,
        pageCount: totalPages,
        enableSorting: false
    });

    return (
        <MainCard content={false}>
            <ScrollX>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={header.column.getCanSort() ? 'cursor-pointer prevent-select' : ''}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                                {header.column.getCanSort() && <HeaderSort column={header.column} />}
                                            </Stack>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell key={header.id}>
                                            {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <Spinning loading={loading} component={'tbody'}>
                            {table.getPrePaginationRowModel().rows.length > 0 ? (
                                <>
                                    {table.getPrePaginationRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
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
                        </Spinning>
                    </Table>
                </TableContainer>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <TablePagination
                        getState={() => table.getState()}
                        getPageCount={() => totalPages}
                        setPageSize={(pageSize) => {
                            setPageSize(pageSize);
                            setPage(0);
                        }}
                        setPageIndex={(pageIndex) => setPage(pageIndex)}
                        initialPageSize={pageSize}
                    />
                </Box>
            </ScrollX>
        </MainCard>
    );
}
