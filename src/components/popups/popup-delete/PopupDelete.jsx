import { useSelector } from 'react-redux';

import { useActions } from '../../../hooks/useActions';
import { useLazyDataDeleteQuery } from '../../../services/dataSet.service';

import styles from './PopupDelete.module.scss';

const PopupDelete = () => {
	const {
		toggle_PopupDelete,
		addButtonTarget_PopupDelete,
		deleteProcessedFolder,
		deleteFolder,
		deleteProcessedDataFolder,
		deleteDataFolder,
	} = useActions();
	const { title, folder, isProcessed, buttonTarget } = useSelector(
		state => state.popupDelete,
	);
	const { data: targetData, allData } = useSelector(
		state => state.folderTarget,
	);
	const [
		trigger_dataDelete,
		{ data: data_dataDelete, isSuccess: isSuccess_dataDelete },
	] = useLazyDataDeleteQuery();

	const onClick = button => {
		if (button === 'stop') {
			toggle_PopupDelete('');
		} else {
			const data = {
				isFolder: title === 'Папка' ? true : false,
				name: folder,
				base_files:
					buttonTarget === 'Файлы кластеризации авторов' ? false : true,
			};
			if (title === 'Папка') {
				trigger_dataDelete(null, data);

				if (buttonTarget === 'Файлы кластеризации авторов') {
					deleteProcessedFolder({
						name_folder: folder,
					});
				} else {
					deleteFolder({
						name_folder: folder,
					});
				}
			} else {
				trigger_dataDelete(folder, data);

				if (isProcessed) {
					deleteProcessedDataFolder({
						name_folder: targetData.name,
						name_file: folder,
					});
				} else {
					deleteDataFolder({
						name_folder: targetData.name,
						name_file: folder,
					});
				}
			}
			toggle_PopupDelete('');

			const timeoutId = setTimeout(() => {
				addButtonTarget_PopupDelete('');
			}, 3000);

			return () => clearTimeout(timeoutId);
		}
	};

	return (
		<div className={styles.block__popupDelete}>
			<p>
				{title === 'Папка' ? `${title + ' удалена'}` : `${title + ' удален'}`}
			</p>
			<button className={styles.button__stop} onClick={() => onClick('stop')}>
				Отменить
			</button>
			<button className={styles.button__close} onClick={() => onClick('close')}>
				<img src='/images/icons/exit.svg' alt='exit' />
			</button>
		</div>
	);
};

export default PopupDelete;
