import { useCallback, useEffect, useMemo } from 'react';

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

	// Обновление данных при успешном запросе
	useEffect(() => {
		if (isSuccess && dataUserJson !== newDataJson) {
			console.log('data.values', data);
			addData(data);
		}
	}, [isSuccess, dataUserJson, newDataJson, addData]);

	// Функция для обновления min/max даты
	const updateDates = useCallback(
		targetData => {
			if (targetData && targetData.length > 0) {
				addMinDate(targetData[0].min_data);
				addMaxDate(targetData[0].max_data);
			}
		},
		[addMinDate, addMaxDate],
	);

	// Находим массив, содержащий хотя бы один объект
	const foundArray = Object.values(dataUser).find(
		array =>
			Array.isArray(array) &&
			array.some(item => typeof item === 'object' && item !== null),
	);

	useEffect(() => {
		console.log('dataUser', dataUser, foundArray);
		// if (dataUser.length > 0) {
		if (foundArray) {
			addIndex(foundArray[0].index_number || 0);
			updateDates([foundArray[0]]);
			// addIndex(dataUser[0].index_number || 0);
			// updateDates([dataUser[0]]);
		}
	}, [dataUser]);
};

// export const useAddBaseAndDate = (
// 	dataUser,
// 	data,
// 	isSuccess,
// 	baseData,
// 	addData,
// 	addMinDate,
// 	addMaxDate,
// 	addIndex,
// ) => {
// 	// Мемоизация данных для предотвращения лишних вычислений
// 	const dataUserJson = useMemo(() => JSON.stringify(dataUser), [dataUser]);
// 	const newDataJson = useMemo(() => (data ? JSON.stringify(data) : ''), [data]);

// 	const arrayData =
// 		dataUser && Object.keys(dataUser).length > 0 ? dataUser : {};

// 	// Обновление данных при успешном запросе
// 	useEffect(() => {
// 		if (isSuccess && dataUserJson !== newDataJson) {
// 			addData(data);
// 		}
// 	}, [isSuccess, dataUserJson, newDataJson, addData]);

// 	// Функция для обновления min/max даты
// 	const updateDates = useCallback(
// 		targetData => {
// 			if (targetData && targetData.length > 0) {
// 				addMinDate(targetData[0].min_data);
// 				addMaxDate(targetData[0].max_data);
// 			}
// 		},
// 		[addMinDate, addMaxDate],
// 	);

// 	useEffect(() => {
// 		if (arrayData && Object.keys(arrayData).length > 0) {
// 			let value;
// 			const convertArr = Object.keys(arrayData);

// 			if (Object.keys(arrayData).length > 0) {
// 				const firstEl = convertArr[0];

// 				if (firstEl in dataUser) {
// 					value = dataUser[firstEl];
// 				}
// 			}

// 			addIndex(value[0].index_number);
// 			updateDates([value[0]]);
// 		}
// 	}, [arrayData]);
// };
