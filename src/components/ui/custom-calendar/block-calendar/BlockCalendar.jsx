import Button from '@/components/ui/button/Button';

import { colors } from '../../../../app.constants';

import styles from './BlockCalendar.module.scss';
import Calendar from './calendar/Calendar';

const BlockCalendar = ({ states, setViewCalendar }) => {
	const {
		selectedDatesFrom,
		setSelectedDatesFrom,
		selectedDatesTo,
		setSelectedDatesTo,
	} = states;

	const onClick = () => {
		setViewCalendar(false);
	};

	return (
		<div className={styles.block_calendar}>
			<div className={styles.block__calendars}>
				<Calendar
					state={{
						selectedDates: selectedDatesFrom,
						setSelectedDates: setSelectedDatesFrom,
					}}
				/>
				<Calendar
					state={{
						selectedDates: selectedDatesTo,
						setSelectedDates: setSelectedDatesTo,
					}}
				/>
			</div>
			<div className={styles.block__preview}>
				<p className={styles.preview__date}></p>
				<div className={styles.block__buttons}>
					<Button
						style={{
							backgroundColor: colors.color_white,
							color: colors.color_blue,
							width: 'calc(82/1440*100vw)',
							height: 'calc(33/1440*100vw)',
							fontSize: '0.8rem',
						}}
						onClick={onClick}
					>
						Отменить
					</Button>
					<Button
						style={{
							width: 'calc(151/1440*100vw)',
							height: 'calc(40/1440*100vw)',
						}}
						onClick={onClick}
					>
						Применить
					</Button>
				</div>
			</div>
		</div>
	);
};

export default BlockCalendar;
