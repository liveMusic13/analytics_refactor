export function convertFromTimestampToRegular(timestamp) {
	return new Date(timestamp * 1000);
}

export function convertDateFormat(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
	const day = String(date.getDate()).padStart(2, '0');
	return `${day}/${month}/${year}`; //HELP: Поменял местами день и месяц, т.к. почему-то в месяце отображает день и наоборот
}

export function convertFromRegularToTimestamp(dateTimeString) {
	const date = new Date(dateTimeString);
	return Math.floor(date / 1000);
}

export function fromTimestampToNewDateFormat(timestamp) {
	const date = new Date(timestamp * 1000); // Преобразование в миллисекунды

	// Добавляем метод для получения отформатированной строки
	date.getFormattedString = function () {
		const options = {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'long',
		};
		return this.toLocaleString('en-US', options);
	};

	return date;
}