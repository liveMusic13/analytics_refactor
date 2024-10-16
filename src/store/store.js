import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { getGraph } from '../services/getGraph.service';
import { dataUsers } from '../services/other.service';

import { reducer as booleanValues } from './boolean-values/booleanValues.slice';
import { reducer as competitiveData } from './competitive-data/competitiveData.slice';
import { reducer as dataForRequest } from './data-for-request/dataForRequest.slice';
import { reducer as dataUsersSlice } from './data-users/dataUsers.slice';
import { reducer as informationGraphData } from './information-graph-data/informationGraphData.slice';
import { reducer as mediaData } from './media-data/mediaData.slice';
import { reducer as tonalityData } from './tonality-data/tonalityData.slice';
import { reducer as voiceData } from './voice-data/voiceData.slice';

const reducers = combineReducers({
	dataUsersSlice,
	competitiveData,
	voiceData,
	dataForRequest,
	booleanValues,
	tonalityData,
	informationGraphData,
	mediaData,
	[getGraph.reducerPath]: getGraph.reducer,
	[dataUsers.reducerPath]: dataUsers.reducer,
});

export const store = configureStore({
	// reducer: {
	// 	reducers,
	// },
	reducer: reducers,

	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(getGraph.middleware)
			.concat(dataUsers.middleware),
});
