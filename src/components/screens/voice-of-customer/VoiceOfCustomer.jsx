import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import BeforeSearch from '@/components/content/before-search/BeforeSearch';
import VoiceGraph from '@/components/content/graphs/voice-graphs/VoiceGraph';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import Button from '@/components/ui/button/Button';
import CustomCalendar from '@/components/ui/custom-calendar/CustomCalendar';
import DataForSearch from '@/components/ui/data-for-search/DataForSearch';
import Input from '@/components/ui/fields/input/Input';
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
import QueryStringHelp from '../../ui/query-string-help/QueryStringHelp';

import styles from './VoiceOfCustomer.module.scss';
import { useLazyVoiceGraphQuery } from '@/services/getGraph.service';

const VoiceOfCustomer = () => {
	useCheckAuth();

	const { pathname } = useLocation();
	const { addData, addMinDate, addMaxDate, addIndex, addQueryStr } =
		useActions();
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

	const onChange = e => {
		addQueryStr(e.target.value);
	};

	const [
		trigger,
		{
			data: data_voice,
			isLoading: isLoading_voice,
			isSuccess: isSuccess_voice,
			isError: isError_voice,
			error: error_voice,
		},
	] = useLazyVoiceGraphQuery();

	const getVoiceData = useCallback(() => {
		trigger(dataForRequest);
	}, [dataForRequest]);

	// if (isError_voice || isError) {
	// 	const error_props = isError ? error : error_voice;

	// 	return <NotFound error={error_props} />;
	// }

	const [isNoData, setIsNoData] = useState(false);
	useEffect(() => {
		if (isError_voice) {
			setIsNoData(true);
			const timer = setTimeout(() => setIsNoData(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [isError_voice]);

	return (
		<Layout>
			{(isLoading || isLoading_voice) && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}
			<Content>
				<div
					className={styles.block__pageName}
					style={isSuccess_voice ? {} : { alignSelf: 'center' }}
				>
					{isSuccess_voice ? (
						<>
							<h3 className={styles.pageName__title}>Голос клиента</h3>
							<p></p>
						</>
					) : (
						<BeforeSearch
							title='Голос клиента'
							link='https://tsdoc.headsmade.com/en/voice-of-customer'
						/>
					)}
				</div>
				<div
					className={styles.block__configureSearch}
					style={isSuccess_voice ? {} : { alignSelf: 'center' }}
				>
					{isSuccess && Object.keys(dataUser ? dataUser : {}).length > 0 && (
						<DataForSearch />
					)}
					{isSuccess &&
						dataForRequest.index !== null &&
						Object.keys(dataUser ? dataUser : {}).length > 0 && (
							<CustomCalendar />
						)}
					<Input
						placeholder='Поиск по тексту'
						styleInput={{
							width: 'calc(281/1440*100vw)',
							height: 'calc(55.9/1440*100vw)',
							borderRadius: 'calc(8/1440*100vw)',
						}}
						styleLabel={{ display: 'none' }}
						onChange={onChange}
						value={
							dataForRequest.query_str === null
								? 'yes'
								: dataForRequest.query_str
						}
					/>
					<QueryStringHelp />
					<Button
						style={{
							width: 'calc(220/1440*100vw)',
							height: 'calc(56/1440*100vw)',
						}}
						onClick={getVoiceData}
					>
						Запуск
					</Button>
				</div>
				{isNoData && <NoDataRequest />}
				{!isNoData && isSuccess_voice && (
					<Suspense fallback={<Loader />}>
						<VoiceGraph />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default VoiceOfCustomer;
