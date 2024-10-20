import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { API_URL, TOKEN } from '../app.constants';
import { actions as folderTargetAction } from '../store/folder-target/folderTarget.slice';

export const dataSetService = createApi({
	reducerPath: 'dataSetService',
	baseQuery: fetchBaseQuery({
		baseUrl: API_URL,
		prepareHeaders: headers => {
			const token = Cookies.get(TOKEN);

			if (token) headers.set('Authorization', `Bearer ${token}`);

			return headers;
		},
	}),
	endpoints: builder => ({
		fileLoad: builder.query({
			query: data => {
				let params;
				if (data.file_name) {
					params = new URLSearchParams({
						folder_name: data.folder_name,
						file_name: data.file_name,
					}).toString();
				} else {
					params = new URLSearchParams({
						folder_name: data.folder_name,
						file_name: '',
					}).toString();
				}
				return `/file-load/?${params}`;
			},
			keepUnusedDataFor: 600,
		}),
		getProcessedFiles: builder.query({
			query: () => '/projector-files',
			keepUnusedDataFor: 600,
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled; // Дожидаемся выполнения запроса
					dispatch(folderTargetAction.addProcessedDataFolder(data));
				} catch (error) {
					console.log('Ошибка запроса:', error);
				}
			},
		}),
		getDataFolders: builder.query({
			query: () => '/data-folders',
			keepUnusedDataFor: 600,
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled; // Дожидаемся выполнения запроса
					dispatch(folderTargetAction.addAllDataFolder(data));
				} catch (error) {
					console.log('Ошибка запроса:', error);
				}
			},
		}),
		fileRename: builder.query({
			query: data => {
				const params = new URLSearchParams({
					folder_name: data.folder_name,
					current_file_name: data.current_file_name,
					new_file_name: data.new_file_name,
				}).toString();
				return `/file-rename?${params}`;
			},
			keepUnusedDataFor: 600,
		}),
		dataDelete: builder.query({
			query: data => {
				let params;

				if (data.file_name !== null) {
					params = new URLSearchParams({
						folder_name: data.folder_name,
						file_name: data.file_name,
					}).toString();
				} else {
					params = new URLSearchParams({
						folder_name: data.folder_name,
						base_files: data.base_files,
					}).toString();
				}

				return `/data-delete?${params}`;
			},
			keepUnusedDataFor: 600,
		}),
		dataAddFile: builder.query({
			query: (data, name, fileName) => {
				console.log('name', name);
				console.log('data', data);
				return {
					url: `/upload-file/?folder_name=${encodeURIComponent(data.name)}`,
					method: 'POST',
					body: data.data.uploaded_file,
					// headers: {
					// 	'Content-Type': 'multipart/form-data',
					// },
				};
			},
			keepUnusedDataFor: 600,
			async onQueryStarted(
				{ data, name, fileName },
				{ dispatch, queryFulfilled },
			) {
				try {
					const { data: data_request } = await queryFulfilled; // Дожидаемся выполнения запроса
					dispatch(
						folderTargetAction.addNewFile({
							name_folder: name,
							name_file: fileName,
						}),
					);
				} catch (error) {
					console.log('Ошибка запроса:', error);
				}
			},
		}),
		createFolder: builder.query({
			query: folder => `/create-folder?name=${folder}`,
			keepUnusedDataFor: 600,
		}),
	}),
});

export const {
	useLazyFileRenameQuery,
	useLazyCreateFolderQuery,
	useLazyDataAddFileQuery,
	useLazyDataDeleteQuery,
	useLazyGetDataFoldersQuery,
	useLazyGetProcessedFilesQuery,
	useLazyFileLoadQuery,
} = dataSetService;
