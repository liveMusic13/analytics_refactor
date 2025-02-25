import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { analysisOfThemesButtons } from '../../../../data/panel.data';
import { useGetUserIdQuery } from '../../../../services/other.service';
import { useLlmAnalyzeQuery } from '../../../../services/tables.service';
import HtmlRenderer from '../../../html-renderer/HtmlRenderer';
import PanelTargetGraph from '../../../ui/panel-target-graph/PanelTargetGraph';

import styles from './AnalysisOfThemes.module.scss';
import Analysis from './ayalysis/Analysis';
import ThemesIdentified from './themes-identified/ThemesIdentified';

const AnalysisOfThemes = () => {
	const [activeButton, setActiveButton] = useState('Кластеризация на тематики');
	const [activeSubcategory, setActiveSubcategory] = useState('Группировка тем');

	const { bertopic_files_directory: dataUser } = useSelector(
		store => store.dataUsersSlice,
	);
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { index_doc } = useSelector(state => state.aiData);

	const { data: data_getUserId } = useGetUserIdQuery();

	const arrayData =
		dataUser && Object.keys(dataUser).length > 0 ? dataUser : {};

	const file_name = Object.values(arrayData)
		.flat()
		.find(file => index_doc === file.index_number);

	const dataRequest = {
		user_id: data_getUserId,
		// folder_name: findKeyById(index_doc, dataUser),
		// file_name: file_name?.['html-file'] || '',
		folder_name: dataForRequest.folder_name_html_file_request,
		file_name: dataForRequest.first_html_file_request || '',
	};

	const {
		data: data_llm,
		isLoading: isLoading_llm,
		isSuccess: isSuccess_llm,
	} = useLlmAnalyzeQuery(dataRequest);

	const handleClick = useCallback(
		but => {
			setActiveButton(but);
		},
		[activeButton],
	);

	const handleClickSubcategory = useCallback(button => {
		setActiveSubcategory(button);
	}, []);

	const dataForPageHTML =
		activeSubcategory === 'Первый график'
			? 'html_content'
			: 'html_content_dataplot';

	return (
		<div className={styles.block__graph}>
			<div className={styles.block__title}>
				<PanelTargetGraph
					handleClick={handleClick}
					dataButtons={analysisOfThemesButtons}
					activeButton={activeButton}
				/>
			</div>
			<div className={styles.block__subcategory}>
				<div
					className={styles.block__radio}
					style={
						activeButton === 'Выявленные темы' ||
						activeButton === 'Анализ тематик'
							? { display: 'none' }
							: {}
					}
				>
					<input
						type='radio'
						className={styles.radio}
						name='subcategory' // добавляем одинаковый атрибут name
						checked={activeSubcategory === 'Группировка тем'}
						onChange={() => handleClickSubcategory('Группировка тем')}
					/>
					<p className={styles.text__radio}>Группировка тем</p>
				</div>
				<div
					className={styles.block__radio}
					style={
						activeButton === 'Выявленные темы' ||
						activeButton === 'Анализ тематик'
							? { display: 'none' }
							: {}
					}
				>
					<input
						type='radio'
						className={styles.radio}
						name='subcategory' // добавляем одинаковый атрибут name
						checked={activeSubcategory === 'Ландшафт тем'}
						onChange={() => handleClickSubcategory('Ландшафт тем')}
					/>
					<p className={styles.text__radio}>Ландшафт тем</p>
				</div>
			</div>
			<div className={styles.container__graph} id='graph-for-download'>
				{activeButton === 'Кластеризация на тематики' ? (
					<HtmlRenderer htmlString={data_llm?.[dataForPageHTML] || ''} />
				) : activeButton === 'Выявленные темы' ? (
					<ThemesIdentified />
				) : (
					<Analysis />
				)}
			</div>
		</div>
	);
};

export default AnalysisOfThemes;
