import { convertDateFormat } from './timestamp';

export const truncateDescription = (description, maxLength) => {
	if (description.length <= maxLength) {
		return description;
	}

	return description.slice(0, maxLength) + '...';
};

export function getFirstWordAfterUnderscore(inputString) {
	const underscoreIndex = inputString.indexOf('_');
	if (underscoreIndex !== -1) {
		const firstWord = inputString.substring(0, underscoreIndex);
		return firstWord;
	} else {
		return 'no group'; // Если символ "_" не найден, вернуть null или другое значение по вашему усмотрению
	}
}

export const formatDates = dates => {
	return `${dates[0] !== undefined ? convertDateFormat(dates[0]) : 'no date'} - 
					${dates[1] !== undefined ? convertDateFormat(dates[1]) : 'no date'}`;
};
