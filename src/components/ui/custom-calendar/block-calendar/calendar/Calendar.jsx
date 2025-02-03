import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useActions } from '../../../../../hooks/useActions';
import { useInitData } from '../../../../../hooks/useInitData';
import { fromTimestampToNewDateFormat } from '../../../../../utils/timestamp';

import styles from './Calendar.module.scss';
import { monthNames, weekNames } from '@/data/calendar.data';

const Calendar = ({ start }) => {
	useInitData();
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [daysInMonth, setDaysInMonth] = useState([]);
	const { addMinDate, addMaxDate } = useActions();
	const { min_date, max_date } = useSelector(state => state.dataForRequest);

	useEffect(() => {
		const date = new Date(currentYear, currentMonth, 1);
		const days = [];
		while (date.getMonth() === currentMonth) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		setDaysInMonth(days);
	}, [currentMonth, currentYear]);

	const handleDayClick = day => {
		// dispatch(setDate(day));
		if (start) {
			addMinDate(day);
		} else {
			addMaxDate(day);
		}
	};
	const nextMonth = () => {
		setCurrentMonth(prev => (prev + 1) % 12);
		if (currentMonth === 11) setCurrentYear(prev => prev + 1);
	};
	const prevMonth = () => {
		setCurrentMonth(prev => (prev - 1 + 12) % 12);
		if (currentMonth === 0) setCurrentYear(prev => prev - 1);
	};
	const nextYear = () => {
		setCurrentYear(prev => prev + 1);
	};
	const prevYear = () => {
		setCurrentYear(prev => prev - 1);
	};

	const minDateOut = useMemo(() => fromTimestampToNewDateFormat(min_date), []);
	const maxDateOut = useMemo(() => fromTimestampToNewDateFormat(max_date), []);

	const isOutOfRangeFunc = (date, startDate, endDate) => {
		if (startDate && endDate) {
			return date < new Date(startDate) || date > new Date(endDate);
		}
		return false;
	};

	return (
		<div className={styles.calendar}>
			<div className={styles['calendar-header']}>
				<div className={styles['calendar-header__month']}>
					<span>{monthNames[currentMonth]}</span>
					<div className={styles['calendar-header__block-buttons']}>
						<button onClick={nextMonth}></button>
						<button onClick={prevMonth}></button>
					</div>
				</div>
				<div className={styles['calendar-header__year']}>
					<span>{currentYear}</span>
					<div className={styles['calendar-header__block-buttons']}>
						<button onClick={nextYear}></button>
						<button onClick={prevYear}></button>
					</div>
				</div>
			</div>
			<div className={styles['calendar-body']}>
				<div className={styles['calendar-weeks']}>
					{weekNames.map(day => (
						<div key={day} className={styles['calendar-weeks-day']}>
							{day}
						</div>
					))}
				</div>
				<div className={styles['calendar-grid']}>
					{daysInMonth.map((day, index) => {
						const isSelected =
							day >= new Date(minDateOut) && day <= new Date(maxDateOut);
						const isOutOfRange = isOutOfRangeFunc(day, minDateOut, maxDateOut);
						return (
							<div
								key={index}
								className={`${styles['calendar-day']} ${isSelected ? styles['selected-day'] : ''} ${isOutOfRange ? styles['out-of-range'] : ''}`}
								onClick={() => !isOutOfRange && handleDayClick(day)}
							>
								{day.getDate()}
							</div>
						);
					})}

					{/* <div
								key={index}
								className={`${styles['calendar-day']} ${isSelected ? styles['selected-day'] : ''} `}
								onClick={()=> {}}
							>
								{day}
							</div> */}
				</div>
			</div>
		</div>
	);
};

export default Calendar;
