import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	get: [],
	post: {
		promt: '',
		texts: [],
	},
	categories: {},
	idProgressBar: null,
	stateLoad: null,
	viewTable: null,
};

export const aiData = createSlice({
	name: 'aiData',
	initialState,
	reducers: {
		addViewTable_aiData: (state, { payload }) => {
			state.viewTable = payload;
		},
		addStateLoad_aiData: (state, { payload }) => {
			state.stateLoad = payload;
		},
		addIdProgressBar_aiData: (state, { payload }) => {
			state.idProgressBar = payload;
		},
		addAiDataGET_aiData: (state, { payload }) => {
			state.get = payload;
		},
		addAiDataPOST_aiData: (state, { payload }) => {
			state.post = payload;
		},
		addObject_aiData: (state, { payload }) => {
			state.categories[payload.text].push(payload.data);
		},
		addCategories_aiData: (state, { payload }) => {
			state.categories[payload] = [];
		},
		updateCategoryArray_aiData: (state, { payload }) => {
			const { oldName, newName, newArray } = payload;

			if (state.categories[oldName]) {
				// Создаем новую запись с новым именем и данными
				state.categories[newName] = newArray;
				// Удаляем старую запись
				delete state.categories[oldName];
			} else {
				console.warn(`Category with key "${oldName}" not found.`);
			}
		},
		deleteCategoryArray_aiData: (state, { payload }) => {
			const updatedCategories = { ...state.categories };
			for (const key in updatedCategories) {
				if (updatedCategories.hasOwnProperty(key) && key === payload) {
					delete updatedCategories[key];
					break; // Прерываем цикл после первого совпадения
				}
			}
			state.categories = updatedCategories;
		},
	},
});

export const { actions, reducer } = aiData;
