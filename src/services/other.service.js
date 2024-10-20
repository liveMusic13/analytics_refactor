import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { API_URL, TOKEN } from '../app.constants';

export const dataUsersService = createApi({
	reducerPath: 'dataUsersService',
	baseQuery: fetchBaseQuery({
		baseUrl: API_URL,
		prepareHeaders: headers => {
			const token = Cookies.get(TOKEN);

			if (token) headers.set('Authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		getDataUsers: builder.query({
			query: () => `/data-users`,
		}),
	}),
});

export const { useGetDataUsersQuery } = dataUsersService;
