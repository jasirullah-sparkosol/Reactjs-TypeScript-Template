import { useEffect, useMemo, useState } from 'react';
import DataTable from 'components/DataTable';
import Stack from '@mui/material/Stack';
import { dispatch } from 'store';
import { Gift } from 'types/api/gift';
import Loader from 'components/Loader';
import Button from '@mui/material/Button';
import { SnackbarProps } from 'types/snackbar';
import Avatar from 'components/@extended/Avatar';
import { getFullImagePath } from 'utils/imageUtils';
import { openSnackbar } from 'store/reducers/snackbar';
import { useGetGiftsQuery } from 'api/services/giftApi';
import useAuth, { useAuthorization } from 'hooks/useAuth';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useLazyGetPersonQuery } from 'api/services/personApi';
import AnimateButton from 'components/@extended/AnimateButton';
import { usePostUserGiftMutation } from 'api/services/userGiftApi';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { IndeterminateCheckbox } from 'components/third-party/react-table';
import { useParams } from 'react-router';

const CoinSvg = '/assets/images/icons/coin.svg';

export default function DetailsView() {
    const [refetch, { data: customer, isLoading: customerLoading }] = useLazyGetPersonQuery();
    // @ts-ignore
    const { data, refetch: giftRefetch, isLoading: giftsLoading } = useGetGiftsQuery(null, { refetchOnMountOrArgChange: true });
    const [postUserGift, { isLoading: historyLoading }] = usePostUserGiftMutation();

    const { id } = useParams();
    const { user } = useAuth();
    const { isAuthorized } = useAuthorization();

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [customerPoints, setCustomerPoints] = useState(0);

    const getAvatar = (item: Gift) => {
        if (item.image && item.image.length > 0) {
            return getFullImagePath(item.image);
        }
        return '/assets/images/gift/default.png';
    };

    const columns = useMemo<ColumnDef<Gift>[]>(() => {
        const columns = [
            {
                header: 'Image',
                accessorKey: 'image',
                cell: (props: any) => {
                    return <Avatar alt={props.row.original._id} src={getAvatar(props.row.original)} />;
                },
                enableColumnFilter: false
            },
            {
                header: 'Name',
                accessorKey: 'name'
            },
            {
                header: 'Points',
                accessorKey: 'points',
                // @ts-ignore
                filterType: 'range'
            }
        ];

        if (isAuthorized('gifts:redeem') || isAuthorized('gifts:redeemAll')) {
            columns.unshift({
                // @ts-ignore
                id: '#',
                header: '#',
                cell: ({ row }: { row: any }) => {
                    return (
                        <IndeterminateCheckbox
                            {...{
                                checked: row.getIsSelected(),
                                disabled: customerPoints < row.original.points ? true : !row.getCanSelect(),
                                indeterminate: row.getIsSomeSelected(),
                                onChange: row.getToggleSelectedHandler()
                            }}
                        />
                    );
                },
                enableColumnFilter: false
            });
        }
        if (isAuthorized('gifts:redeem')) {
            columns.push({
                header: 'Action',
                accessorKey: 'action',
                cell: (props: any) => {
                    return (
                        <Stack direction="row" justifyContent="flex-start">
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    type="button"
                                    size="small"
                                    color="success"
                                    disabled={customerPoints < props.row.original.points || historyLoading}
                                    onClick={() => handleOnSingleRedemption(props.row.original)}
                                >
                                    <img src={CoinSvg} width={15} height={15} alt="coin" style={{ marginRight: '5px' }} />
                                    {historyLoading ? 'Please wait...' : `${customerPoints ?? 0} / ${props.row.original.points}`}
                                </Button>
                            </AnimateButton>
                        </Stack>
                    );
                },
                enableColumnFilter: false
            });
        }

        return columns;
    }, [isAuthorized]);

    const selectedGiftIds = useMemo(() => {
        return Object.keys(rowSelection).filter((key) => rowSelection[key]);
    }, [rowSelection]);

    const totalPoints = useMemo(() => {
        if (data && data.length > 0) {
            return Object.keys(rowSelection).reduce((acc, key) => {
                const item = data.find((item) => item._id === key);
                return acc + ((rowSelection[key] && item?.points) || 0);
            }, 0);
        }
        return 0;
    }, [rowSelection, data]);

    const enableAllRedeemOption = useMemo(() => {
        return selectedGiftIds.length > 0 && totalPoints;
    }, [selectedGiftIds, totalPoints]);

    // methods
    const handleOnSingleRedemption = async (gift: Gift) => {
        if (gift && gift._id && id) {
            const response = await postUserGift({
                user: customer?._id,
                gifts: [gift._id.toString()],
                status: 'PENDING',
                isExpired: false,
                totalPoints: gift.points,
                redeemedBy: user?._id
            });

            if (response.error as FetchBaseQueryError) {
                //@ts-ignore
                const errorMessage = response?.error?.data?.message;

                let messageToDisplay;
                if (Array.isArray(errorMessage)) {
                    messageToDisplay = errorMessage[0];
                } else if (typeof errorMessage === 'string') {
                    messageToDisplay = errorMessage;
                } else {
                    messageToDisplay = 'Error in creating Gift history!';
                }

                dispatch(
                    openSnackbar({
                        open: true,
                        message: messageToDisplay,
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    } as SnackbarProps)
                );

                return;
            }

            dispatch(
                openSnackbar({
                    open: true,
                    message: `Single Gift redeemed successfully, please complete it!`,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                } as SnackbarProps)
            );

            setRowSelection({});

            await refetch(id);
        }
    };

    const handleOnMultipleRedemption = async () => {
        if (selectedGiftIds && selectedGiftIds.length > 0 && totalPoints && id) {
            const response = await postUserGift({
                user: customer?._id,
                gifts: selectedGiftIds,
                status: 'PENDING',
                isExpired: false,
                totalPoints: totalPoints,
                redeemedBy: user?._id ?? ''
            });

            if (response.error as FetchBaseQueryError) {
                //@ts-ignore
                const errorMessage = response?.error?.data?.message;

                let messageToDisplay;
                if (Array.isArray(errorMessage)) {
                    messageToDisplay = errorMessage[0];
                } else if (typeof errorMessage === 'string') {
                    messageToDisplay = errorMessage;
                } else {
                    messageToDisplay = 'Error in creating Gifts redemption history';
                }

                dispatch(
                    openSnackbar({
                        open: true,
                        message: messageToDisplay,
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    } as SnackbarProps)
                );

                return;
            }

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Multiple Gifts redeemed successfully, please complete them',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                } as SnackbarProps)
            );

            setRowSelection({});

            await refetch(id);
        }
    };

    // on mount
    useEffect(() => {
        giftRefetch();
    }, []);

    useEffect(() => {
        if (id) refetch(id);
    }, [id]);

    useEffect(() => {
        if (customer && customer?.points) {
            setCustomerPoints(customer?.points);
        } else {
            setCustomerPoints(0);
        }
    }, [customer]);

    if (customerLoading || giftsLoading) {
        return <Loader />;
    }

    return (
        <>
            {customer && (
                <>
                    <Stack spacing={2} direction="row" justifyContent="starts" alignContent="center">
                        <h2>Customer Details</h2>
                    </Stack>

                    <Stack spacing={2} direction="row" alignContent="center">
                        <div style={{ width: '50%' }}>
                            {customer.name && <p>Name: {customer.name}</p>}
                            {customer.email && <p>Email: {customer.email}</p>}
                            {customer.phone && <p>Phone: {customer.phone}</p>}
                            {customer.address && <p> Address: {customer.address}</p>}
                            {customer.country && <p> Customer: {customer.country}</p>}
                        </div>
                        <div style={{ width: '50%' }}>
                            {customer.odooCustomerId && <p>Customer ID#: {customer.odooCustomerId}</p>}
                            {customer.addedInOdoo && <p>In odoo: {customer.addedInOdoo ? 'Yes' : 'No'}</p>}
                            <p>Points: {customer.points}</p>
                            <p>Redeemed Points: {customer.redeemedPoints}</p>
                        </div>
                    </Stack>
                </>
            )}

            {data && (
                <>
                    <Stack spacing={2} direction="row" justifyContent="space-between" alignContent="center" style={{ margin: '10px 0' }}>
                        <h2>Gifts Details</h2>
                        {isAuthorized('gifts:redeemAll') && enableAllRedeemOption && (
                            <AnimateButton>
                                <Button
                                    disabled={historyLoading}
                                    variant="contained"
                                    type="button"
                                    color="success"
                                    onClick={() => handleOnMultipleRedemption()}
                                >
                                    <img src={CoinSvg} width={15} height={15} alt="coin" style={{ marginRight: '5px' }} />
                                    {historyLoading ? 'Please wait...' : `(${totalPoints}) Redeem All`}
                                </Button>
                            </AnimateButton>
                        )}
                    </Stack>
                    <DataTable columns={columns} data={data} rowSelection={rowSelection} setRowSelection={setRowSelection} />
                </>
            )}
        </>
    );
}
