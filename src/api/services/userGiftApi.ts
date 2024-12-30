import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';
import API_ROUTES from '../routes';
import { UserGift } from 'types/api/userGift';
import { FilterRequestBodyType, FilterResponseType } from 'types/root';

export const userGiftApi = createApi({
    reducerPath: 'userGiftApi',
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        // get all userGifts
        getUserGifts: builder.query<UserGift[], void>({
            query: () => API_ROUTES.userGift.list.replace(':withPopulate', 'true')
        }),

        // get userGift by Id
        getUserGift: builder.query<UserGift, string>({
            query: (id) => API_ROUTES.userGift.get.replace(':id', id).replace(':withPopulate', 'true')
        }),

        // get all filtered user gifts
        getFilteredUserGifts: builder.mutation<
            FilterResponseType<UserGift>,
            Partial<{
                body?: FilterRequestBodyType;
                signal: any;
            }>
        >({
            query: ({ body, signal }) => ({
                url: API_ROUTES.userGift.listFilter,
                method: 'POST',
                body,
                signal
            })
        }),
        // post qr code
        postQrCode: builder.mutation<UserGift, { qrCode: string; performedBy?: string }>({
            query: (body) => ({
                url: API_ROUTES.userGift.verifyCode,
                method: 'POST',
                body
            }),
            extraOptions: { maxAge: 0 }
        }),
        // post redeem
        postRedeem: builder.mutation<UserGift, { userGiftId: string; performedBy?: string }>({
            query: (body) => ({
                url: API_ROUTES.userGift.redeem,
                method: 'POST',
                body
            }),
            extraOptions: { maxAge: 0 }
        }),

        // create user gift history
        postUserGift: builder.mutation<UserGift, Partial<UserGift>>({
            query: (body) => ({
                url: API_ROUTES.userGift.post,
                method: 'POST',
                body
            })
        })
    })
});

export const {
    useGetUserGiftsQuery,
    useGetFilteredUserGiftsMutation,
    useGetUserGiftQuery,
    usePostQrCodeMutation,
    usePostRedeemMutation,
    usePostUserGiftMutation
} = userGiftApi;
