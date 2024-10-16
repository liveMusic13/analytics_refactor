import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	// data: {},
	data: {
		second_graph_data: [],
		tonality: {},
	},
};

export const voiceData = createSlice({
	name: 'voiceData',
	initialState,
	reducers: {
		addVoiceData: (state, { payload }) => {
			state.data = payload;
		},
	},
});

export const { actions, reducer } = voiceData;
