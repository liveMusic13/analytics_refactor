import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { analysisOfThemesButtons } from '../../../../data/panel.data';
import { useGetUserIdQuery } from '../../../../services/other.service';
import { useLlmAnalyzeQuery } from '../../../../services/tables.service';
import { findKeyById } from '../../../../utils/searchInData';
import HtmlRenderer from '../../../html-renderer/HtmlRenderer';
import PanelTargetGraph from '../../../ui/panel-target-graph/PanelTargetGraph';

import styles from './AnalysisOfThemes.module.scss';
import Analysis from './ayalysis/Analysis';
import ThemesIdentified from './themes-identified/ThemesIdentified';

const AnalysisOfThemes = () => {
	const [activeButton, setActiveButton] = useState('Кластеризация на тематики');

	const dataForRequest = useSelector(state => state.dataForRequest);
	const { bertopic_files_directory: dataUser } = useSelector(
		store => store.dataUsersSlice,
	);
	const { index_doc } = useSelector(state => state.aiData);

	const { data: data_getUserId } = useGetUserIdQuery();

	const arrayData =
		dataUser && Object.keys(dataUser).length > 0 ? dataUser : {};

	const file_name = Object.values(arrayData)
		.flat()
		.find(file => index_doc === file.index_number);

	const dataRequest = {
		user_id: data_getUserId,
		folder_name: findKeyById(index_doc, dataUser),
		file_name: file_name?.['html-file'] || '',
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

	return (
		<div className={styles.block__graph}>
			<div className={styles.block__title}>
				<PanelTargetGraph
					handleClick={handleClick}
					dataButtons={analysisOfThemesButtons}
					activeButton={activeButton}
				/>
			</div>
			<div className={styles.container__graph} id='graph-for-download'>
				{activeButton === 'Кластеризация на тематики' ? (
					<HtmlRenderer htmlString={data_llm?.html_content || ''} />
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
