import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { dataSetButtons } from '../../../data/panel.data';
import { useActions } from '../../../hooks/useActions';
import {
	useLazyGetDataFoldersQuery,
	useLazyGetProcessedFilesQuery,
} from '../../../services/dataSet.service';
import PanelTargetGraph from '../../ui/panel-target-graph/PanelTargetGraph';

import styles from './DataSet.module.scss';
import Folder from './folder/Folder';
import NoData from './no-data/NoData';

const DataSet = () => {
	const { addButtonTarget_PopupDelete } = useActions();
	const tabOneRef = useRef(null);
	const tabTwoRef = useRef(null);
	const tabThreeRef = useRef(null);
	const [elementWidth, setElementWidth] = useState({
		one: 0,
		two: 0,
		three: 0,
	});
	// const [buttonTarget, setButtonTarget] = useState('one');
	const [activeButton, setActiveButton] = useState('Файлы данных');
	const [
		trigger_getDataFolders,
		{
			data: data_getDataFolders,
			isSuccess: isSuccess_getDataFolders,
			isLoading: isLoading_getDataFolders,
		},
	] = useLazyGetDataFoldersQuery();
	const [
		trigger_getProcessedFiles,
		{
			data: data_getProcessedFiles,
			isSuccess: isSuccess_getProcessedFiles,
			isLoading: isLoading_getProcessedFiles,
		},
	] = useLazyGetProcessedFilesQuery();

	const { allData, processedData } = useSelector(state => state.folderTarget);

	useEffect(() => {
		if (activeButton === 'Файлы данных') {
			trigger_getDataFolders();
			addButtonTarget_PopupDelete(activeButton);
		} else if (activeButton === 'Файлы кластеризации авторов') {
			trigger_getProcessedFiles();
			addButtonTarget_PopupDelete(activeButton);
		} else {
			addButtonTarget_PopupDelete(activeButton);
		}
	}, [activeButton]);

	useEffect(() => {
		if (tabOneRef.current) {
			const width = tabOneRef.current.offsetWidth;
			setElementWidth(prev => ({
				...prev,
				one: width,
			}));
		}
		if (tabTwoRef.current) {
			const width = tabTwoRef.current.offsetWidth;
			setElementWidth(prev => ({
				...prev,
				two: width,
			}));
		}
		if (tabThreeRef.current) {
			const width = tabThreeRef.current.offsetWidth;
			setElementWidth(prev => ({
				...prev,
				three: width,
			}));
		}
	}, []);

	const onClick = button => {
		if (button === 'Файлы данных') {
			setActiveButton('Файлы данных');
		} else if (button === 'Файлы кластеризации авторов') {
			setActiveButton('Файлы кластеризации авторов');
		} else {
			setActiveButton('three');
		}
	};

	const [filterText, setFilterText] = useState('');
	const getFilteredData = (data, filterText) => {
		return (
			data &&
			data.values &&
			data.values.filter(folder =>
				folder.name.toLowerCase().includes(filterText.toLowerCase()),
			)
		);
	};

	const filteredData = useMemo(() => {
		if (activeButton === 'Файлы данных') {
			return getFilteredData(allData, filterText);
		} else if (activeButton === 'Файлы кластеризации авторов') {
			return getFilteredData(processedData, filterText);
		} else {
			return [];
		}
	}, [activeButton, allData, processedData, filterText]);

	const handleInputChange = event => {
		setFilterText(event.target.value);
	};

	const renderContent = (activeButton, allData) => {
		if (activeButton === 'Файлы данных') {
			return (
				<>
					{allData && allData.values && allData.values.length !== 0 ? (
						allData.values.map(folder => (
							<Folder
								key={Math.random() + Math.random()}
								folder={folder}
								processedFolder={false}
								buttonTarget={activeButton}
							/>
						))
					) : (
						<NoData />
					)}
				</>
			);
		} else if (activeButton === 'Файлы кластеризации авторов') {
			return (
				<>
					{allData && allData.values && allData.values.length !== 0 ? (
						allData.values.map(folder => (
							<Folder
								key={Math.random() + Math.random()}
								folder={folder}
								processedFolder={true}
								buttonTarget={activeButton}
							/>
						))
					) : (
						<div className={styles.block__noDat}>
							<h2 className={styles.title}>Здесь пока ничего нет</h2>
							<p className={styles.description}>
								Чтобы получить обработанные файлы для загрузки в Embedding
								Projector нужно загрузить исходные файлы в разделе <br />
								<span>Файлы для обработки</span>
							</p>
							<button onClick={() => onClick('Файлы данных')}>
								Перейти в раздел
							</button>
						</div>
					)}
				</>
			);
		}
	};

	const styleContent = {
		justifyContent:
			allData && allData.values && allData.values.length !== 0 ? '' : 'center',
		alignItems:
			allData && allData.values && allData.values.length !== 0 ? '' : 'center',
		paddingTop:
			activeButton === 'three' ? 'calc(24/1440*100vw)' : 'calc(92/1440*100vw)',
		paddingRight: activeButton === 'three' ? '0px' : 'calc(44/1440*100vw)',
	};

	return (
		<div className={styles.wrapper_dataSet}>
			<PanelTargetGraph
				handleClick={onClick}
				dataButtons={dataSetButtons}
				activeButton={activeButton}
			/>
			<div className={styles.block__content} style={styleContent}>
				{!(activeButton === 'three') && (
					<div className={styles.block__field}>
						<img
							src='/images/icons/input_button/search.svg'
							alt='search'
							className={styles.image__search}
						/>
						<input
							type='text'
							className={styles.input__search}
							placeholder='Поиск по названию'
							value={filterText}
							onChange={handleInputChange}
						/>
					</div>
				)}
				{renderContent(activeButton, { values: filteredData })}
			</div>
		</div>
	);
};

export default DataSet;
