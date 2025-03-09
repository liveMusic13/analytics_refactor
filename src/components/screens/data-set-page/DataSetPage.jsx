import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Content from '@/components/content/Content';
import Layout from '@/components/layout/Layout';
import BackgroundLoader from '@/components/loading/background-loader/BackgroundLoader';
import Loader from '@/components/loading/loader/Loader';
import LeftMenu from '@/components/ui/left-menu/LeftMenu';
import LeftMenuActive from '@/components/ui/left-menu/left-menu-active/LeftMenuActive';

import { useActions } from '../../../hooks/useActions';
import { useCheckAuth } from '../../../hooks/useCheckAuth';
import { useDataAddFileMutation } from '../../../services/dataSet.service';
import {
	useGetUserFoldersQuery,
	useGetUserIdQuery,
} from '../../../services/other.service';
import DataSet from '../../content/data-set/DataSet';
import DataInFolder from '../../content/data-set/folder/data-in-folder/DataInFolder';
import PopupDelete from '../../popups/popup-delete/PopupDelete';
import PopupInFolder from '../../popups/popup-in-folder/PopupInFolder';
import NotFound from '../not-found/NotFound';

import styles from './DataSetPage.module.scss';

const DataSetPage = () => {
	useCheckAuth();

	const { addText_PopupInFolder, toggle_PopupInFolder } = useActions();
	const { pathname } = useLocation();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { isPopupInFolder } = useSelector(state => state.popupInFolder);

	const { data } = useSelector(state => state.folderTarget);
	const { isPopupDelete, buttonTarget } = useSelector(
		state => state.popupDelete,
	);

	const {
		data: data_getUserId,
		isError: isError_getUserId,
		error: error_getUserId,
		isLoading: isLoading_getUserId,
	} = useGetUserIdQuery();
	const { refetch, isError, error, isLoading, isSuccess } =
		useGetUserFoldersQuery(data_getUserId);
	const [
		trigger_dataAddFile,
		{
			data: data_dataAddFile,
			isSuccess: isSuccess_dataAddFile,
			isLoading: isLoading_dataAddFile,
			isError: isError_dataAddFile,
			error: error_dataAddFile,
		},
	] = useDataAddFileMutation();

	const [fileName, setFileName] = useState('');
	const [file, setFile] = useState(null);

	const handleFileChange = event => {
		const selectedFile = event.target.files[0];

		if (selectedFile) {
			setFile(selectedFile);
			setFileName(selectedFile.name);
		}
	};

	const onClick = () => {
		addText_PopupInFolder({
			title: 'Новая папка',
			name_file: isPopupInFolder.name_file,
		});
		toggle_PopupInFolder('');
	};

	useEffect(() => {
		if (file) {
			const formData = {
				uploaded_file: file,
			};

			const async_requests = async () => {
				await trigger_dataAddFile({
					data: formData,
					name: data,
					user: data_getUserId,
					fileName: fileName,
					// directory: buttonTarget,
				}).unwrap();
				setFile(null);
				refetch();
			};
			async_requests();
		}
	}, [file]);

	if (isError_dataAddFile) {
		return <NotFound error={error_dataAddFile} />;
	}

	return (
		<Layout>
			{isPopupInFolder && <PopupInFolder />}
			{isLoading_dataAddFile && (
				<>
					<BackgroundLoader />
					<Loader />
				</>
			)}
			{pathname !== '/home' && active_menu ? <LeftMenuActive /> : <LeftMenu />}

			<Content style={{ height: '95%' }}>
				<div className={styles.block__pageName}>
					<h3 className={styles.pageName__title}>Данные</h3>
					{pathname === '/data-set' ? (
						buttonTarget !== 'Файлы данных' ? null : (
							<button className={styles.button__title} onClick={onClick}>
								Создать папку
							</button>
						)
					) : (
						<button className={`${styles.button__title} ${styles.download}`}>
							<input
								type='file'
								className={styles.file}
								onChange={handleFileChange}
							/>
							<img
								src='/images/icons/upload_white.svg'
								alt='upload'
								className={styles.upload}
							/>
							Загрузить файл
						</button>
					)}
				</div>
				{pathname === '/data-set' ? <DataSet /> : <DataInFolder />}
				{isPopupDelete && <PopupDelete />}
			</Content>
		</Layout>
	);
};

export default DataSetPage;
