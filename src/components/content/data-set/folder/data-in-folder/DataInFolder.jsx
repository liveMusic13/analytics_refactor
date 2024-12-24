import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Pagination from '@/components/ui/pagination/Pagination';

import { useActions } from '@/hooks/useActions';

import { useDataInFolder } from '../../../../../hooks/useDataInFolder';
import { useLazyDataAddFileQuery } from '../../../../../services/dataSet.service';

import styles from './DataInFolder.module.scss';
import { useLazyFileLoadQuery } from '@/services/dataSet.service';

const DataInFolder = () => {
	const navigate = useNavigate();
	const {
		addText_PopupInFolder,
		toggle_PopupInFolder,
		toggle_PopupDelete,
		addTitle_PopupDelete,
	} = useActions();
	const { data, allData, processedData } = useSelector(
		state => state.folderTarget,
	);
	const {
		title,
		folder: folderName,
		isPopupDelete,
		buttonTarget,
	} = useSelector(state => state.popupDelete);
	const [filterText, setFilterText] = useState('');

	const [
		trigger_fileLoad,
		{
			data: data_fileLoad,
			isSuccess: isSuccess_fileLoad,
			isLoading: isLoading_fileLoad,
		},
	] = useLazyFileLoadQuery();

	const [
		trigger_dataAddFile,
		{
			data: data_dataAddFile,
			isSuccess: isSuccess_dataAddFile,
			isLoading: isLoading_dataAddFile,
		},
	] = useLazyDataAddFileQuery();

	const [dragging, setDragging] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const filesPerPage = 9;

	const isDataSetPath = /^\/data-set(\/processed)\/[^/]+$/.test(
		location.pathname,
	);

	// const onClick = async (file, button) => {
	// 	if (button === 'edit') {
	// 		addText_PopupInFolder({
	// 			title: 'Редактирование файла',
	// 			name_file: file,
	// 		});

	// 		toggle_PopupInFolder('');
	// 	} else if (button === 'delete') {
	// 		const dataForRequest = {
	// 			isFolder: false,
	// 			name: '',
	// 		};

	// 		addTitle_PopupDelete({
	// 			folder: file,
	// 			title: 'Файл',
	// 			processed: isDataSetPath ? true : false,
	// 		});
	// 		toggle_PopupDelete('');
	// 	} else {
	// 		trigger_fileLoad({
	// 			folder_name: data.name,
	// 			file_name: file,
	// 		});

	// 		downloadFile(file, data_fileLoad);
	// 	}
	// };

	const renderFiles = (data, allData) => {
		const folderIndex = allData.values.findIndex(
			folder => folder.name === data.name,
		);

		if (folderIndex !== -1) {
			return allData.values[folderIndex];
		} else {
			return { values: [] };
		}
	};
	const files = renderFiles(
		data,
		isDataSetPath ? processedData : allData,
	).values.filter(file =>
		file.toLowerCase().includes(filterText.toLowerCase()),
	);
	const allFiles = renderFiles(
		data,
		isDataSetPath ? processedData : allData,
	).values;

	const totalPages = Math.ceil(files.length / filesPerPage);

	const style = {
		block__files: {
			display: allFiles.length > 0 ? 'block' : 'flex',
			justifyContent: allFiles.length > 0 ? undefined : 'center',
			borderTop:
				allFiles.length > 0 ? '1px solid rgba(#1e1e1e, $alpha: 0.04)' : 'none',
		},
		block__field: {
			display: allFiles.length > 0 ? 'flex' : 'none',
		},
	};

	const viewStyle = name => ({
		display: isPopupDelete && folderName === name ? 'none' : 'flex',
	});

	const {
		onClick,
		handleInputChange,
		handlePageChange,
		handleFileChange,
		handleDrop,
		handleDragLeave,
		handleDragOver,
	} = useDataInFolder();

	// const handleDragOver = event => {
	// 	event.preventDefault();
	// 	setDragging(true);
	// };

	// const handleDragLeave = () => {
	// 	setDragging(false);
	// };

	// const handleDrop = event => {
	// 	event.preventDefault();
	// 	setDragging(false);

	// 	const droppedFiles = event.dataTransfer.files;
	// 	if (droppedFiles.length) {
	// 		const formData = new FormData();
	// 		formData.append('uploaded_file', droppedFiles[0]);
	// 		// Предполагается, что у вас есть функция addFile для передачи файла на сервер
	// 		trigger_dataAddFile(formData, data.name, droppedFiles[0].name);
	// 	}
	// };

	// const handleFileChange = event => {
	// 	const selectedFile = event.target.files[0];
	// 	if (selectedFile) {
	// 		// const formData = new FormData();
	// 		// formData.append('uploaded_file', selectedFile);
	// 		const formData = {
	// 			uploaded_file: selectedFile,
	// 		};

	// 		console.log('in onClick', formData, data.name);

	// 		// Передача файла на сервер
	// 		// trigger_dataAddFile(formData, data.name, selectedFile.name);
	// 		trigger_dataAddFile({
	// 			data: formData,
	// 			name: data.name,
	// 			fileName: selectedFile.name,
	// 		});
	// 	}
	// };

	// const handlePageChange = page => {
	// 	setCurrentPage(page);
	// };

	// const handleInputChange = event => {
	// 	setFilterText(event.target.value);
	// };

	return (
		<div className={styles.wrapper_dataInFolder}>
			<button className={styles.button__back} onClick={() => navigate(-1)}>
				<img src='/images/icons/arrow_in_folder_left.svg' alt='arrow' />
				Назад
			</button>
			<div className={styles.block__title}>
				<h3 className={styles.title}>{data.name}</h3>
				<div className={styles.block__field} style={style.block__field}>
					<img
						src='/images/icons/input_button/search.svg'
						alt='search'
						className={styles.image__search}
					/>
					<input
						type='text'
						className={styles.input__search}
						placeholder='Поиск по названию'
						onChange={handleInputChange}
					/>
				</div>
			</div>
			<div className={styles.block__files} style={style.block__files}>
				{allFiles.length > 0 ? (
					<>
						{files
							.slice(
								(currentPage - 1) * filesPerPage,
								currentPage * filesPerPage,
							)
							.map(file => (
								<div key={file} className={styles.file} style={viewStyle(file)}>
									<p className={styles.name}>{file}</p>
									<div className={styles.block__buttons}>
										{isDataSetPath ? (
											<button
												className={styles.button__upload}
												onClick={() => onClick(file, 'upload')}
											>
												<img
													src='/images/icons/setting/upload.svg'
													alt='upload'
												/>
											</button>
										) : (
											<button
												className={styles.button__edit}
												onClick={() => onClick(file, 'edit')}
											>
												<img src='/images/icons/setting/edit.svg' alt='edit' />
											</button>
										)}
										<button
											className={styles.button__delete}
											onClick={() => onClick(file, 'delete')}
										>
											<img
												src='/images/icons/setting/delete.svg'
												alt='delete'
											/>
										</button>
									</div>
								</div>
							))}
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</>
				) : (
					<div className={styles.block__add}>
						<h3 className={styles.title__add}>Здесь пока ничего нет</h3>
						<div
							className={`${styles.add__file} ${
								dragging ? styles.dragging : ''
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<p className={styles.description}>
								Перетащите файл или выберите на компьютере
							</p>
							<div className={styles.choice__file}>
								<input
									type='file'
									className={styles.input__add}
									onChange={handleFileChange}
								/>
								<p className={styles.choice}>Выбрать файл</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DataInFolder;
