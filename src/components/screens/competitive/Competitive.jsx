import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import BeforeSearch from '@/components/content/before-search/BeforeSearch';
import CompetitiveGraphs from '@/components/content/graphs/competitive-graphs/CompetitiveGraphs';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import Button from '@/components/ui/button/Button';
import CustomCalendar from '@/components/ui/custom-calendar/CustomCalendar';
import DataForSearch from '@/components/ui/data-for-search/DataForSearch';
import LeftMenu from '@/components/ui/left-menu/LeftMenu';
import LeftMenuActive from '@/components/ui/left-menu/left-menu-active/LeftMenuActive';

import { useActions } from '@/hooks/useActions';
import { useAddBaseAndDate } from '@/hooks/useAddBaseAndDate';

import { useCheckAuth } from '../../../hooks/useCheckAuth';
import {
	useGetUserFoldersQuery,
	useGetUserIdQuery,
} from '../../../services/other.service';
import NoDataRequest from '../../no-data-request/NoDataRequest';

import styles from './Competitive.module.scss';
import { useLazyCompetitiveGraphQuery } from '@/services/getGraph.service';

const Competitive = () => {
	useCheckAuth();

	const { pathname } = useLocation();
	const { addData, addIndex, addMinDate, addMaxDate, addThemesInd } =
		useActions();
	const { active_menu } = useSelector(store => store.booleanValues);
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { json_files_directory: dataUser } = useSelector(
		store => store.dataUsersSlice,
	);

	const {
		data: data_getUserId,
		isError: isError_getUserId,
		error: error_getUserId,
		isLoading: isLoading_getUserId,
	} = useGetUserIdQuery();
	const { data, isError, error, isLoading, isSuccess } =
		useGetUserFoldersQuery(data_getUserId);

	useAddBaseAndDate(
		dataUser,
		data,
		isSuccess,
		dataForRequest.index,
		addData,
		addMinDate,
		addMaxDate,
		addIndex,
	);

	useEffect(() => {
		//TODO: ДОЖДАТЬСЯ ОТВЕТА ОТ ГРАФИКА И ПРОТЕСТИТЬ
		const arrayData =
			dataUser && Object.keys(dataUser).length > 0 ? dataUser : {};

		if (arrayData && Object.keys(arrayData).length > 0) {
			const flatValues = Object.values(arrayData).flat();

			if (flatValues.length > 0) {
				addThemesInd(flatValues[0].index_number);
				addThemesInd(flatValues[1].index_number);
			}
		}
	}, [dataUser]);

	const [
		trigger_competitive,
		{
			data: data_competitive,
			isLoading: isLoading_competitive,
			isSuccess: isSuccess_competitive,
			isError: isError_competitive,
			error: error_competitive,
		},
	] = useLazyCompetitiveGraphQuery();

	const getCompetitiveData = useCallback(() => {
		trigger_competitive(dataForRequest);
	}, [dataForRequest]);

	// if (isError_competitive || isError) {
	// 	const error_props = isError ? error : error_competitive;
	// 	return <NotFound error={error_props} />;
	// }

	const [isNoData, setIsNoData] = useState(false);
	useEffect(() => {
		if (isError_competitive) {
			setIsNoData(true);
			const timer = setTimeout(() => setIsNoData(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [isError_competitive]);

	return (
		<Layout>
			{(isLoading || isLoading_competitive) && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}
			<Content>
				<div
					className={styles.block__pageName}
					style={isSuccess_competitive ? {} : { alignSelf: 'center' }}
				>
					{isSuccess_competitive ? (
						<h3 className={styles.pageName__title}>Конкуренты</h3>
					) : (
						<BeforeSearch title='Конкуренты' />
					)}
				</div>
				<div
					className={styles.block__configureSearch}
					style={isSuccess_competitive ? {} : { alignSelf: 'center' }}
				>
					<DataForSearch multi={true} />
					<CustomCalendar multi={true} />
					<Button
						style={{
							width: 'calc(220/1440*100vw)',
							height: 'calc(56/1440*100vw)',
						}}
						onClick={getCompetitiveData}
					>
						Запуск
					</Button>
				</div>
				{isNoData && <NoDataRequest />}
				{!isNoData && isSuccess_competitive && (
					<Suspense fallback={<Loader />}>
						<CompetitiveGraphs />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default Competitive;
