import { bindActionCreators } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { actions as booleanValuesAction } from '../store/boolean-values/booleanValues.slice';
import { actions as dataForRequestAction } from '../store/data-for-request/dataForRequest.slice';
import { actions as dataUsersAction } from '../store/data-users/dataUsers.slice';

const rootActions = {
	...dataForRequestAction,
	...booleanValuesAction,
	...dataUsersAction,
};

export const useActions = () => {
	const dispatch = useDispatch();

	return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch]);
};
