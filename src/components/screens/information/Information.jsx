import { Suspense, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import BeforeSearch from '@/components/content/before-search/BeforeSearch';
import InformationGraphs from '@/components/content/graphs/information-graphs/InformationGraphs';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import NotFound from '@/components/screens/not-found/NotFound';
import AdditionalParameters from '@/components/ui/additional-parameters/AdditionalParameters';
import Button from '@/components/ui/button/Button';
import CustomCalendar from '@/components/ui/custom-calendar/CustomCalendar';
import DataForSearch from '@/components/ui/data-for-search/DataForSearch';
import Input from '@/components/ui/fields/input/Input';
import LeftMenu from '@/components/ui/left-menu/LeftMenu';
import LeftMenuActive from '@/components/ui/left-menu/left-menu-active/LeftMenuActive';

import { useActions } from '@/hooks/useActions';
import { useAddBaseAndDate } from '@/hooks/useAddBaseAndDate';

import { funksInformationGraph } from '@/utils/editData';

import styles from './Information.module.scss';
import { useLazyInformationGraphQuery } from '@/services/getGraph.service';
import { useGetDataUsersQuery } from '@/services/other.service';

const Information = () => {
	const { pathname } = useLocation();
	const { addData, addMinDate, addMaxDate, addIndex, addQueryStr } =
		useActions();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { values: dataUser } = useSelector(store => store.dataUsersSlice);
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { data, isLoading, isSuccess, isError, error } = useGetDataUsersQuery();

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

	if (isError_information || isError) {
		const error_props = isError ? error : error_information;

		return <NotFound error={error_props} />;
	}

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
								{data_information?.values?.length === 0
									? ''
									: `${funksInformationGraph.countTextAuthors(
											data_information?.values,
										)} текста(ов) и ${
											data_information?.values?.length
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
					<DataForSearch multi={false} />
					{isSuccess &&
						dataForRequest.index !== null &&
						dataUser.length > 0 && <CustomCalendar />}
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
				{isSuccess_information && (
					<Suspense fallback={<Loader />}>
						<InformationGraphs />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default Information;
