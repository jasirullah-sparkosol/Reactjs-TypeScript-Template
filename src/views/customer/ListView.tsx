import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import { Button, Grid } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { useGetFilteredPersonsMutation } from 'api/services/personApi';
import AnimateButton from 'components/@extended/AnimateButton';
import Avatar from 'components/@extended/Avatar';
import SSDataTable from 'components/SSDataTable';
import { filterOperators } from 'types/root';
import { useAuthorization } from 'hooks/useAuth';
import { useCallback, useMemo, useRef } from 'react';
import { Person } from 'types/api/person';
import { formatDateTime } from 'utils/formattedDate';
import { getFullImagePath } from 'utils/imageUtils';
import { useNavigate } from 'react-router-dom';

export default function ListView() {
    const [getFilteredData, { data: rawData }] = useGetFilteredPersonsMutation();

    const { data: customers = [], totalPages = 0 } = rawData || {};

    const navigate = useNavigate();
    const { isAuthorized } = useAuthorization();
    const abortControllerRef = useRef<AbortController | null>(null);

    const getAvatar = (item: Person) => {
        if (item.profilePicture) return getFullImagePath(item.profilePicture);
        return '/assets/images/users/default.png';
    };

    const handleOnView = useCallback(
        (_item: any) => {
            if (isAuthorized('customers:view')) {
                navigate(`/customers/${_item._id}`);
            }
        },
        [isAuthorized, navigate]
    );

    const handleOnEdit = useCallback(
        (_item: any) => {
            if (isAuthorized('customers:edit')) {
                navigate(`/customers/${_item._id}/edit`);
            }
        },
        [isAuthorized, navigate]
    );

    const columns = useMemo<ColumnDef<Person>[]>(() => {
        let columns: ColumnDef<Person>[] = [
            {
                header: 'Image',
                accessorKey: 'profilePicture',
                cell: (props: any) => {
                    return <Avatar alt={props.row.original._id} src={getAvatar(props.row.original)} />;
                },
                enableColumnFilter: false
            },
            {
                header: 'Customer Number',
                accessorKey: 'odooCustomerId',
                // @ts-ignore
                filterType: 'range',
                cell: (props: any) => {
                    if (props.getValue() !== undefined) return props.getValue();
                    return 'N_A';
                }
            },
            {
                header: 'Name',
                accessorKey: 'name'
            },
            {
                header: 'Phone',
                accessorKey: 'phone'
            },
            {
                header: 'Total Points',
                accessorKey: 'points',
                // @ts-ignore
                filterType: 'range'
            },
            {
                header: 'Redeemed Points',
                accessorKey: 'redeemedPoints',
                // @ts-ignore
                filterType: 'range'
            },
            {
                header: 'Created By',
                accessorKey: 'performedBy.name',
                id: 'performedBy_name',
                cell: (props: any) => (props.getValue() !== undefined ? props.getValue() : '--')
            },
            {
                header: 'In Odoo',
                accessorKey: 'addedInOdoo',
                // @ts-ignore
                filterType: 'dropdown-boolean',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Added', value: true },
                    { label: 'Not Added', value: false }
                ],
                cell: (props) => {
                    if (props.getValue()) {
                        return <Chip color="success" label="Added" size="small" variant="light" />;
                    }
                    return <Chip color="error" label="Not Added" size="small" variant="light" />;
                }
            },
            {
                header: 'Deleted',
                accessorKey: 'deletedAt',
                // @ts-ignore
                filterType: 'dropdown-boolean',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Deleted', value: true },
                    { label: 'Active', value: false }
                ],
                cell: (props) => {
                    if (props.getValue()) {
                        return <Chip color="error" label="Deleted" size="small" variant="light" />;
                    }
                    return <Chip color="success" label="Active" size="small" variant="light" />;
                }
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                filterType: 'date',
                // @ts-ignore
                filterFn: 'dateFilter',
                cell: (props: any) => {
                    if (props.getValue()) return formatDateTime(props.getValue());
                    return 'N_A';
                }
            }
        ];

        if (isAuthorized('customers:view') || isAuthorized('customers:edit')) {
            columns.unshift({
                header: 'Action',
                accessorKey: 'action',
                cell: (props: any) => {
                    return (
                        <Stack spacing={2} direction="row" justifyContent="center" alignContent="center">
                            {isAuthorized('customers:view') && (
                                <EyeOutlined
                                    size={20}
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => handleOnView(props.row.original)}
                                />
                            )}
                            {isAuthorized('customers:edit') && (
                                <EditOutlined
                                    size={20}
                                    style={{ cursor: 'pointer', color: 'green' }}
                                    onClick={() => handleOnEdit(props.row.original)}
                                />
                            )}
                        </Stack>
                    );
                },
                enableColumnFilter: false
            });
        }

        return columns;
    }, [handleOnEdit, isAuthorized]);

    const fetchData = useCallback(
        async ({ page, pageSize, filters }: { page: number; pageSize: number; filters: ColumnFiltersState }) => {
            const filterPayload: Record<string, any> = {};
            const populated: Record<string, any> = {};

            filters.forEach(({ value, id }) => {
                const searchValue = value as any;

                const filterValue = Array.isArray(searchValue) ? searchValue.filter(Boolean) : searchValue;
                if (
                    typeof searchValue === 'boolean' ||
                    (Array.isArray(searchValue) && filterValue?.length > 1) ||
                    typeof searchValue === 'string'
                ) {
                    if (id.includes('_')) {
                        const [table, field] = id.split('_');
                        populated[`${table}[${field}]`] = value;
                    } else {
                        filterPayload[`${id}[${filterOperators[id]}]`] = value;
                    }
                }
            });

            const payload = {
                page: page + 1,
                pageSize,
                usedFor: 'customers',
                withPopulate: true,
                ...(Object.keys(filterPayload).length && {
                    filters: filterPayload
                }),
                ...(Object.keys(populated).length && {
                    populated
                })
            };

            // Create a new AbortController for the current request
            const controller = new AbortController();
            abortControllerRef.current = controller;
            const response = await getFilteredData({
                body: payload,
                signal: controller.signal
            }).unwrap();

            return {
                rows: response.data || [],
                totalRows: response.totalPages * pageSize // Or use the total row count if directly available
            };
        },
        [getFilteredData]
    );

    return (
        <>
            {isAuthorized('customers:create') && (
                <Grid item xs={12} sx={{ mb: 2 }}>
                    <Stack direction="row" justifyContent="flex-end">
                        <AnimateButton>
                            <Button variant="contained" type="button" href={'/customers/create'}>
                                Add Customers
                            </Button>
                        </AnimateButton>
                    </Stack>
                </Grid>
            )}

            <SSDataTable
                abortControllerRef={abortControllerRef}
                columns={columns}
                initialData={customers}
                fetchData={fetchData}
                totalPages={totalPages}
            />
        </>
    );
}
