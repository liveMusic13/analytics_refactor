import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useActions } from '../../../hooks/useActions';
import {
	useLazyCreateFolderQuery,
	useLazyFileRenameQuery,
} from '../../../services/dataSet.service';

import styles from './PopupInFolder.module.scss';

const PopupInFolder = () => {
	const {
		addNewText,
		createFolder,
		addText_PopupInFolder,
		toggle_PopupInFolder,
	} = useActions();
	const popupInFolder = useSelector(state => state.popupInFolder);
	const { data, allData } = useSelector(state => state.folderTarget);
	const [value, setValue] = useState(
		popupInFolder.title === 'Новая папка' ? '' : popupInFolder.name_file,
	);

	const [
		trigger_fileRename,
		{ data: data_fileRename, isSuccess: isSuccess_fileRename },
	] = useLazyFileRenameQuery();
	const [
		trigger_createFolder,
		{ data: data_createFolder, isSuccess: isSuccess_createFolder },
	] = useLazyCreateFolderQuery();

	const onChange = e => {
		setValue(e.target.value);
	};

	const onClick = () => {
		trigger_fileRename(value);
		addNewText({
			value,
			name_folder: data.name,
			name_file: popupInFolder.name_file,
		});
		addText_PopupInFolder({
			title: 'Редактирование файла',
			name_file: value,
		});
		toggle_PopupInFolder('');
	};

	const onClick_folder = () => {
		trigger_createFolder(value);

		createFolder({
			name: value,
		});

		toggle_PopupInFolder('');
	};

	return (
		<div className={styles.block__popup}>
			<div className={styles.block__title}>
				<h4 className={styles.title}>{popupInFolder.title}</h4>
				<button
					className={styles.button__exit}
					onClick={() => toggle_PopupInFolder('')}
				>
					<img src='/images/icons/exit.svg' alt='exit' />
				</button>
			</div>
			<input
				type='text'
				className={styles.input}
				value={value}
				placeholder={
					popupInFolder.title === 'Новая папка' ? 'Название папки' : ''
				}
				onChange={onChange}
			/>
			<button
				className={styles.button__title}
				onClick={
					popupInFolder.title === 'Новая папка' ? onClick_folder : onClick
				}
			>
				Сохранить
			</button>
		</div>
	);
};

export default PopupInFolder;
