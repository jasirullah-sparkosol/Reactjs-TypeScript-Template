import { Middleware, Reducer } from '@reduxjs/toolkit';

// project imports
import { FileApi } from './fileApi';
import { GiftApi } from './giftApi';
import { personApi } from './personApi';
import { roleApi } from './roleApi';
import { userGiftApi } from './userGiftApi';

export const apiMiddlewares: Middleware[] = [
    FileApi.middleware,
    GiftApi.middleware,
    personApi.middleware,
    roleApi.middleware,
    userGiftApi.middleware
];

export const apiReducers: Record<string, Reducer> = {
    [FileApi.reducerPath]: FileApi.reducer,
    [GiftApi.reducerPath]: GiftApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [userGiftApi.reducerPath]: userGiftApi.reducer
};
