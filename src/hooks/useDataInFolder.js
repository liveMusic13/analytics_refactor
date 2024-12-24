import { useSelector } from 'react-redux';

import { useDataAddFileMutation } from '../services/dataSet.service';

import { useActions } from './useActions';
import { useLazyFileLoadQuery } from '@/services/dataSet.service';

export const useDataInFolder = () => {
	const {
		addText_PopupInFolder,
		toggle_PopupInFolder,
		toggle_PopupDelete,
		addTitle_PopupDelete,
	} = useActions();
	const { data } = useSelector(state => state.folderTarget);
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
	] = useDataAddFileMutation();

	const onClick = async (file, button) => {
		if (button === 'edit') {
			addText_PopupInFolder({
				title: 'Редактирование файла',
				name_file: file,
			});

			toggle_PopupInFolder('');
		} else if (button === 'delete') {
			const dataForRequest = {
				isFolder: false,
				name: '',
			};

			addTitle_PopupDelete({
				folder: file,
				title: 'Файл',
				processed: isDataSetPath ? true : false,
			});
			toggle_PopupDelete('');
		} else {
			trigger_fileLoad({
				folder_name: data.name,
				file_name: file,
			});

			downloadFile(file, data_fileLoad);
		}
	};

	const handleDragOver = event => {
		event.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = () => {
		setDragging(false);
	};

	const handleDrop = event => {
		event.preventDefault();
		setDragging(false);

		const droppedFiles = event.dataTransfer.files;
		if (droppedFiles.length) {
			const formData = new FormData();
			formData.append('uploaded_file', droppedFiles[0]);
			// Предполагается, что у вас есть функция addFile для передачи файла на сервер
			trigger_dataAddFile(formData, data.name, droppedFiles[0].name);
		}
	};

	const handleFileChange = event => {
		const selectedFile = event.target.files[0];
		if (selectedFile) {
			// const formData = new FormData();
			// formData.append('uploaded_file', selectedFile);
			const formData = {
				uploaded_file: selectedFile,
			};

			console.log('in onClick', formData, data.name);

			// Передача файла на сервер
			// trigger_dataAddFile(formData, data.name, selectedFile.name);
			trigger_dataAddFile({
				data: formData,
				name: data.name,
				fileName: selectedFile.name,
			});
		}
	};

	const handlePageChange = page => {
		setCurrentPage(page);
	};

	const handleInputChange = event => {
		setFilterText(event.target.value);
	};

	return {
		onClick,
		handleInputChange,
		handlePageChange,
		handleFileChange,
		handleDrop,
		handleDragLeave,
		handleDragOver,
	};
};
