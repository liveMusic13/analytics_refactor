import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { colors } from '../../../../../app.constants';
import { funksCompetitive } from '../../../../../utils/editData';

const BubbleComparison = ({ one, activeSubcategory }) => {
	const { second_graph } = useSelector(state => state.competitiveData);

	// Кэшируем данные из second_graph
	const cashingSecond_graph = useMemo(() => second_graph, [second_graph]);

	// Выбираем объект для отображения в зависимости от значения one
	const selectedGraphData = one
		? cashingSecond_graph[0]
		: cashingSecond_graph[1];

	// Создаем настройки графика
	const options = useMemo(
		() => ({
			accessibility: {
				enabled: false, // Отключаем модуль доступности
			},
			chart: {
				type: 'packedbubble',
			},
			title: {
				text: null,
			},
			tooltip: {
				useHTML: true,
				pointFormat: '<b>{point.name}:</b> {point.value}',
			},
			plotOptions: {
				packedbubble: {
					minSize: '10%',
					maxSize: '80%',
					zMin: 0,
					zMax: 1000,
					layoutAlgorithm: {
						gravitationalConstant: 0.05,
						splitSeries: true,
						seriesInteraction: false,
						dragBetweenSeries: true,
						parentNodeLimit: true,
					},
					dataLabels: {
						enabled: true,
						format: '{point.name}',
						filter: {
							property: 'y',
							operator: '>',
							value: 250,
						},
						style: {
							color: 'black',
							textOutline: 'none',
							fontWeight: 'normal',
						},
					},
				},
			},
			// Используем функцию transformBubbleData для трансформации данных
			series: [
				{
					...funksCompetitive.transformBubbleData(
						{
							SMI: selectedGraphData.SMI,
							Socmedia: selectedGraphData.Socmedia,
							index_name: selectedGraphData.index_name,
						},
						activeSubcategory === 'SMI', // Если 'SMI', то используем данные из SMI
					),
					color: one ? colors.blue_bubble : colors.purple_bubble, // Цвет меняется в зависимости от значения one
				},
			],
		}),
		[selectedGraphData, activeSubcategory, one], // Добавляем необходимые зависимости
	);

	return (
		<HighchartsReact
			highcharts={Highcharts}
			options={options}
			containerProps={{ style: { width: '100%' } }}
		/>
	);
};

export default BubbleComparison;
