import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import sunburst from 'highcharts/modules/sunburst';
import { useMemo } from 'react';

import styles from './AuthorsGraph.module.scss';

sunburst(Highcharts);

const AuthorsGraph = ({ cashingData, isViewSource }) => {
	const { negative_hubs: negative, positive_hubs: positive } =
		cashingData.tonality_hubs_values;

	const [childrenNegative, childrenPositive] = useMemo(() => {
		return funksTonality.addThreeCircle(
			cashingData.negative_authors_values,
			cashingData.positive_authors_values,
			negative,
			positive,
		);
	}, [cashingData, negative, positive]);

	const cashingTransformAuthorsData = useMemo(
		() =>
			funksTonality.transformAuthorsData({
				negative,
				positive,
				childrenNegative,
				childrenPositive,
			}),
		[negative, positive, childrenNegative, childrenPositive],
	);

	const text = () => (
		<>
			{cashingData.negative_authors_values.map((author, index) => (
				<p key={`negative-${index}`}>{author.author_data[0].fullname}</p>
			))}
			{cashingData.positive_authors_values.map((author, index) => (
				<p key={`positive-${index}`}>{author.author_data[0].fullname}</p>
			))}
		</>
	);

	const options = useMemo(
		() => ({
			accessibility: {
				enabled: false,
			},
			chart: {
				// height: '46%',
				height: 'calc(800/1440*100vw)',
			},
			colors: ['transparent'].concat(Highcharts.getOptions().colors),
			title: { text: null },
			subtitle: { text: null },
			series: [
				{
					type: 'sunburst',
					data: cashingTransformAuthorsData,
					name: 'Root',
					allowDrillToNode: true,
					borderRadius: 3,
					cursor: 'pointer',
					dataLabels: {
						format: '{point.name}',
						filter: {
							property: 'innerArcLength',
							operator: '>',
							value: 16,
						},
					},
					levels: [
						{
							level: 1,
							levelIsConstant: false,
							dataLabels: {
								filter: {
									property: 'outerArcLength',
									operator: '>',
									value: 64,
								},
							},
						},
						{
							level: 2,
							colorByPoint: true,
						},
						{
							level: 3,
							colorVariation: {
								key: 'brightness',
								to: -0.5,
							},
						},
						{
							level: 4,
							colorVariation: {
								key: 'brightness',
								to: 0.5,
							},
						},
					],
					point: {
						events: {
							mouseOver() {
								const point = this;
								this.graphic.element.addEventListener('dblclick', function () {
									if (point.options && point.options.url) {
										window.open(point.options.url, '_blank');
									}
								});
							},
						},
					},
				},
			],
			tooltip: {
				headerFormat: '',
				pointFormat:
					'Источник - <b>{point.name}</b><br>Количество сообщений - <b>{point.value}</b>',
			},
		}),
		[cashingTransformAuthorsData],
	);

	return (
		<>
			<HighchartsReact
				highcharts={Highcharts}
				options={{
					...options,
					series: [{ ...options.series[0], data: cashingTransformAuthorsData }],
				}}
				containerProps={{
					style: { width: '100%' },
				}}
			/>

			<div
				className={styles.block__sources}
				style={isViewSource ? { display: 'flex' } : { display: 'none' }}
			>
				{text()}
			</div>
		</>
	);
};

export default AuthorsGraph;
