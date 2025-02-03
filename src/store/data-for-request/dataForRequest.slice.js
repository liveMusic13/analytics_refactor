import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	index: null,
	themes_ind: [],
	min_date: null,
	max_date: null,
	query_str: '',
	post: false,
	repost: false,
	SMI: false,
	promt: null,
	texts_ids: [],
	infoAboutPost: false,
};

export const dataForRequest = createSlice({
	name: 'dataForRequest',
	initialState,
	reducers: {
		addThemesInd: (state, { payload }) => {
			// Если в массиве уже два элемента, удаляем их и добавляем только новый
			if (state.themes_ind.length === 2) {
				state.themes_ind = [payload]; // Заменяем оба старых элемента на новый
			} else {
				// Если элемент уже есть, убираем его
				if (state.themes_ind.includes(payload)) {
					state.themes_ind = state.themes_ind.filter(id => id !== payload);
				} else {
					// Если еще нет двух элементов, просто добавляем новый
					state.themes_ind.push(payload);
				}
			}
		},
		clearThemesInd: (state, { payload }) => {
			state.themes_ind = [];
		},
		toggleInfo: (state, { payload }) => {
			state.infoAboutPost = !state.infoAboutPost;
		},
		addIndex: (state, { payload }) => {
			return { ...state, index: payload };
		},
		addMinDate: (state, { payload }) => {
			return { ...state, min_date: payload };
		},
		addMaxDate: (state, { payload }) => {
			return { ...state, max_date: payload };
		},
		addQueryStr: (state, { payload }) => {
			return { ...state, query_str: payload };
		},
		currentCheckBox: (state, { payload }) => {
			return { ...state, [payload]: !state[payload] };
		},
		addPromt: (state, { payload }) => {
			return { ...state, promt: payload };
		},
		addTextsIds: (state, { payload }) => {
			state.texts_ids.push(payload);
		},
		addAllTextsIds: (state, { payload }) => {
			state.texts_ids = payload.map(item => item.id);
		},
		deleteAllTextsIds: (state, { payload }) => {
			state.texts_ids = [];
		},
		deleteTextsIds: (state, { payload }) => {
			state.texts_ids = state.texts_ids.filter(id => id !== payload);
		},
	},
});

export const { actions, reducer } = dataForRequest;
