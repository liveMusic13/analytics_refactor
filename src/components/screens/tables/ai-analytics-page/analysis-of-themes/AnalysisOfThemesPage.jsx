// import { useAddBaseAndDate } from '../../../../../hooks/useAddBaseAndDate';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Content from '@/components/content/Content';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import LeftMenu from '@/components/ui/left-menu/LeftMenu';
import LeftMenuActive from '@/components/ui/left-menu/left-menu-active/LeftMenuActive';

import { useActions } from '../../../../../hooks/useActions';
import {
	useGetUserFoldersQuery,
	useGetUserIdQuery,
} from '../../../../../services/other.service';
import { useLazyLlmAnalyzeQuery } from '../../../../../services/tables.service';
import { findKeyById } from '../../../../../utils/searchInData';
import AnalysisOfThemes from '../../../../content/tables/analysis-of-themes/AnalysisOfThemes';
import ProgressBar from '../../../../ui/progress-bar/ProgressBar';

import styles from './AnalysisOfThemesPage.module.scss';

const AnalysisOfThemesPage = () => {
	const { pathname } = useLocation();
	const nav = useNavigate();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { statusBarStart, finalStatus, index_doc } = useSelector(
		state => state.aiData,
	);
	const { bertopic_files_directory: dataUser } = useSelector(
		store => store.dataUsersSlice,
	);
	const [
		trigger,
		{ data: data_llm, isLoading: isLoading_llm, isSuccess: isSuccess_llm },
	] = useLazyLlmAnalyzeQuery();

	const { data: data_getUserId } = useGetUserIdQuery();
	const { data, isError, error, isLoading, isSuccess } =
		useGetUserFoldersQuery(data_getUserId);

	const { addMinDate, addMaxDate, toggleBarStart } = useActions();

	//HELP: Функция для обновления min/max даты
	const updateDates = useCallback(
		targetData => {
			if (targetData && targetData.length > 0) {
				console.log('dsdf', targetData);
				addMinDate(targetData.min_data);
				addMaxDate(targetData.max_data);
			}
		},
		[addMinDate, addMaxDate],
	);

	////////////////////HELP:добавление дат на данной странице по индексу документа
	const arrayData =
		dataUser && Object.keys(dataUser).length > 0 ? dataUser : {};

	const foundArray = Object.values(arrayData)
		.flat()
		.find(el => el.index_number === index_doc);

	useEffect(() => {
		if (foundArray) {
			updateDates(foundArray);
		}
	}, [dataUser]);
	///////////////////

	const file_name = Object.values(arrayData)
		.flat()
		.find(file => index_doc === file.index_number);

	const dataRequest = {
		user_id: data_getUserId,
		folder_name: findKeyById(index_doc, dataUser),
		file_name: file_name?.['html-file'] || '',
	};

	const onClick = () => {
		trigger(dataRequest);
	};

	const handleClickBack = () => {
		toggleBarStart(false);
		nav('/');
	};

	return (
		<Layout>
			{isLoading_llm && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}
			<Content>
				<div
					className={styles.block__pageName}
					style={isSuccess_llm ? { height: 'auto' } : {}}
				>
					<h3 className={styles.pageName__title}>Анализ тем</h3>
				</div>

				{statusBarStart && !isSuccess_llm && (
					<>
						<button className={styles.button__back} onClick={handleClickBack}>
							<img src='/images/icons/arrow_in_folder_left.svg' alt='arrow' />
							Назад
						</button>
						<div className={styles.block__calculation}>
							<h3 className={styles.title__calculation}>
								{finalStatus
									? 'Расчет данных завершен'
									: 'Расчет данных запущен'}
							</h3>
							<p className={styles.description__calculation}>
								{finalStatus
									? 'Результат анализа доступен по нажатию на кнопку'
									: ' Вы можете покинуть страницу и вернуться к ней в любое время без потери прогресса.  Результат анализа доступен в разделе Анализ тем'}
							</p>
							<ProgressBar />
							{finalStatus && (
								<button onClick={onClick} className={styles.button}>
									Показать данные
								</button>
							)}
						</div>
					</>
				)}
				{isSuccess_llm && <AnalysisOfThemes />}
			</Content>
		</Layout>
	);
};

export default AnalysisOfThemesPage;
