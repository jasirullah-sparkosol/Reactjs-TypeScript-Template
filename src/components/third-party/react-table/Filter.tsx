// material-ui
import Stack from '@mui/material/Stack';

// third-party
import { Column, RowData, Table } from '@tanstack/react-table';

// project-import
import DebouncedInput from './DebouncedInput';

// assets
import MinusOutlined from '@ant-design/icons/MinusOutlined';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type DateInputProps = {
    columnFilterValue: [Date, Date];
    setFilterValue: (updater: any) => void;
};

// ==============================|| FILTER - NUMBER FIELD ||============================== //

function DateInput({ columnFilterValue, setFilterValue }: DateInputProps) {
    const convertDate = (date: any, from: boolean = true) => {
        if (isNaN(new Date(date).getTime())) {
            return '';
        }
        if (from) {
            return new Date(date).toISOString();
        } else {
            const toDate = new Date(date);
            toDate.setUTCHours(23, 59, 59, 999);
            return toDate.toISOString();
        }
    };

    const showDate = (date: any) => {
        if (isNaN(new Date(date).getTime())) {
            return '';
        }
        return new Date(date).toISOString().split('T')[0];
    };
    const date1 = new Date(columnFilterValue?.[0]);
    const date2 = new Date(columnFilterValue?.[1]);

    return (
        <>
            <Stack direction="row" spacing={1} alignItems="center">
                <DebouncedInput
                    type="date"
                    value={showDate(columnFilterValue?.[0]) ?? ''}
                    onFilterChange={(value) => {
                        setFilterValue((old: [string, string]) => {
                            return [convertDate(value), old?.[1]];
                        });
                    }}
                    fullWidth
                    size="small"
                    startAdornment={false}
                />
                <>
                    <MinusOutlined />
                </>
                <DebouncedInput
                    type="date"
                    value={showDate(columnFilterValue?.[1]) ?? ''}
                    onFilterChange={(value) => {
                        setFilterValue((old: [string, string]) => {
                            return [old?.[0], convertDate(value, false)];
                        });
                    }}
                    fullWidth
                    size="small"
                    startAdornment={false}
                />
            </Stack>
            {date2 < date1 && (
                <span style={{ color: 'red', fontSize: '10px' }}>&quot;To&quot; date cannot be earlier than the &quot;From&quot; date</span>
            )}
        </>
    );
}

type NumberInputProps = {
    columnFilterValue: [number, number];
    getFacetedMinMaxValues: () => [number, number] | undefined;
    setFilterValue: (updater: any) => void;
};

// ==============================|| FILTER - NUMBER FIELD ||============================== //

function NumberInput({ columnFilterValue, getFacetedMinMaxValues, setFilterValue }: NumberInputProps) {
    const minOpt = getFacetedMinMaxValues()?.[0];
    const min = Number(minOpt ?? '');

    const maxOpt = getFacetedMinMaxValues()?.[1];
    const max = Number(maxOpt);

    return (
        <>
            <Stack direction="row" spacing={1} alignItems="center">
                <DebouncedInput
                    type="number"
                    value={columnFilterValue?.[0] ?? ''}
                    onFilterChange={(value) => setFilterValue((old: [number, number]) => [value, old?.[1]])}
                    placeholder={`Min ${minOpt ? `(${min})` : ''}`}
                    fullWidth
                    inputProps={{ min: min, max: max }}
                    size="small"
                    startAdornment={false}
                    error={Number(columnFilterValue?.[0]) > Number(columnFilterValue?.[1])}
                />
                <>
                    <MinusOutlined />
                </>
                <DebouncedInput
                    type="number"
                    value={columnFilterValue?.[1] ?? ''}
                    onFilterChange={(value) => setFilterValue((old: [number, number]) => [old?.[0], value])}
                    placeholder={`Max ${maxOpt ? `(${max})` : ''}`}
                    fullWidth
                    inputProps={{ min: min, max: max }}
                    size="small"
                    startAdornment={false}
                    error={Number(columnFilterValue?.[0]) > Number(columnFilterValue?.[1])}
                />
            </Stack>
            {Number(columnFilterValue?.[0]) > Number(columnFilterValue?.[1]) && (
                <span style={{ color: 'red', fontSize: '10px' }}>Min should be less than Max</span>
            )}
        </>
    );
}

type TextInputProps = {
    columnId: string;
    columnFilterValue: string;
    setFilterValue: (updater: any) => void;
    header?: string;
};

// ==============================|| FILTER - TEXT FIELD ||============================== //

function TextInput({ columnId, columnFilterValue, header, setFilterValue }: TextInputProps) {
    const dataListId = columnId + 'list';

    return (
        <DebouncedInput
            type="text"
            fullWidth
            value={columnFilterValue ?? ''}
            onFilterChange={(value) => setFilterValue(value)}
            placeholder={`Search ${header}`}
            inputProps={{ list: dataListId }}
            size="small"
            startAdornment={false}
        />
    );
}

type Props<T extends RowData> = {
    column: Column<T, unknown>;
    table: Table<T>;
};

// ==============================|| FILTER - INPUT ||============================== //

export default function Filter<T extends RowData>({ column, table }: Props<T>) {
    const columnFilterValue = column.getFilterValue();

    // @ts-ignore
    if (column.columnDef.filterType === 'dropdown-boolean') {
        return (
            <Select
                value={(columnFilterValue as string) ?? ''}
                onChange={(e) => {
                    if (e.target.value === 'true') {
                        column.setFilterValue(true);
                    } else if (e.target.value === 'false') {
                        column.setFilterValue(false);
                    } else {
                        column.setFilterValue(e.target.value);
                    }
                }}
                displayEmpty
                size="small"
                variant="outlined"
            >
                {// @ts-ignore
                column.columnDef?.options?.map((option: { label: string; value: string }, index: number) => (
                    <MenuItem value={option.value} key={index}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        );
        // @ts-ignore
    }
    // @ts-ignore
    if (column.columnDef.filterType === 'dropdown-text') {
        return (
            <Select
                value={(columnFilterValue as string) ?? ''}
                onChange={(e) => column.setFilterValue(e.target.value)}
                displayEmpty
                size="small"
                variant="outlined"
            >
                {// @ts-ignore
                column.columnDef?.options?.map((option: { label: string; value: string }, index: number) => (
                    <MenuItem value={option.value} key={index}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        );
    }
    // @ts-ignore
    else if (column.columnDef.filterType === 'date') {
        return <DateInput columnFilterValue={columnFilterValue as [Date, Date]} setFilterValue={column.setFilterValue} />;
        // @ts-ignore
    } else if (column.columnDef.filterType === 'range') {
        return (
            <NumberInput
                columnFilterValue={columnFilterValue as [number, number]}
                getFacetedMinMaxValues={column.getFacetedMinMaxValues}
                setFilterValue={column.setFilterValue}
            />
        );
    } else {
        return (
            <TextInput
                columnId={column.id}
                columnFilterValue={columnFilterValue as string}
                setFilterValue={column.setFilterValue}
                header={column.columnDef.header as string}
            />
        );
    }
}
