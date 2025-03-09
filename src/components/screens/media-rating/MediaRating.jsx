import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import BeforeSearch from '@/components/content/before-search/BeforeSearch';
import MediaGraphs from '@/components/content/graphs/media-graphs/MediaGraphs';
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

import styles from './MediaRating.module.scss';
import { useLazyMediaGraphQuery } from '@/services/getGraph.service';

const MediaRating = () => {
	useCheckAuth();

	const { pathname } = useLocation();
	const { addData, addMinDate, addMaxDate, addIndex } = useActions();
	const { active_menu } = useSelector(store => store.booleanValues);
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { json_files_directory: dataUser } = useSelector(
		store => store.dataUsersSlice,
	);
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
			isError: isError_media,
			error: error_media,
		},
	] = useLazyMediaGraphQuery();

	const getMediaData = useCallback(() => {
		trigger(dataForRequest);
	}, [dataForRequest]);

	// if (isError_media || isError) {
	// 	const error_props = isError ? error : error_media;

	// 	return <NotFound error={error_props} />;
	// }

	const [isNoData, setIsNoData] = useState(false);
	useEffect(() => {
		if (isError_media) {
			setIsNoData(true);
			const timer = setTimeout(() => setIsNoData(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [isError_media]);

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
						<BeforeSearch
							title='Медиа рейтинг'
							link='https://tsdoc.headsmade.com/en/media-rating'
						/>
					)}
				</div>

				<div
					className={styles.block__configureSearch}
					style={isSuccess_media ? {} : { alignSelf: 'center' }}
				>
					{isSuccess && Object.keys(dataUser ? dataUser : {}).length > 0 && (
						<DataForSearch />
					)}
					{isSuccess &&
						dataForRequest.index !== null &&
						Object.keys(dataUser ? dataUser : {}).length > 0 && (
							<CustomCalendar />
						)}
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
				{isNoData && <NoDataRequest />}
				{!isNoData && isSuccess_media && (
					<Suspense fallback={<Loader />}>
						<MediaGraphs />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default MediaRating;
