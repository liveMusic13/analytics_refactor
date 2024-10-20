import { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import BeforeSearch from '@/components/content/before-search/BeforeSearch';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import Button from '@/components/ui/button/Button';
import CustomCalendar from '@/components/ui/custom-calendar/CustomCalendar';
import DataForSearch from '@/components/ui/data-for-search/DataForSearch';
import LeftMenu from '@/components/ui/left-menu/LeftMenu';
import LeftMenuActive from '@/components/ui/left-menu/left-menu-active/LeftMenuActive';

import { useActions } from '../../../hooks/useActions';
import { useAddBaseAndDate } from '../../../hooks/useAddBaseAndDate';
import { useLazyCompetitiveGraphQuery } from '../../../services/getGraph.service';
import { useGetDataUsersQuery } from '../../../services/other.service';
import CompetitiveGraphs from '../../content/graphs/competitive-graphs/CompetitiveGraphs';

import styles from './Competitive.module.scss';

const Competitive = () => {
	const { pathname } = useLocation();
	const { addData, addIndex, addMinDate, addMaxDate, addThemesInd } =
		useActions();
	const { active_menu } = useSelector(store => store.booleanValues);
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { values: dataUser } = useSelector(store => store.dataUsersSlice);

	const { data, isLoading, isSuccess } = useGetDataUsersQuery();

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
		if (dataUser.length > 0) {
			addThemesInd(dataUser[0].index_number);
			addThemesInd(dataUser[1].index_number);
		}
	}, [dataUser]);

	const [
		trigger_competitive,
		{
			data: data_competitive,
			isLoading: isLoading_competitive,
			isSuccess: isSuccess_competitive,
		},
	] = useLazyCompetitiveGraphQuery();

	const getCompetitiveData = () => {
		trigger_competitive(dataForRequest);
	};

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
				{isSuccess_competitive && (
					<Suspense fallback={<Loader />}>
						<CompetitiveGraphs />
					</Suspense>
				)}
				{/* {isGraph.isGraph ? (
					<СompetitiveEnvironment />
				) : (
					<BeforeSearch title='Конкуренты' />
				)} */}
			</Content>
		</Layout>
	);
};

export default Competitive;
