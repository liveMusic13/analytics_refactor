import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	values: [],
};

export const dataUsersSlice = createSlice({
	name: 'dataUsersSlice',
	initialState,
	reducers: {
		addData: (state, { payload }) => {
			state.values = payload;
		},
	},
});

export const { actions, reducer } = dataUsersSlice;
