import { Suspense } from 'react';
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
import { useLazyMediaGraphQuery } from '../../../services/getGraph.service';
import { useGetDataUsersQuery } from '../../../services/other.service';
import MediaGraphs from '../../content/graphs/media-graphs/MediaGraphs';

import styles from './MediaRating.module.scss';

const MediaRating = () => {
	const { pathname } = useLocation();
	const { addData, addMinDate, addMaxDate, addIndex } = useActions();
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

	const [
		trigger,
		{
			data: data_media,
			isLoading: isLoading_media,
			isSuccess: isSuccess_media,
		},
	] = useLazyMediaGraphQuery();

	const getMediaData = () => {
		trigger(dataForRequest);
	};

	return (
		<Layout>
			{(isLoading || isLoading_media) && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}
			<Content>
				<div
					className={styles.block__pageName}
					style={isSuccess_media ? {} : { alignSelf: 'center' }}
				>
					{isSuccess_media ? (
						<>
							<h3 className={styles.pageName__title}>Медиа рейтинг</h3>
							<p></p>
						</>
					) : (
						<BeforeSearch title='Медиа рейтинг' />
					)}
				</div>

				<div
					className={styles.block__configureSearch}
					style={isSuccess_media ? {} : { alignSelf: 'center' }}
				>
					<DataForSearch />
					<CustomCalendar />
					<Button
						style={{
							width: 'calc(220/1440*100vw)',
							height: 'calc(56/1440*100vw)',
						}}
						onClick={getMediaData}
					>
						Запуск
					</Button>
				</div>
				{isSuccess_media && (
					<Suspense fallback={<Loader />}>
						<MediaGraphs />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default MediaRating;
