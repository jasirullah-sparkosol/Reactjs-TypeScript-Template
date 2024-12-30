import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { SIGN_IN_PATH } from 'config';
import { getJWTContext } from 'contexts/JWTContext';

const BASE_URL = import.meta.env.VITE_APP_API_URL as string;
console.log('RTK BaseURL:', BASE_URL);

// BaseQuery without auth headers
const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL
});

// BaseQuery with auth headers
const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken) {
            headers.set('Authorization', `Bearer ${serviceToken}`);
        }
        return headers;
    }
});

// BaseQuery with auth headers and re-auth if 401
const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const context = getJWTContext();

    let result = await baseQueryWithAuth(args, api, extraOptions);
    if (result.error && result.error.status === 401 && !window.location.href.includes('/sign-in')) {
        if (context?.logout) {
            context.logout();
        }
        window.location.pathname = SIGN_IN_PATH;
    }
    return result;
};

export { BASE_URL, baseQuery, baseQueryWithAuth, baseQueryWithReAuth };
