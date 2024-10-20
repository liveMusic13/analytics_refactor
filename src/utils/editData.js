import { getFirstWordAfterUnderscore } from './editText';

export const groupByFirstWord = dataArray => {
	return dataArray.reduce((acc, item) => {
		const firstWord = getFirstWordAfterUnderscore(item.file);
		if (!acc[firstWord]) {
			acc[firstWord] = []; // Если группа еще не существует, создаем
		}
		acc[firstWord].push(item); // Добавляем элемент в соответствующую группу
		return acc;
	}, {});
};

export const convertDataMultiCalendar = (index1, index2, dataArray) => {
	// Находим объекты по значениям index_number

	const obj1 = dataArray.find(item => item.index_number === index1);
	const obj2 = dataArray.find(item => item.index_number === index2);

	// if (!obj1 && obj2) {
	// 	const { min_data: minData2, max_data: maxData2 } = obj2;
	// 	return {
	// 		obj1: {
	// 			min_date: 0,
	// 			max_date: 0,
	// 		},
	// 		obj2: {
	// 			min_date: minData2,
	// 			max_date: maxData2,
	// 		},
	// 	};
	// } else if (obj1 && !obj2) {
	// 	const { min_data: minData1, max_data: maxData1 } = obj1;
	// 	return {
	// 		obj1: {
	// 			min_date: minData1,
	// 			max_date: maxData1,
	// 		},
	// 		obj2: {
	// 			min_date: 0,
	// 			max_date: 0,
	// 		},
	// 	};
	// } else if (obj1 && obj2) {
	// 	const { min_data: minData1, max_data: maxData1 } = obj1;
	// 	const { min_data: minData2, max_data: maxData2 } = obj2;
	// 	return {
	// 		obj1: {
	// 			min_date: minData1,
	// 			max_date: maxData1,
	// 		},
	// 		obj2: {
	// 			min_date: minData2,
	// 			max_date: maxData2,
	// 		},
	// 	};
	// } else {
	// 	return {
	// 		obj1: {
	// 			min_date: 0,
	// 			max_date: 0,
	// 		},
	// 		obj2: {
	// 			min_date: 0,
	// 			max_date: 0,
	// 		},
	// 	};
	// }

	// Проверяем, существуют ли оба объекта
	if (!obj1 || !obj2) {
		return {
			min_data: 0,
			max_data: 0,
		};
	}
	const { min_data: minData1, max_data: maxData1 } = obj1;
	const { min_data: minData2, max_data: maxData2 } = obj2;

	// Находим пересечение временных промежутков
	const overlapStart = Math.max(minData1, minData2);
	const overlapEnd = Math.min(maxData1, maxData2);

	// Проверяем, есть ли пересечение
	if (overlapStart <= overlapEnd) {
		// console.log({
		// 	overlapStart,
		// 	overlapEnd,
		// });
		return {
			min_data: overlapStart,
			max_data: overlapEnd,
		};
	} else {
		return {
			min_data: 0,
			max_data: 0,
		};
	}
};

