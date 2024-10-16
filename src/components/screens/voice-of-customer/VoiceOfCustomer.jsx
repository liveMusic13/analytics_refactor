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
import { useLazyVoiceGraphQuery } from '../../../services/getGraph.service';
import { useGetDataUsersQuery } from '../../../services/other.service';
import VoiceGraph from '../../content/graphs/voice-graphs/VoiceGraph';
import Input from '../../ui/fields/input/Input';

import styles from './VoiceOfCustomer.module.scss';

const VoiceOfCustomer = () => {
	const { pathname } = useLocation();
	const { addData, addMinDate, addMaxDate, addIndex, addQueryStr } =
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

	const onChange = e => {
		addQueryStr(e.target.value);
	};

	const [
		trigger,
		{
			data: data_voice,
			isLoading: isLoading_voice,
			isSuccess: isSuccess_voice,
		},
	] = useLazyVoiceGraphQuery();

	const getVoiceData = () => {
		trigger(dataForRequest);
	};

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
						<BeforeSearch title='Голос клиента' />
					)}
				</div>
				<div
					className={styles.block__configureSearch}
					style={isSuccess_voice ? {} : { alignSelf: 'center' }}
				>
					<DataForSearch />
					<CustomCalendar />
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
						onClick={getVoiceData}
					>
						Запуск
					</Button>
				</div>
				{isSuccess_voice && (
					<Suspense fallback={<Loader />}>
						<VoiceGraph />
					</Suspense>
				)}
			</Content>
		</Layout>
	);
};

export default VoiceOfCustomer;
