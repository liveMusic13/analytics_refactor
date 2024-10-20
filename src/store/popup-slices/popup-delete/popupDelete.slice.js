import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isPopupDelete: false,
	title: '',
	folder: '',
	isProcessed: false,
	buttonTarget: '',
};

export const popupDelete = createSlice({
	name: 'popupDelete',
	initialState,
	reducers: {
		toggle_PopupDelete: (state, { payload }) => {
			state.isPopupDelete = !state.isPopupDelete;
		},
		addButtonTarget_PopupDelete: (state, { payload }) => {
			return {
				...state,
				buttonTarget: payload,
			};
		},
		addTitle_PopupDelete: (state, { payload }) => {
			return {
				...state,
				title: payload.title,
				folder: payload.folder,
				isProcessed: payload.processed,
			};
		},
	},
});

export const { actions, reducer } = popupDelete;
