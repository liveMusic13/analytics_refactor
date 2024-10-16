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
	const newDataJson = useMemo(
		() => (data ? JSON.stringify(data.values) : ''),
		[data],
	);

	// Обновление данных при успешном запросе
	useEffect(() => {
		if (isSuccess && dataUserJson !== newDataJson) {
			addData(data.values);
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

	// Обновление индекса и дат
	useEffect(() => {
		if (baseData !== null) {
			const targetBaseData = dataUser.filter(
				el => el.index_number === baseData,
			);
			updateDates(targetBaseData);
		} else if (dataUser.length > 0) {
			addIndex(dataUser[0].index_number);
			updateDates([dataUser[0]]);
		}
	}, [dataUser, baseData, addIndex, updateDates]);
};
