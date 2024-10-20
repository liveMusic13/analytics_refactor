import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { API_URL, TOKEN } from '../app.constants';
import { actions as aiDataAction } from '../store/ai-data/aiData.slice';
import { actions as dataForRequestAction } from '../store/data-for-request/dataForRequest.slice';
import { actions as topicAnalysisDataAction } from '../store/topic-analysis-data/topicAnalysisData.slice';

export const tablesService = createApi({
	reducerPath: 'tablesService',
	baseQuery: fetchBaseQuery({
		baseUrl: API_URL,
		prepareHeaders: headers => {
			const token = Cookies.get(TOKEN);

			if (token) headers.set('Authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		topicAnalysis: builder.query({
			query: data =>
				`/themes?index=${data.index}&min_date=${data.min_date}&max_date=${data.max_date}`,
			keepUnusedDataFor: 600,
			// Этот метод позволит диспатчить данные в другой срез стора
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled; // Дожидаемся выполнения запроса
					dispatch(
						topicAnalysisDataAction.addThemesData_topicAnalysisData(
							data.values,
						),
					); // Диспатчим результат в другой срез
				} catch (error) {
					console.log('Ошибка запроса:', error);
				}
			},
		}),
		aiAnalyticsGET: builder.query({
			query: data =>
				`/ai-analytics?index=${data.index}&min_date=${data.min_date}&max_date=${data.max_date}`,
			keepUnusedDataFor: 600,
			// Этот метод позволит диспатчить данные в другой срез стора
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled; // Дожидаемся выполнения запроса
					dispatch(
						aiDataAction.addAiDataPOST_aiData({
							promt: '',
							texts: [],
						}),
					);
					dispatch(aiDataAction.addViewTable_aiData('get'));
					dispatch(aiDataAction.addAiDataGET_aiData(data.data));
					localStorage.setItem('isGraf', 'true');
				} catch (error) {
					console.log('Ошибка запроса:', error);
				}
			},
		}),
		aiAnalyticsPOST: builder.query({
			query: data => ({
				url: '/ai-analytics',
				method: 'POST',
				body: {
					index: data.index,
					min_date: data.min_date,
					max_date: data.max_date,
					promt: data.promt,
					texts_ids: data.texts_ids,
				},
				headers: {
					'Content-Type': 'application/json', // Указываем, что данные в формате JSON
				},
			}),
			keepUnusedDataFor: 600,
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled; // Дожидаемся выполнения запроса

					dispatch(dataForRequestAction.toggleInfo(''));
					const timeoutId = setTimeout(
						() => dispatch(dataForRequestAction.toggleInfo('')),
						3500,
					);

					dispatch(aiDataAction.addViewTable_aiData('post'));
					return () => clearTimeout(timeoutId);
				} catch (error) {
					console.log('Ошибка запроса:', error);
				}
			},
		}),
		getIdProgressBar: builder.query({
			query: () => '/tasks/?llm_task=true',
			keepUnusedDataFor: 600,
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled; // Дожидаемся выполнения запроса
					dispatch(aiDataAction.addIdProgressBar_aiData(data)); // Диспатчим результат в другой срез
				} catch (error) {
					console.log('Ошибка запроса:', error);
				}
			},
		}),
		getStateProgressBar: builder.query({
			query: task_id => `/progress/${task_id}/`,
			keepUnusedDataFor: 600,
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled; // Дожидаемся выполнения запроса
					dispatch(aiDataAction.addStateLoad_aiData(data)); // Диспатчим результат в другой срез
				} catch (error) {
					console.log('Ошибка запроса:', error);
				}
			},
		}),
	}),
});

export const {
	useLazyTopicAnalysisQuery,
	useLazyAiAnalyticsGETQuery,
	useLazyGetIdProgressBarQuery,
	useLazyAiAnalyticsPOSTQuery,
} = tablesService;
