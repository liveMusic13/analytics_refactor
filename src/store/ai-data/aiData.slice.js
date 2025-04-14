import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	aiTesting: [],
	post: {
		system_prompt: 'Ты дружелюбный ассистент для разметки текстов',
		text_prompt:
			'Какая тематика у этого текста? Ответь на русском языке в 1 предложение',
		texts: [],
	},
	// categories: {},
	idProgressBar: null,
	stateLoad: null,
	viewTable: null,
	isViewPromptPopup: false,
	progress_load: 0,
	statusBarStart: false,
	finalStatus: false,
	index_doc: null,
	isOpenSaveData: false,
	arrProgressLoads: [],
};

export const aiData = createSlice({
	name: 'aiData',
	initialState,
	reducers: {
		arrAddProgressLoad: (state, { payload }) => {
			state.arrProgressLoads.push(payload);
		},
		addIndexDoc_Ai: (state, { payload }) => {
			state.index_doc = payload;
		},
		toggleFinalStatus: (state, { payload }) => {
			state.finalStatus = payload;
		},
		toggleBarStart: (state, { payload }) => {
			state.statusBarStart = payload;
		},
		setIsOpenSaveData: (state, { payload }) => {
			state.isOpenSaveData = payload;
		},
		setProgressLoad: (state, { payload }) => {
			// state.progress_load = payload;
			// Находим индекс объекта, который нужно обновить
			const indexToUpdate = state.arrProgressLoads.findIndex(
				el =>
					Number(el.index) === Number(payload.index) &&
					el.folder_name === payload.folder_name &&
					Number(el.user_id) === Number(payload.user_id) &&
					el.promt_question === payload.promt_question &&
					el.system_prompt === payload.system_prompt,
			);

			if (indexToUpdate !== -1) {
				// Создаем новый объект с обновленным полем
				const updatedObject = {
					...state.arrProgressLoads[indexToUpdate],
					progress_load: payload.progress_load, // Обновляем progress_load числовым значением
				};

				console.log('in redux', payload, [
					...state.arrProgressLoads.slice(0, indexToUpdate), // Элементы до обновляемого
					updatedObject, // Новый объект
					...state.arrProgressLoads.slice(indexToUpdate + 1), // Элементы после обновляемого
				]);
				// Обновляем массив, заменяя старый объект на новый
				state.arrProgressLoads = [
					...state.arrProgressLoads.slice(0, indexToUpdate), // Элементы до обновляемого
					updatedObject, // Новый объект
					...state.arrProgressLoads.slice(indexToUpdate + 1), // Элементы после обновляемого
				];
			}
		},
		setSystemPrompt: (state, { payload }) => {
			state.post.system_prompt = payload;
		},
		setTextPrompt: (state, { payload }) => {
			state.post.text_prompt = payload;
		},
		toggleIsViewPromptPopup: (state, { payload }) => {
			state.isViewPromptPopup = payload;
		},
		addViewTable_aiData: (state, { payload }) => {
			state.viewTable = payload;
		},
		addStateLoad_aiData: (state, { payload }) => {
			console.log('in redux');
			state.stateLoad = payload.toString();
		},
		addIdProgressBar_aiData: (state, { payload }) => {
			state.idProgressBar = payload;
		},
		addAiTesting_aiData: (state, { payload }) => {
			state.aiTesting = payload;
		},
		addAiDataPOST_aiData: (state, { payload }) => {
			state.post = payload;
		},
	},
});

export const { actions, reducer } = aiData;
