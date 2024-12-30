import { useCallback, useState } from 'react';

// material-ui
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { PaginationState } from '@tanstack/react-table';

interface TablePaginationProps {
    pagination: PaginationState;
    count: number;
    disabled?: boolean;
    onPaginationChange?: (state: PaginationState) => void;
}

// ==============================|| TABLE PAGINATION ||============================== //

export default function ServerPagination({ pagination, count, onPaginationChange, disabled }: TablePaginationProps) {
    const [open, setOpen] = useState(false);
    let options: number[] = [10, 25, 50, 100];
    const { pageSize = 0, pageIndex = 10 } = pagination;
    if (pageSize) {
        options = [...options, pageSize]
            .filter((item, index) => [...options, pageSize].indexOf(item) === index)
            .sort(function (a, b) {
                return a - b;
            });
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleChangePagination = useCallback(
        (_: React.ChangeEvent<unknown>, value: number) => {
            const newPage = value - 1;
            const { pageIndex } = pagination;
            if (newPage === pageIndex) return;
            onPaginationChange?.({ ...pagination, pageIndex: newPage });
        },
        [onPaginationChange, pagination]
    );

    const handleChange = useCallback(
        (event: SelectChangeEvent<number>) => {
            const newSize = Number(event.target.value);
            const { pageSize } = pagination;
            if (newSize === pageSize) return;
            onPaginationChange?.({ ...pagination, pageSize: newSize });
        },
        [onPaginationChange, pagination]
    );

    return (
        <Grid spacing={1} container alignItems="center" justifyContent="space-between" sx={{ width: 'auto' }}>
            <Grid item>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="secondary">
                            Row per page
                        </Typography>
                        <FormControl sx={{ m: 1 }}>
                            <Select
                                id="demo-controlled-open-select"
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={pageSize}
                                onChange={handleChange}
                                disabled={disabled}
                                size="small"
                                sx={{ '& .MuiSelect-select': { py: 0.75, px: 1.25 } }}
                            >
                                {options.map((option: number) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Typography variant="caption" color="secondary">
                        Go to
                    </Typography>
                    <TextField
                        size="small"
                        type="number"
                        value={pageIndex + 1}
                        disabled={disabled}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            onPaginationChange?.({ ...pagination, pageIndex: page });
                        }}
                        sx={{
                            '& .MuiOutlinedInput-input': { py: 0.75, px: 1.25, width: 36 }
                        }}
                    />
                </Stack>
            </Grid>
            <Grid item sx={{ mt: { xs: 2, sm: 0 } }}>
                <Pagination
                    sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
                    count={count}
                    page={pageIndex + 1}
                    disabled={disabled}
                    onChange={handleChangePagination}
                    color="primary"
                    variant="combined"
                    showFirstButton
                    showLastButton
                />
            </Grid>
        </Grid>
    );
}