export const funksTonality = {
	addColor: (arr, color) => {
		const generateShade = (index, total, color) => {
			const intensity = Math.floor((index / total) * 200); // Меньше значение, чтобы начинать с насыщенного цвета
			if (color === 'red') {
				return `rgb(255, ${intensity}, ${intensity})`; // Начинаем с насыщенного красного
			} else if (color === 'green') {
				return `rgb(${intensity}, 255, ${intensity})`; // Начинаем с насыщенного зеленого
			} else {
				return '#000'; // Черный цвет по умолчанию, если цвет не red и не green
			}
		};
		// Добавляем каждому объекту в массиве поле color с соответствующим оттенком
		return arr.map((item, index) => ({
			...item,
			color: generateShade(index, arr.length, color),
		}));
	},
	convertValuesToValue: data => {
		return data.map(({ values, ...rest }) => ({
			...rest,
			value: values,
		}));
	},
	addThreeCircle: (arrNegAuthor, arrPosAuthor, neg, pos) => {
		let objectNeg = {};
		let objectPos = {};

		neg.forEach(elem => {
			if (!objectNeg.hasOwnProperty(elem.name)) {
				objectNeg[elem.name] = []; // замените [] на то, что вы хотите добавить
			}
		});

		pos.forEach(elem => {
			if (!objectPos.hasOwnProperty(elem.name)) {
				objectPos[elem.name] = []; // замените [] на то, что вы хотите добавить
			}
		});

		const flatNegAuthor = arrNegAuthor.flatMap(({ author_data }) =>
			author_data.map(({ url, fullname, count_texts }) => ({
				url,
				name: fullname,
				value: count_texts,
			})),
		);

		const flatPosAuthor = arrPosAuthor.flatMap(({ author_data }) =>
			author_data.map(({ url, fullname, count_texts }) => ({
				url,
				name: fullname,
				value: count_texts,
			})),
		);

		flatNegAuthor.forEach(author => {
			for (let key in objectNeg) {
				if (author.url && author.url.includes(key)) {
					objectNeg[key].push(author);
				}
			}
		});

		flatPosAuthor.forEach(author => {
			for (let key in objectPos) {
				if (author.url && author.url.includes(key)) {
					objectPos[key].push(author);
				}
			}
		});

		return [objectNeg, objectPos];
	},
	transformAuthorsData: data => {
		const { negative, positive, childrenNegative, childrenPositive } = data;

		const positiveColor = '#006400'; // Цвет для позитивных данных
		const negativeColor = '#8B0000'; // Цвет для негативных данных

		const transformedData = [
			{
				id: 'root',
				parent: '',
				name: 'Тональность авторов',
			},
			{
				id: 'negative',
				parent: 'root',
				name: 'Negative',
				color: negativeColor,
			},
			{
				id: 'positive',
				parent: 'root',
				name: 'Positive',
				color: positiveColor,
			},
			...negative.flatMap((item, index) => {
				let childrenObjects = [];

				for (let key in childrenNegative) {
					if (key === item.name) {
						childrenObjects.push(childrenNegative[key]);
					}
				}
				childrenObjects = childrenObjects.flat();

				return [
					{
						id: `negative.${index + 1}`,
						parent: 'negative',
						name: item.name,
						value: item.values,
					},
					...childrenObjects.map(child => ({
						...child,
						parent: `negative.${index + 1}`,
					})),
				];
			}),
			...positive.flatMap((item, index) => {
				let childrenObjects = [];

				for (let key in childrenPositive) {
					if (key === item.name) {
						childrenObjects.push(childrenPositive[key]);
					}
				}
				childrenObjects = childrenObjects.flat();

				return [
					{
						id: `positive.${index + 1}`,
						parent: 'positive',
						name: item.name,
						value: item.values,
					},
					...childrenObjects.map(child => ({
						...child,
						parent: `positive.${index + 1}`,
					})),
				];
			}),
		];

		return transformedData;
	},
};

export const funksInformationGraph = {
	modifyParams: params => {
		const data = {
			index: params.index,
			min_date: params.min_date,
			max_date: params.max_date,
			post: params.post,
			repost: params.repost,
			SMI: params.SMI,
			query_str: params.query_str,
		};

		Object.keys(data).forEach(
			key =>
				(data[key] === false || data[key] === null || data[key] === '') &&
				delete data[key],
		);

		return data;
	},
	convertInformationDataFormat: oldData => {
		const newData = {};

		for (const country in oldData) {
			newData[country] = Object.entries(oldData[country]).map(
				([year, value]) => ({
					year: parseInt(year, 10),
					value: value,
				}),
			);
		}

		return newData;
	},
	generateColorsForObjects: array => {
		const colors = [];
		const hueStep = Math.floor(360 / array.length); // Разделите 360 (полный круг цветов) на количество объектов

		for (let i = 0; i < array.length; i++) {
			const hue = hueStep * i;
			const color = `hsl(${hue}, 100%, 50%)`; // Создайте цвет HSL с насыщенностью 100% и светлотой 50%
			colors.push(color);
		}

		return colors;
	},
};

