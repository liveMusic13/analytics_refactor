import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import BeforeSearch from '@/components/content/before-search/BeforeSearch';
import TonalityGraphs from '@/components/content/graphs/tonality-graphs/TonalityGraphs';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import Button from '@/components/ui/button/Button';
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
import CustomCalendar from '../../ui/custom-calendar/CustomCalendar';

import styles from './UserTonality.module.scss';
import { useLazyUserTonalityQuery } from '@/services/getGraph.service';

const UserTonality = () => {
	useCheckAuth();

	const { pathname } = useLocation();
	const { addData, addIndex, addMinDate, addMaxDate } = useActions();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { json_files_directory: dataUser } = useSelector(
		store => store.dataUsersSlice,
	);
	const {
		index: baseData,
		min_range_date,
		max_range_date,
	} = useSelector(state => state.dataForRequest);

	const [
		trigger,
		{
			data: data_tonality,
			isLoading: isLoading_tonality,
			isSuccess: isSuccess_tonality,
			isError: isError_tonality,
			error: error_tonality,
		},
	] = useLazyUserTonalityQuery();
	const cashingData = useMemo(() => data_tonality, [data_tonality]);

	// const { data, isLoading, isSuccess, isError, error } = useGetDataUsersQuery();
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
		baseData,
		addData,
		addMinDate,
		addMaxDate,
		addIndex,
	);

	const data_request = useMemo(
		() => ({
			index: baseData,
			// min_date,
			min_date: min_range_date,
			// max_date,
			max_date: max_range_date,
		}),
		[baseData, min_range_date, max_range_date],
	);

	const getTonalityData = useCallback(() => {
		trigger(data_request);
	}, [data_request]);

	// if (isError_tonality || isError) {
	// 	const error_props = isError ? error : error_tonality;

	// 	return <NotFound error={error_props} />;
	// }

	const [isNoData, setIsNoData] = useState(false);
	useEffect(() => {
		if (isError_tonality) {
			setIsNoData(true);
			const timer = setTimeout(() => setIsNoData(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [isError_tonality]);

	return (
		<Layout>
			{(isLoading || isLoading_tonality) && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}
			<Content>
				<div
					className={styles.block__pageName}
					style={isSuccess_tonality ? {} : { alignSelf: 'center' }}
				>
					{isSuccess_tonality ? (
						<>
							<h3 className={styles.pageName__title}>Тональный ландшафт</h3>
							<p>
								{cashingData
									? cashingData?.tonality_values?.negative_count +
										cashingData?.tonality_values?.positive_count
									: '0'}{' '}
								упоминаний
							</p>
						</>
					) : (
						<BeforeSearch title='Тональный ландшафт' />
					)}
				</div>
				<div
					className={styles.block__configureSearch}
					style={isSuccess_tonality ? {} : { alignSelf: 'center' }}
				>
					{isSuccess && Object.keys(dataUser ? dataUser : {}).length > 0 && (
						<DataForSearch />
					)}
					<CustomCalendar />
					<Button
						style={{
							width: 'calc(220/1440*100vw)',
							height: 'calc(56/1440*100vw)',
						}}
						onClick={getTonalityData}
					>
						Запуск
					</Button>
				</div>
				{isNoData && <NoDataRequest />}
				{/* <NoDataRequest /> */}
				{!isNoData && isSuccess_tonality && (
					<Suspense fallback={<Loader />}>
						<TonalityGraphs />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default UserTonality;
