import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';
import API_ROUTES from '../routes';
import { Person } from 'types/api/person';
import { FilterRequestBodyType, FilterResponseType } from 'types/root';

export const personApi = createApi({
    reducerPath: 'personApi',
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        // post person
        postPerson: builder.mutation<Person, Partial<Person>>({
            query: (body) => ({
                url: API_ROUTES.person.customerPost,
                method: 'POST',
                body
            })
        }),

        // get all persons
        getPersons: builder.query<
            FilterResponseType<Person>,
            {
                page: number;
                pageSize: number;
            }
        >({
            query: ({ page, pageSize }) =>
                API_ROUTES.person.list
                    .replace(':withPopulate', 'true')
                    .replace(':page', String(page))
                    .replace(':pageSize', String(pageSize))
                    .replace(':usedFor', 'customers')
        }),

        // get all filtered persons
        getFilteredPersons: builder.mutation<FilterResponseType<Person>, Partial<{ body: FilterRequestBodyType; signal: any }>>({
            query: ({ body, signal }) => ({
                url: API_ROUTES.person.listFilter,
                method: 'POST',
                body,
                signal
            })
        }),

        // get person by id
        getPerson: builder.query<Person, string>({
            query: (id) => API_ROUTES.person.get.replace(':id', id)
        }),

        // update person
        updatePerson: builder.mutation<Person, Partial<Person>>({
            query: ({ _id, ...patch }) => ({
                url: API_ROUTES.person.update.replace(':id', _id as string),
                method: 'PATCH',
                body: patch
            })
        }),

        // delete person
        deletePerson: builder.mutation<Person, string>({
            query: (id) => ({
                url: API_ROUTES.person.delete.replace(':id', id),
                method: 'DELETE'
            })
        })
    })
});

export const { usePostPersonMutation, useLazyGetPersonQuery, useUpdatePersonMutation, useGetFilteredPersonsMutation } = personApi;
