import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import BeforeSearch from '@/components/content/before-search/BeforeSearch';
import InformationGraphs from '@/components/content/graphs/information-graphs/InformationGraphs';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import AdditionalParameters from '@/components/ui/additional-parameters/AdditionalParameters';
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

import styles from './Information.module.scss';
import { useLazyInformationGraphQuery } from '@/services/getGraph.service';

const Information = () => {
	useCheckAuth();

	const { pathname } = useLocation();
	const { addData, addMinDate, addMaxDate, addIndex, addQueryStr } =
		useActions();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { json_files_directory: dataUser } = useSelector(
		store => store.dataUsersSlice,
	);
	const dataForRequest = useSelector(state => state.dataForRequest);

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
			data: data_information,
			isLoading: isLoading_information,
			isSuccess: isSuccess_information,
			isError: isError_information,
			error: error_information,
		},
	] = useLazyInformationGraphQuery();

	const getInformationData = useCallback(() => {
		trigger(dataForRequest);
	}, [dataForRequest]);

	const onChange = e => {
		addQueryStr(e.target.value);
	};

	// if (isError_information || isError) {
	// 	const error_props = isError ? error : error_information;
	// 	return <NotFound error={error_props} />;
	// }

	const [isNoData, setIsNoData] = useState(false);
	useEffect(() => {
		if (isError_information) {
			setIsNoData(true);
			const timer = setTimeout(() => setIsNoData(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [isError_information]);

	return (
		<Layout>
			{(isLoading || isLoading_information) && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}
			<Content>
				<div
					className={styles.block__pageName}
					style={isSuccess_information ? {} : { alignSelf: 'center' }}
				>
					{isSuccess_information ? (
						<>
							<h3 className={styles.pageName__title}>Информационный граф</h3>
							<p>
								{/* {data_information?.values?.length === 0
									? ''
									: `${funksInformationGraph.countTextAuthors(
											data_information?.values,
										)} текста(ов) и ${
											data_information?.values?.length
										} автора(ов)`} */}
								{data_information?.values?.length === 0
									? ''
									: `${data_information.num_messages} текста(ов) и ${
											data_information?.num_unique_authors
										} автора(ов)`}
							</p>
						</>
					) : (
						<BeforeSearch title='Информационный граф' />
					)}
				</div>
				<div
					className={styles.block__configureSearch}
					style={isSuccess_information ? {} : { alignSelf: 'center' }}
				>
					{isSuccess && Object.keys(dataUser ? dataUser : {}).length > 0 && (
						<DataForSearch multi={false} />
					)}
					{isSuccess &&
						dataForRequest.index !== null &&
						Object.keys(dataUser ? dataUser : {}).length > 0 && (
							<CustomCalendar />
						)}
					<AdditionalParameters />
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
						onClick={getInformationData}
					>
						Запуск
					</Button>
				</div>
				{isNoData && <NoDataRequest />}
				{!isNoData && isSuccess_information && (
					<Suspense fallback={<Loader />}>
						<InformationGraphs />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default Information;
