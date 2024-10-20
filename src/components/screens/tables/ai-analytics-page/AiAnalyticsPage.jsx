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

import { useActions } from '../../../../hooks/useActions';
import { useAddBaseAndDate } from '../../../../hooks/useAddBaseAndDate';
import { useGetDataUsersQuery } from '../../../../services/other.service';
import {
	useLazyAiAnalyticsGETQuery,
	useLazyAiAnalyticsPOSTQuery,
} from '../../../../services/tables.service';
import AiAnalytics from '../../../content/tables/ai-analytics/AiAnalytics';
import Input from '../../../ui/fields/input/Input';

import styles from './AiAnalyticsPage.module.scss';

const AiAnalyticsPage = () => {
	const { pathname } = useLocation();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { values: dataUser } = useSelector(store => store.dataUsersSlice);
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { get } = useSelector(state => state.aiData);
	const { addData, addIndex, addMinDate, addMaxDate, addPromt } = useActions();

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

	const [
		trigger_aiAnalyticsGET,
		{
			data: data_aiAnalyticsGET,
			isLoading: isLoading_aiAnalyticsGET,
			isSuccess: isSuccess_aiAnalyticsGET,
		},
	] = useLazyAiAnalyticsGETQuery();
	const [
		trigger_aiAnalyticsPOST,
		{
			data: data_aiAnalyticsPOST,
			isLoading: isLoading_aiAnalyticsPOST,
			isSuccess: isSuccess_aiAnalyticsPOST,
		},
	] = useLazyAiAnalyticsPOSTQuery();

	const graf = localStorage.getItem('isGraf');

	const onChange_input = e => {
		addPromt(e.target.value);
	};

	const getAiAnalyticsGET = () => {
		trigger_aiAnalyticsGET(dataForRequest);
	};
	const getAiAnalyticsPOST = () => {
		trigger_aiAnalyticsPOST(dataForRequest);
	};

	return (
		<Layout>
			{(isLoading || isLoading_aiAnalyticsGET || isLoading_aiAnalyticsPOST) && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}

			<Content>
				<div
					className={styles.block__pageName}
					style={isSuccess_aiAnalyticsGET ? {} : { alignSelf: 'center' }}
				>
					{isSuccess_aiAnalyticsGET ? (
						<h3 className={styles.pageName__title}>ИИ Анализ</h3>
					) : (
						<BeforeSearch title='ИИ Анализ' />
					)}
				</div>
				<div
					className={styles.block__configureSearch}
					style={isSuccess_aiAnalyticsGET ? {} : { alignSelf: 'center' }}
				>
					<DataForSearch />
					<CustomCalendar />
					<Button
						style={{
							width: 'calc(220/1440*100vw)',
							height: 'calc(56/1440*100vw)',
						}}
						onClick={getAiAnalyticsGET}
					>
						Запуск
					</Button>
					{get.length !== 0 && (
						<>
							<Input
								placeholder='Задайте запрос к текстам'
								styleInput={{
									width: 'calc(281/1440*100vw)',
									height: 'calc(55.9/1440*100vw)',
									borderRadius: 'calc(8/1440*100vw)',
								}}
								styleLabel={{ display: 'none' }}
								onChange={onChange_input}
								value={dataForRequest.promt ? dataForRequest.promt : ''}
							/>
							<Button
								style={{
									width: 'calc(220/1440*100vw)',
									height: 'calc(56/1440*100vw)',
								}}
								onClick={getAiAnalyticsPOST}
							>
								ИИ анализ
							</Button>
						</>
					)}
				</div>
				{/* {graf === 'true' && <TableAnalytics />} */}
				{isSuccess_aiAnalyticsGET && <AiAnalytics />}
			</Content>
		</Layout>
	);
};

export default AiAnalyticsPage;
