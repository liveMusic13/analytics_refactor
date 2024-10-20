import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useActions } from '@/hooks/useActions';

import { groupByFirstWord } from '@/utils/editData';
import { truncateDescription } from '@/utils/editText';

import styles from './DataForSearch.module.scss';

const DataForSearch = ({ multi }) => {
	const [isViewOptions, setViewOptions] = useState(false);
	const { values: dataUser } = useSelector(store => store.dataUsersSlice);
	const dataForRequest = useSelector(state => state.dataForRequest);
	const { addIndex, addThemesInd } = useActions();
	const [checkedState, setCheckedState] = useState({});
	// Группируем данные
	const groupedData = groupByFirstWord(dataUser);

	useEffect(() => {
		// Обновляем состояние чекбоксов на основе обновленного состояния Redux
		const newCheckedState = {};
		dataUser.forEach(base => {
			let isChecked = dataForRequest.themes_ind.includes(base.index_number);
			newCheckedState[base.index_number] = isChecked;
		});
		setCheckedState(newCheckedState);
	}, [dataForRequest.themes_ind, dataUser]);

	const onClick = option => {
		if (multi) {
			addThemesInd(option.index_number);
		} else {
			addIndex(option.index_number);
			setViewOptions(!isViewOptions);
		}
	};

	const findTargetFileMulti =
		dataForRequest.themes_ind.length > 0
			? dataUser.find(file =>
					dataForRequest.themes_ind.includes(file.index_number),
				)
			: undefined;

	const findTargetFile =
		dataForRequest.index !== undefined
			? dataUser.find(file => file.index_number === dataForRequest.index)
			: undefined;

	const nameFile = multi
		? findTargetFileMulti?.file || ''
		: findTargetFile?.file || '';

	const numLength = multi ? 26 : 30;
	// const numLength = 30;

	return (
		<div className={styles.wrapper_data}>
			<div
				className={styles.block__data}
				onClick={() => setViewOptions(!isViewOptions)}
			>
				<div className={styles.block__description}>
					<h2>Выберите необходимую базу</h2>
					<p>{truncateDescription(nameFile, 30)}</p>
				</div>
				<img
					className={styles.data__arrow}
					src='/images/icons/arrow_for_search.svg'
					alt='arrow'
				/>
			</div>
			{isViewOptions && (
				<div className={styles.block__options}>
					{Object.keys(groupedData).map(group => (
						<div key={group} className={styles.group}>
							<h3 className={styles.groupTitle}>{group}</h3>
							{groupedData[group].map(option => (
								<div
									className={styles.option}
									key={option.file}
									onClick={() => onClick(option)}
								>
									{multi && (
										<input
											type='checkbox'
											checked={checkedState[option.index_number] || false}
											onChange={e => e.preventDefault}
										/>
									)}
									<p>{truncateDescription(option.file, numLength)}</p>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default DataForSearch;