export const funksMedia = {
	convertDataForSplitBubble: data => {
		let newData = [];

		for (let categor in data) {
			if (data.hasOwnProperty(categor)) {
				let transformedData = data[categor].map(item => {
					return { name: item.name, value: item.index };
				});
				newData.push({ name: categor, data: transformedData });
			}
		}
		console.log(newData);
		return newData;
	},
	convertDataForBubbleChart: data => {
		let newData = [];

		data.forEach(elem => {
			let transformedData = {
				x: elem.time,
				y: elem.index,
				z: 5,
				color: elem.color,
				name: elem.name.slice(0, 2).toUpperCase(),
				source: elem.name,
				url: elem.url,
			};
			newData.push(transformedData);
		});

		return newData;
	},
};

export const funksVoice = {
	getCategoryData: data => {
		const uniqueHubs = [...new Set(data.map(item => item.hub))];

		return uniqueHubs.map(hub => {
			return `${hub} <span class="f16"><span id="flag" class="flag"></span></span>`;
		});
	},
	concatData: data => {
		// Создаем пустой массив для объединенных данных
		let combinedArray = [];
		console.log(data);

		// Перебираем все объекты в массиве data
		for (const obj of data) {
			if (obj.sunkey_data && Array.isArray(obj.sunkey_data)) {
				// Если у объекта есть свойство sunkey_data и оно является массивом,
				// то добавляем его элементы в combinedArray
				combinedArray = combinedArray.concat(obj.sunkey_data);
			}
		}

		return combinedArray;
	},
	getSeriesData: data => {
		// Получаем уникальные значения hub
		const hubs = [...new Set(data.map(item => item.hub))];

		// Создаем пустой объект для хранения данных серии
		const seriesData = {};

		// Перебираем каждый уникальный hub
		hubs.forEach(hub => {
			// Перебираем каждый объект в данных
			data.forEach(item => {
				// Если tonality еще не существует в seriesData, добавляем его
				if (!seriesData[item.tonality]) {
					seriesData[item.tonality] = {
						name: item.tonality,
						data: new Array(hubs.length).fill(0), // Инициализируем массив нулями
					};
				}

				// Если hub текущего объекта совпадает с текущим hub, добавляем count к соответствующему элементу в массиве
				if (item.hub === hub) {
					const index = hubs.indexOf(hub);
					seriesData[item.tonality].data[index] += item.count;
				}
			});
		});

		// Возвращаем данные серии как массив объектов
		return Object.values(seriesData);
	},
	getCategoriesName: data => {
		let nameCategories = [];

		for (const obj of data) {
			nameCategories.push(obj.name);
		}

		return nameCategories;
	},
	convertDataToSankeyFormat: (data, fulldata) => {
		const nodes = [];
		const links = [];

		// Логика для обработки узлов и связей
		fulldata.forEach(item => {
			// Добавляем узел 'name' если он не существует
			if (!nodes.find(node => node.id === item.name)) {
				nodes.push({ id: item.name });
			}

			const typeCounts = {};
			let totalCount = 0;

			// Считаем общую сумму count для узла 'name'
			item.sunkey_data.forEach(dataItem => {
				if (!nodes.find(node => node.id === dataItem.type)) {
					nodes.push({ id: dataItem.type });
				}

				typeCounts[dataItem.type] =
					(typeCounts[dataItem.type] || 0) + dataItem.count;
				totalCount += dataItem.count;
			});

			// Создаем связи от 'name' к 'type' с суммами count
			Object.entries(typeCounts).forEach(([type, count]) => {
				links.push([item.name, type, count]);
			});
		});

		// Обрабатываем дополнительные данные для связей
		data.forEach(item => {
			// Добавляем узлы если они еще не существуют
			if (!nodes.find(node => node.id === item.hub)) {
				nodes.push({ id: item.hub });
			}
			if (!nodes.find(node => node.id === item.tonality)) {
				nodes.push({ id: item.tonality });
			}
			if (!nodes.find(node => node.id === item.type)) {
				nodes.push({ id: item.type });
			}

			// Добавляем связи
			links.push([item.hub, item.tonality, item.count]);
			links.push([item.type, item.hub, item.count]);
		});

		return { nodes, links };
	},
	// generateColorsForObjects: array => {
	// 	const fixedColors = {
	// 		Нейтрал: '#667085',
	// 		Негатив: '#D92D20',
	// 		Позитив: '#039855',
	// 		Пост: '#FD853A',
	// 		Комментарий: '#FEB173',
	// 		name: '#2E90FA', // Специальный цвет для первого узла с именем 'name'
	// 	};

	// 	const colors = [];
	// 	const hueStep = Math.floor(360 / array.length); // Разделите 360 (полный круг цветов) на количество объектов

	// 	for (let i = 0; i < array.length; i++) {
	// 		const nodeName = array[i].id;

	// 		// Если для узла есть фиксированный цвет, используем его
	// 		if (fixedColors[nodeName]) {
	// 			colors.push(fixedColors[nodeName]);
	// 		} else {
	// 			// Если нет, генерируем цвет HSL
	// 			const hue = hueStep * i;
	// 			const color = `hsl(${hue}, 100%, 50%)`;
	// 			colors.push(color);
	// 		}
	// 	}

	// 	return colors;
	// },
	generateColorsForObjects: array => {
		const fixedColors = {
			Нейтрал: '#667085',
			Негатив: '#D92D20',
			Позитив: '#039855',
			Пост: '#FD853A',
			Комментарий: '#FEB173',
		};

		const colors = [];
		let startColor = '#2E90FA'; // Начальный цвет для первого узла, не имеющего фиксированный цвет

		for (let i = 0; i < array.length; i++) {
			const nodeName = array[i].id;

			// Если для узла установлен фиксированный цвет, используем его
			if (fixedColors[nodeName]) {
				colors.push(fixedColors[nodeName]);
			} else if (colors.length === 0) {
				// Если это первый узел без фиксированного цвета, задаем стартовый цвет
				colors.push(startColor);
			} else {
				// Для остальных узлов генерируем случайные цвета, начиная с HSL
				const hueStep = 360 / (array.length - Object.keys(fixedColors).length);
				const hue = hueStep * (colors.length - Object.keys(fixedColors).length);
				const color = `hsl(${hue}, 100%, 50%)`; // Генерация цвета HSL
				colors.push(color);
			}
		}

		return colors;
	},
};

export const funksCompetitive = {
	convertDataForLineDynamic: data => {
		let newData = [];

		data.forEach(elem => {
			let newObj = {};

			newObj.name = elem.index_name;
			newObj.data = [];

			elem.values.forEach(point =>
				newObj.data.push([point.timestamp, point.count]),
			);

			newData.push(newObj);
		});

		return newData;
	},
	transformBubbleData: (inputObject, useSMI) => {
		const { SMI, Socmedia, index_name } = inputObject;
		let result;

		const sourceArray = useSMI ? SMI : Socmedia;

		const transformedData = sourceArray.map(item => ({
			name: item.name,
			value: item.rating,
		}));

		result = {
			name: index_name,
			data: transformedData,
		};

		return result;
	},
	convertDataForBubbleLine: (data, array) => {
		let newData = [];

		data[array].forEach(elem => {
			let transformedData = {
				x: elem.date,
				y: elem.rating,
				z: 20,
				// name: elem.name.slice(0, 2).toUpperCase(),
				source: elem.name,
				url: elem.url,
			};
			newData.push(transformedData);
		});

		return newData;
	},
};
