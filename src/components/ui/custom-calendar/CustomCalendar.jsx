import { useState } from 'react';
import { useSelector } from 'react-redux';

import useClickOutside from '../../../hooks/useClickOutside';

import styles from './CustomCalendar.module.scss';
import BlockCalendar from './block-calendar/BlockCalendar';

const CustomCalendar = ({ multi }) => {
	const [isViewCalendar, setViewCalendar] = useState(false);
	const wrapperRef = useClickOutside(() => setViewCalendar(false));
	const { min_date, max_date } = useSelector(state => state.dataForRequest);

	return (
		<div className={styles.wrapper_calendar} ref={wrapperRef}>
			<div
				className={styles.block__data}
				onClick={() => setViewCalendar(!isViewCalendar)}
			>
				<div className={styles.block__description}>
					<h2>Период</h2>
					{/* <p>Здесь будет отображаться выбранная дата</p> */}
					<p>
						{min_date
							? `${min_date} - ${max_date}`
							: 'Здесь будет отображаться выбранная дата'}
					</p>
				</div>
				<img
					className={styles.data__arrow}
					src='/images/icons/arrow_for_search.svg'
					alt='arrow'
				/>
			</div>
			{isViewCalendar && (
				<BlockCalendar multi={multi} setViewCalendar={setViewCalendar} />
			)}
		</div>
	);
};

export default CustomCalendar;
