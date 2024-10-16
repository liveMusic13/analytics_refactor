import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { formatDates } from '@/utils/editText';
import { fromTimestampToNewDateFormat } from '@/utils/timestamp';

import { useActions } from '../../../hooks/useActions';
import { convertDataMultiCalendar } from '../../../utils/editData';

import styles from './CustomCalendar.module.scss';
import BlockCalendar from './block-calendar/BlockCalendar';

// const CustomCalendar = ({ multi }) => {
// 	const [isViewCalendar, setViewCalendar] = useState(false);
// 	const [selectedDatesFrom, setSelectedDatesFrom] = useState([]);
// 	const [selectedDatesTo, setSelectedDatesTo] = useState([]);
// 	const [lastModified, setLastModified] = useState(''); // Хранит последнее измененное состояние
// 	const {
// 		min_date,
// 		max_date,
// 		index: baseData,
// 		themes_ind,
// 	} = useSelector(state => state.dataForRequest);
// 	const { values: dataUser } = useSelector(store => store.dataUsersSlice);

// 	const MultiDate = convertDataMultiCalendar(
// 		themes_ind[0],
// 		themes_ind[1],
// 		dataUser,
// 	);
// 	console.log(MultiDate);

// 	// Функции для обновления массивов и отслеживания последнего изменения
// 	const handleSetSelectedDatesFrom = dates => {
// 		setSelectedDatesFrom(dates);
// 		setLastModified('from');
// 	};

// 	const handleSetSelectedDatesTo = dates => {
// 		setSelectedDatesTo(dates);
// 		setLastModified('to');
// 	};

// 	useEffect(() => {
// 		if (max_date !== null && min_date !== null) {
// 			handleSetSelectedDatesFrom([
// 				fromTimestampToNewDateFormat(min_date),
// 				fromTimestampToNewDateFormat(max_date),
// 			]);
// 		}
// 	}, [baseData, min_date, max_date]);

// 	return (
// 		<div className={styles.wrapper_calendar}>
// 			<div
// 				className={styles.block__data}
// 				onClick={() => setViewCalendar(!isViewCalendar)}
// 			>
// 				<div className={styles.block__description}>
// 					<h2>Период</h2>
// 					<p>
// 						{/* Выбираем, какой массив рендерить, исходя из последнего изменения */}
// 						{lastModified === 'from'
// 							? formatDates(selectedDatesFrom)
// 							: lastModified === 'to'
// 								? formatDates(selectedDatesTo)
// 								: 'no date - no date'}
// 					</p>
// 				</div>
// 				<img
// 					className={styles.data__arrow}
// 					src='/images/icons/arrow_for_search.svg'
// 					alt='arrow'
// 				/>
// 			</div>
// 			{isViewCalendar && (
// 				<BlockCalendar
// 					states={{
// 						selectedDatesFrom,
// 						setSelectedDatesFrom: handleSetSelectedDatesFrom,
// 						selectedDatesTo,
// 						setSelectedDatesTo: handleSetSelectedDatesTo,
// 					}}
// 					setViewCalendar={setViewCalendar}
// 				/>
// 			)}
// 		</div>
// 	);
// };

const CustomCalendar = ({ multi }) => {
	const [isViewCalendar, setViewCalendar] = useState(false);
	const [selectedDatesFrom, setSelectedDatesFrom] = useState([]);
	const [selectedDatesTo, setSelectedDatesTo] = useState([]);
	const [lastModified, setLastModified] = useState(''); // Хранит последнее измененное состояние
	const {
		min_date,
		max_date,
		index: baseData,
		themes_ind,
	} = useSelector(state => state.dataForRequest);
	const { values: dataUser } = useSelector(store => store.dataUsersSlice);
	const { addMinDate, addMaxDate } = useActions();

	const MultiDate = convertDataMultiCalendar(
		themes_ind[0],
		themes_ind[1],
		dataUser,
	);

	// Функции для обновления массивов и отслеживания последнего изменения
	const handleSetSelectedDatesFrom = dates => {
		setSelectedDatesFrom(dates);
		setLastModified('from');
	};

	const handleSetSelectedDatesTo = dates => {
		setSelectedDatesTo(dates);
		setLastModified('to');
	};

	useEffect(() => {
		if (multi) {
			handleSetSelectedDatesFrom([
				fromTimestampToNewDateFormat(MultiDate.min_data),
				fromTimestampToNewDateFormat(MultiDate.max_data),
			]);
			addMinDate(MultiDate.min_data);
			addMaxDate(MultiDate.max_data);
		} else {
			if (max_date !== null && min_date !== null) {
				handleSetSelectedDatesFrom([
					fromTimestampToNewDateFormat(min_date),
					fromTimestampToNewDateFormat(max_date),
				]);
				addMinDate(min_date);
				addMaxDate(max_date);
			}
		}
		// }, [baseData, min_date, max_date, themes_ind]);
	}, [baseData, themes_ind]);

	return (
		<div className={styles.wrapper_calendar}>
			<div
				className={styles.block__data}
				onClick={() => setViewCalendar(!isViewCalendar)}
			>
				<div className={styles.block__description}>
					<h2>Период</h2>
					<p>
						{/* Выбираем, какой массив рендерить, исходя из последнего изменения */}
						{lastModified === 'from'
							? formatDates(selectedDatesFrom)
							: lastModified === 'to'
								? formatDates(selectedDatesTo)
								: 'no date - no date'}
					</p>
				</div>
				<img
					className={styles.data__arrow}
					src='/images/icons/arrow_for_search.svg'
					alt='arrow'
				/>
			</div>
			{isViewCalendar && (
				<BlockCalendar
					states={{
						selectedDatesFrom,
						setSelectedDatesFrom: handleSetSelectedDatesFrom,
						selectedDatesTo,
						setSelectedDatesTo: handleSetSelectedDatesTo,
					}}
					multi={multi}
					setViewCalendar={setViewCalendar}
				/>
			)}
		</div>
	);
};

export default CustomCalendar;
