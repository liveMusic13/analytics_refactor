import { useCallback, useEffect, useMemo } from 'react';

import { useActions } from './useActions';

export const useAddBaseAndDate = (
	dataUser,
	data,
	isSuccess,
	baseData,
	addData,
	addMinDate,
	addMaxDate,
	addIndex,
) => {
	// Мемоизация данных для предотвращения лишних вычислений
	const dataUserJson = useMemo(() => JSON.stringify(dataUser), [dataUser]);
	const newDataJson = useMemo(() => (data ? JSON.stringify(data) : ''), [data]);

	const { addThemesInd, addMinRangeDate, addMaxRangeDate } = useActions();

	// Обновление данных при успешном запросе
	useEffect(() => {
		if (isSuccess && dataUserJson !== newDataJson) {
			addData(data);
		}
	}, [isSuccess, dataUserJson, newDataJson, addData]);

	// Функция для обновления min/max даты
	const updateDates = useCallback(
		targetData => {
			if (targetData && targetData.length > 0) {
				console.log('dsdf', targetData);
				addMinDate(targetData[0].min_data);
				addMaxDate(targetData[0].max_data);
				addMinRangeDate(targetData[0].min_data);
				addMaxRangeDate(targetData[0].max_data);
			}
		},
		[addMinDate, addMaxDate, addMinRangeDate, addMaxRangeDate],
	);

	// Находим массив, содержащий хотя бы один объект
	const foundArray = Object.values(dataUser).find(
		array =>
			Array.isArray(array) &&
			array.some(item => typeof item === 'object' && item !== null),
	);

	const foundTwoArray = Object.values(dataUser).find(
		array =>
			Array.isArray(array) &&
			array.filter(item => typeof item === 'object' && item !== null).length >=
				2,
	);

	const findNewDataFolder = Object.values(dataUser)
		.flat()
		.find(el => el.index_number === baseData);

	useEffect(() => {
		// if (dataUser.length > 0) {
		if (foundArray) {
			addIndex(foundArray[0].index_number || 0);
			updateDates([foundArray[0]]);
			if (foundTwoArray && foundTwoArray.length === 2)
				// console.log('foundTwoArray', foundTwoArray);
				addThemesInd([
					foundTwoArray[0].index_number,
					foundTwoArray[1].index_number,
				]);
			// addIndex(dataUser[0].index_number || 0);
			// updateDates([dataUser[0]]);
		}
	}, [dataUser]);

	useEffect(() => {
		//HELP: Для установления новой даты при выборе нового файла для запроса
		if (findNewDataFolder) {
			addMinRangeDate(findNewDataFolder.min_data);
			addMaxRangeDate(findNewDataFolder.max_data);
			addMinDate(findNewDataFolder.min_data);
			addMaxDate(findNewDataFolder.max_data);
			// updateDates(findNewDataFolder);
		}
	}, [baseData]);
};
