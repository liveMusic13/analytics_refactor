import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { funksMedia } from '@/utils/editData';

import { convertFromTimestampToTime } from '../../../../../utils/timestamp';

const BubbleChart = () => {
	const mediaData = useSelector(state => state.mediaData);
	const cashingMediaData = useMemo(() => mediaData, [mediaData]);

	const options = useMemo(
		() => ({
			chart: {
				type: 'bubble',
				plotBorderWidth: 1,
				zoomType: 'xy',
			},
			legend: {
				enabled: false,
			},
			title: {
				text: null,
			},
			subtitle: {
				text: null,
			},
			accessibility: {
				enabled: false, //HELP: Отключаем модуль доступности
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: '%e. %b %Y',
					month: "%e. %b '%Y",
					year: '%Y',
				},
				gridLineWidth: 1,
				title: {
					text: 'Дата',
				},
				accessibility: {
					enabled: false, //HELP: Отключаем модуль доступности
				},
			},
			yAxis: {
				startOnTick: false,
				endOnTick: false,
				title: {
					text: 'Индекс СМИ',
				},
				labels: {
					format: '{value}',
				},
				maxPadding: 0.2,
				accessibility: {
					enabled: false, //HELP: Отключаем модуль доступности
				},
			},
			tooltip: {
				useHTML: true,
				headerFormat: '<table>',
				pointFormatter: function () {
					// const time = convertFromTimestampToRegular(this.x);
					const time = convertFromTimestampToTime(this.x);
					return (
						'<tr><th colspan="2"><h3>' +
						this.source +
						'</h3></th></tr>' +
						'<tr><th>Рейтинг:</th><td>' +
						this.y +
						'</td></tr>' +
						'<tr><th>Время:</th><td>' +
						time +
						'</td></tr>'
					);
				},
				footerFormat: '</table>',
				followPointer: true,
			},
			plotOptions: {
				bubble: {
					minSize: 0.1, // Минимальный размер пузырька
					maxSize: 20,
				},
				series: {
					cursor: 'pointer',
					point: {
						events: {
							click: function () {
								window.open(this.options.url, '_blank');
							},
						},
					},
					dataLabels: {
						enabled: true,
						format: '{point.name}',
					},
				},
			},
			series: [
				{
					data: funksMedia.convertDataForBubbleChart(
						cashingMediaData.second_graph,
					),
					colorByPoint: false,
				},
			],
		}),
		[cashingMediaData],
	);

	return (
		<HighchartsReact
			highcharts={Highcharts}
			options={options}
			containerProps={{ style: { width: '100%', height: '100%' } }}
		/>
	);
};

export default BubbleChart;
