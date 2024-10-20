import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useLazyGetIdProgressBarQuery } from '../../../../services/tables.service';

import styles from './AiAnalytics.module.scss';
import AiTable from './ai-tables/AiTable';
import AiTablePost from './ai-tables/AiTablePost';

const AiAnalytics = () => {
	const { post, idProgressBar, viewTable } = useSelector(state => state.aiData);
	const { infoAboutPost } = useSelector(state => state.dataForRequest);

	const [stateLoad, setStateLoad] = useState('100');

	const [
		trigger_getIdProgressBar,
		{
			data: data_getIdProgressBar,
			isLoading: isLoading_getIdProgressBar,
			isSuccess: isSuccess_getIdProgressBar,
		},
	] = useLazyGetIdProgressBarQuery();

	useEffect(() => {
		// Логика для изменения состояния загрузки, если необходимо
	}, [infoAboutPost]);

	useEffect(() => {
		if (idProgressBar !== null && idProgressBar !== '100') {
			trigger_getIdProgressBar(idProgressBar);
			const intervalId = setInterval(() => {
				trigger_getIdProgressBar(idProgressBar);
				console.log('est');
			}, 3000);
			return () => clearInterval(intervalId);
		}
	}, [idProgressBar]);

	return (
		<div className={styles.block__table}>
			{/* {stateLoad !== null && (
				<div className={styles.block__stateLoad}>
					<h4 className={styles.title__info}>
						{stateLoad === '100'
							? 'Обработка запроса завершена'
							: 'ИИ анализ запущен'}
					</h4>
					<p className={styles.description__info}>
						{stateLoad === '100'
							? 'Результат анализа будет доступен после его завершения в разделе Анализ тематик. Вы можете покинуть страницу и вернуться к ней в любое время без потери прогресса.'
							: 'Результат анализа доступен в разделе Анализ тематик'}
					</p>
					<ProgressBar stateLoad={stateLoad} />
				</div>
			)} */}
			{viewTable !== null && viewTable === 'get' && idProgressBar === null ? (
				<AiTable />
			) : (
				<AiTablePost />
			)}
		</div>
	);
};

export default AiAnalytics;
