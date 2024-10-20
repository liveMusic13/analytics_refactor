import { Suspense, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import BeforeSearch from '@/components/content/before-search/BeforeSearch';
import TonalityGraphs from '@/components/content/graphs/tonality-graphs/TonalityGraphs';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import NotFound from '@/components/screens/not-found/NotFound';
import Button from '@/components/ui/button/Button';
import CustomCalendar from '@/components/ui/custom-calendar/CustomCalendar';
import DataForSearch from '@/components/ui/data-for-search/DataForSearch';
import LeftMenu from '@/components/ui/left-menu/LeftMenu';
import LeftMenuActive from '@/components/ui/left-menu/left-menu-active/LeftMenuActive';

import { useActions } from '@/hooks/useActions';
import { useAddBaseAndDate } from '@/hooks/useAddBaseAndDate';

import styles from './UserTonality.module.scss';
import { useLazyUserTonalityQuery } from '@/services/getGraph.service';
import { useGetDataUsersQuery } from '@/services/other.service';

const UserTonality = () => {
	const { pathname } = useLocation();
	const { addData, addIndex, addMinDate, addMaxDate } = useActions();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { values: dataUser } = useSelector(store => store.dataUsersSlice);
	const {
		index: baseData,
		min_date,
		max_date,
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

	const { data, isLoading, isSuccess, isError, error } = useGetDataUsersQuery();

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
			min_date,
			max_date,
		}),
		[baseData, min_date, max_date],
	);

	const getTonalityData = useCallback(() => {
		trigger(data_request);
	}, [data_request]);

	if (isError_tonality || isError) {
		const error_props = isError ? error : error_tonality;

		return <NotFound error={error_props} />;
	}

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
					{isSuccess && dataUser.length > 0 && <DataForSearch />}
					{isSuccess && baseData !== null && dataUser.length > 0 && (
						<CustomCalendar />
					)}
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
				{isSuccess_tonality && (
					<Suspense fallback={<Loader />}>
						<TonalityGraphs />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default UserTonality;
