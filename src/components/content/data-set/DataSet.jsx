import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import PanelTargetGraph from '@/components/ui/panel-target-graph/PanelTargetGraph';

import { useActions } from '@/hooks/useActions';

import {
	useGetUserFoldersQuery,
	useGetUserIdQuery,
} from '../../../services/other.service';

import styles from './DataSet.module.scss';
import Folder from './folder/Folder';
import NoData from './no-data/NoData';
import { dataSetButtons } from '@/data/panel.data';

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
	const [activeButton, setActiveButton] = useState('Файлы данных');

	const {
		data: data_getUserId,
		isError: isError_getUserId,
		error: error_getUserId,
		isLoading: isLoading_getUserId,
	} = useGetUserIdQuery();
	const { data, isError, error, isLoading, isSuccess } =
		useGetUserFoldersQuery(data_getUserId);

	const { processedData } = useSelector(state => state.folderTarget);

	useEffect(() => {
		if (activeButton === 'Файлы данных') {
			addButtonTarget_PopupDelete(activeButton);
		} else if (activeButton === 'Файлы кластеризации авторов') {
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

	const {
		json_files_directory: dataUser,
		projector_files_directory: dataUser_Projector,
	} = useSelector(store => store.dataUsersSlice);

	console.log(
		'dataUser',
		dataUser,
		'dataUser_Projector',
		dataUser_Projector || {},
	);

	const allData = Object.keys(
		activeButton === 'Файлы данных' ? dataUser : dataUser_Projector || {},
	);

	const [filterText, setFilterText] = useState('');
	const getFilteredData = (data, filterText) => {
		return (
			data &&
			data.filter(folder =>
				folder.toLowerCase().includes(filterText.toLowerCase()),
			)
		);
	};

	const filteredData = useMemo(() => {
		if (activeButton === 'Файлы данных') {
			return getFilteredData(allData, filterText);
		} else if (activeButton === 'Файлы кластеризации авторов') {
			return getFilteredData(allData, filterText);
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
								Projector нужно запустить расчет кластеризации авторов <br />
								{/* <span>Файлы для обработки</span> */}
							</p>
							{/* <button onClick={() => onClick('Файлы данных')}> */}
							<button onClick={() => onClick('Файлы данных')}>
								Запустить расчет
							</button>
						</div>
					)}
				</>
			);
		}
	};

	const styleContent = {
		justifyContent: allData && allData.length !== 0 ? '' : 'center',
		alignItems: allData && allData.length !== 0 ? '' : 'center',
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
