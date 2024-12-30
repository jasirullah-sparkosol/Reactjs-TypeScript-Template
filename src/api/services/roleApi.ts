import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';
import API_ROUTES from '../routes';
import { Role } from 'types/api/role';

export const roleApi = createApi({
    reducerPath: 'roleApi',
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        // post role
        postRole: builder.mutation<Role, Partial<Role>>({
            query: (body) => ({
                url: API_ROUTES.role.post,
                method: 'POST',
                body
            })
        }),

        // get all roles
        getRoles: builder.query<Role[], void>({
            query: () => API_ROUTES.role.list
        }),

        // get role by Id
        getRole: builder.query<Role, string>({
            query: (_id) => API_ROUTES.role.get.replace(':id', _id)
        }),

        // update role by Id
        updateRole: builder.mutation<Role, Partial<Role>>({
            query: ({ _id, ...patch }) => ({
                url: API_ROUTES.role.update.replace(':id', _id as string),
                method: 'PATCH',
                body: patch
            })
        }),

        // delete role by Id
        deleteRole: builder.mutation<Role, string>({
            query: (_id) => ({
                url: API_ROUTES.role.delete.replace(':id', _id),
                method: 'DELETE'
            })
        })
    })
});

export const { usePostRoleMutation, useGetRolesQuery, useLazyGetRoleQuery, useGetRoleQuery, useUpdateRoleMutation, useDeleteRoleMutation } =
    roleApi;
