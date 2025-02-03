import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useActions } from '@/hooks/useActions';
import { useCalendarDate } from '@/hooks/useCalendarDate';

import { isInRange, isOutOfRange } from '@/utils/customCalendar';
import {
	convertFromRegularToTimestamp,
	fromTimestampToNewDateFormat,
} from '@/utils/timestamp';

import styles from './Calendar.module.scss';
import { monthNames, weekNames } from '@/data/calendar.data';

const Calendar = ({ state }) => {
	const {
		min_date,
		max_date,
		themes_ind,
		index: baseDate,
	} = useSelector(state => state.dataForRequest);
	const { addMinDate, addMaxDate } = useActions();

	const minDateOut = useMemo(() => fromTimestampToNewDateFormat(min_date), []);
	const maxDateOut = useMemo(() => fromTimestampToNewDateFormat(max_date), []);
	const minDate = useMemo(
		() => fromTimestampToNewDateFormat(min_date),
		[min_date],
	);
	const maxDate = useMemo(
		() => fromTimestampToNewDateFormat(max_date),
		[max_date],
	);
	const {
		currentDate,
		prevMonth,
		nextMonth,
		prevYear,
		nextYear,
		daysInMonth,
		setCurrentDate,
	} = useCalendarDate(minDate);

	// Состояние для выбранных дат
	const { selectedDates, setSelectedDates } = state;

	// Получаем день недели первого числа месяца (0 - воскресенье, 1 - понедельник и т.д.)
	const firstDayOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		1,
	).getDay();
	// Если неделя начинается с понедельника, сдвигаем первый день
	const firstDayShifted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
	// Генерация массива дней для текущего месяца
	const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
	// Добавляем пустые ячейки для выравнивания с днями недели
	const calendarDays = useMemo(
		() => [...Array(firstDayShifted).fill(null), ...days],
		[daysInMonth, firstDayShifted],
	);
	// Обработка кликов по дням
	const handleDateClick = day => {
		const clickedDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			day,
		);
		let newSelectedDates = selectedDates.map(date => {
			return date instanceof Date ? date : new Date(date);
		});
		if (newSelectedDates.length === 2) {
			newSelectedDates = [clickedDate];
		} else {
			newSelectedDates.push(clickedDate);
		}
		newSelectedDates.sort((a, b) => a - b);
		setSelectedDates(newSelectedDates);
		if (newSelectedDates.length === 1) {
			addMinDate(convertFromRegularToTimestamp(newSelectedDates[0]));
		} else if (newSelectedDates.length === 2) {
			addMaxDate(convertFromRegularToTimestamp(newSelectedDates[1]));
		}
		console.log(newSelectedDates);
	};

	return (
		<div className={styles.calendar}>
			<div className={styles['calendar-header']}>
				<div className={styles['calendar-header__month']}>
					<span>{monthNames[currentDate.getMonth()]}</span>
					<div className={styles['calendar-header__block-buttons']}>
						<button onClick={nextMonth}></button>
						<button onClick={prevMonth}></button>
					</div>
				</div>
				<div className={styles['calendar-header__year']}>
					<span>{currentDate.getFullYear()}</span>
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
					{calendarDays.map((day, index) => {
						// Проверка, если день не входит в диапазон
						if (day === null) {
							return <div key={index} className={styles['calendar-empty']} />;
						}
						const outOfRange = isOutOfRange(
							day,
							currentDate.getMonth(),
							currentDate.getFullYear(),
							minDateOut,
							maxDateOut,
							// selectedDates[0],
							// selectedDates[1],
						);
						// console.log('selectedDates^ ', selectedDates);
						const isSelected = selectedDates.some(
							date =>
								date.getDate() === day &&
								date.getMonth() === currentDate.getMonth() &&
								date.getFullYear() === currentDate.getFullYear(),
						);
						// const isSelected = [minDate, maxDate].some(
						// 	date =>
						// 		date.getDate() === day &&
						// 		date.getMonth() === currentDate.getMonth() &&
						// 		date.getFullYear() === currentDate.getFullYear(),
						// );
						const isIntermediate = isInRange(
							day,
							currentDate.getMonth(),
							currentDate.getFullYear(),
							selectedDates,
						);

						return (
							<div
								key={index}
								className={`${styles['calendar-day']} ${outOfRange ? styles['calendar-out-of-range'] : ''} ${isIntermediate ? styles['intermediate-day'] : ''} ${isSelected ? styles['selected-day'] : ''} `}
								onClick={() => !outOfRange && handleDateClick(day)}
							>
								{day}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Calendar;
