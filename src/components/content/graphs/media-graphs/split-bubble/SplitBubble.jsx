import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import packedbubble from 'highcharts/highcharts-more';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { funksMedia } from '../../../../../utils/editData';

// Инициализируйте модуль
if (typeof Highcharts === 'object') {
	packedbubble(Highcharts);
}

const SplitBubble = () => {
	const mediaData = useSelector(state => state.mediaData);
	const cashingMediaData = useMemo(() => mediaData, [mediaData]);

	// Преобразуем данные и добавляем цвета
	const seriesData = useMemo(() => {
		return funksMedia
			.convertDataForSplitBubble(cashingMediaData.first_graph)
			.map((series, index) => {
				// Список цветов, который можно настроить
				const colors = ['#8B0000', '#006400'];
				return {
					...series,
					color: colors[index % colors.length], // Задаем цвет каждой серии
				};
			});
	}, [cashingMediaData]);

	const options = useMemo(
		() => ({
			accessibility: {
				enabled: false,
			},
			chart: {
				type: 'packedbubble',
				height: 'calc(800/1440*100vw)',
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
					maxSize: '50%',
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
			series: seriesData,
		}),
		[cashingMediaData],
	);

	return (
		<>
			<HighchartsReact
				highcharts={Highcharts}
				options={options}
				containerProps={{ style: { width: '100%' } }}
			/>
		</>
	);
};

export default SplitBubble;
