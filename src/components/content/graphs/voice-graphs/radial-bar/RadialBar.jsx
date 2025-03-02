import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { funksVoice } from '@/utils/editData';

import { truncateDescription } from '../../../../../utils/editText';

import styles from './RadialBar.module.scss';
import { colors } from '@/app.constants';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

const RadialBar = () => {
	const { values: voiceData } = useSelector(state => state.voiceData.data);
	const [indexData, setIndexData] = useState(-1); // Индекс для отображения данных конкретного объекта

	const originalColors = useRef({}); // Хранение оригинальных цветов

	const resultData = useMemo(() => {
		// Вычисляем данные только при изменении indexData
		return indexData === -1
			? funksVoice.concatData(voiceData)
			: voiceData[indexData]?.sunkey_data || [];
	}, [indexData, voiceData]);

	const categoryData = useMemo(() => {
		// Генерация категорий для xAxis
		return funksVoice.getCategoryData(resultData);
	}, [resultData]);

	const seriesData = useMemo(() => {
		// Генерация данных для series
		const series = funksVoice.getSeriesData(resultData);

		// Сортировка данных по убыванию
		series.forEach(serie => {
			serie.data.sort((a, b) => b - a);
		});

		// Сохранение оригинальных цветов
		series.forEach((serie, index) => {
			if (!originalColors.current[serie.name]) {
				originalColors.current[serie.name] =
					Highcharts.getOptions().colors[
						index % Highcharts.getOptions().colors.length
					];
			}
			serie.color = originalColors.current[serie.name];
		});

		return series;
	}, [resultData]);

	Highcharts.setOptions({
		colors: [colors.grey_graph, colors.green_graph, colors.red_graph], // Изначально устанавливаем цвета
	});

	const options = useMemo(
		() => ({
			accessibility: {
				enabled: false, // Отключаем модуль доступности
			},
			title: {
				text: null,
			},
			chart: {
				type: 'column',
				inverted: true,
				polar: true,
			},
			tooltip: {
				outside: true,
				formatter: function () {
					return `<b>${this.series.name}</b><br/>${this.x}: ${this.y}`;
				},
			},
			pane: {
				size: '85%',
				innerSize: '5%',
				endAngle: 270,
			},
			xAxis: {
				tickInterval: 1,
				labels: {
					align: 'right',
					useHTML: true,
					allowOverlap: true,
					step: 1,
					y: 3,
					style: {
						fontSize: '0.7rem',
					},
				},
				lineWidth: 0,
				gridLineWidth: 0,
				categories: categoryData, // Подставляем категории
			},
			yAxis: {
				lineWidth: 0,
				tickInterval: 25,
				reversedStacks: false,
				endOnTick: true,
				showLastLabel: true,
				gridLineWidth: 0,
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					borderWidth: 0,
					pointPadding: 0,
					groupPadding: 0.15,
				},
			},
			series: seriesData, // Подставляем данные серий
		}),
		[categoryData, seriesData],
	);

	const handleButtonClick = useCallback(index => {
		// Обработка кликов по кнопкам
		setIndexData(index);
	}, []);

	return (
		<div className={styles.wrapper_graf}>
			<div className={styles.block__categories}>
				<button
					className={indexData === -1 ? styles.name_active : styles.name}
					onClick={() => handleButtonClick(-1)}
				>
					Все
				</button>
				{funksVoice.getCategoriesName(voiceData).map((name, index) => (
					<button
						key={index} //HELP: Лучше использовать индекс массива для ключей в таких случаях
						className={indexData === index ? styles.name_active : styles.name}
						onClick={() => handleButtonClick(index)}
					>
						{truncateDescription(name, 20)}
					</button>
				))}
			</div>
			<HighchartsReact
				highcharts={Highcharts}
				options={options}
				containerProps={{ style: { width: '100%', height: '100%' } }}
			/>
		</div>
	);
};

export default RadialBar;
