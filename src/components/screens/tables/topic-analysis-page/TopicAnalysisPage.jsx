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
import { useLazyTopicAnalysisQuery } from '../../../../services/tables.service';
import TopicAnalysis from '../../../content/tables/topic-analysis/TopicAnalysis';

import styles from './TopicAnalysisPage.module.scss';

const TopicAnalysisPage = () => {
	const { pathname } = useLocation();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { values: dataUser } = useSelector(store => store.dataUsersSlice);
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { addData, addIndex, addMinDate, addMaxDate } = useActions();

	const { data, isLoading, isSuccess } = useGetDataUsersQuery();
	const [
		trigger_topicAnalysis,
		{
			data: data_topicAnalysis,
			isLoading: isLoading_topicAnalysis,
			isSuccess: isSuccess_topicAnalysis,
		},
	] = useLazyTopicAnalysisQuery();

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

	const getTopicAnalysis = () => {
		trigger_topicAnalysis(dataForRequest);
	};

	return (
		<Layout>
			{(isLoading_topicAnalysis || isLoading) && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}

			<Content>
				<div
					className={styles.block__pageName}
					style={isSuccess_topicAnalysis ? {} : { alignSelf: 'center' }}
				>
					{isSuccess_topicAnalysis ? (
						<h3 className={styles.pageName__title}>Анализ тематик</h3>
					) : (
						<BeforeSearch title='Анализ тематик' />
					)}
				</div>
				<div
					className={styles.block__configureSearch}
					style={isSuccess_topicAnalysis ? {} : { alignSelf: 'center' }}
				>
					<DataForSearch />
					<CustomCalendar />
					<Button
						style={{
							width: 'calc(220/1440*100vw)',
							height: 'calc(56/1440*100vw)',
						}}
						onClick={getTopicAnalysis}
					>
						Запуск
					</Button>
				</div>
				{isSuccess_topicAnalysis && <TopicAnalysis />}
			</Content>
		</Layout>
	);
};

export default TopicAnalysisPage;
