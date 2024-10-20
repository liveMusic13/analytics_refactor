import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useActions } from '@/hooks/useActions';

import { convertDataMultiCalendar } from '@/utils/editData';
import { formatDates } from '@/utils/editText';
import { fromTimestampToNewDateFormat } from '@/utils/timestamp';

import styles from './CustomCalendar.module.scss';
import BlockCalendar from './block-calendar/BlockCalendar';

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
		const targetBaseData = dataUser.filter(el => el.index_number === baseData);

		if (multi) {
			handleSetSelectedDatesFrom([
				fromTimestampToNewDateFormat(MultiDate.min_data),
				fromTimestampToNewDateFormat(MultiDate.max_data),
			]);
			addMinDate(MultiDate.min_data);
			addMaxDate(MultiDate.max_data);
		} else {
			if (targetBaseData.length > 0) {
				handleSetSelectedDatesFrom([
					fromTimestampToNewDateFormat(targetBaseData[0].min_data),
					fromTimestampToNewDateFormat(targetBaseData[0].max_data),
				]);
				addMinDate(targetBaseData[0].min_data);
				addMaxDate(targetBaseData[0].max_data);
			}
		}
		// }, []);
		// }, [baseData, themes_ind, min_date, max_date]);
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

						{/* {formatDates(selectedDatesFrom)} */}
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
