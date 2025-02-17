import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

import './App.css';

const BarInformation = () => {
	const startYear = 1960;
	const endYear = 2022;
	const nbr = 20;

	const [dataset, setDataset] = useState(null);
	const [year, setYear] = useState(startYear);
	const [timer, setTimer] = useState(null);
	const [options, setOptions] = useState({});

	const getData = year => {
		if (!dataset) return [];
		const output = Object.entries(dataset)
			.map(([countryName, countryData]) => [
				countryName,
				Number(countryData[year]),
			])
			.sort((a, b) => b[1] - a[1]);
		return [output[0], output.slice(1, nbr)];
	};

	const getSubtitle = year => {
		const topData = getData(year);
		if (!topData || !topData[0]) return '';
		const population = (topData[0][1] / 1e9).toFixed(2);
		return `<span style="font-size: 80px">${year}</span>
         <br>
         <span style="font-size: 22px">
             Total: <b>${population}</b> billion
         </span>`;
	};

	const updateChart = newYear => {
		const topData = getData(newYear);
		setOptions(prevOptions => ({
			...prevOptions,
			subtitle: {
				text: getSubtitle(newYear),
			},
			series: [
				{
					...prevOptions.series?.[0],
					name: newYear,
					data: topData[1],
				},
			],
		}));
	};

	const handleRangeChange = e => {
		const newYear = parseInt(e.target.value, 10);
		setYear(newYear);
		updateChart(newYear);
	};

	const pause = () => {
		if (timer) {
			clearInterval(timer);
			setTimer(null);
		}
	};

	const play = () => {
		pause();
		const newTimer = setInterval(() => {
			setYear(prevYear => {
				if (prevYear >= endYear) {
					pause();
					return prevYear;
				}
				const nextYear = prevYear + 1;
				updateChart(nextYear);
				return nextYear;
			});
		}, 500);
		setTimer(newTimer);
	};

	const handlePlayPause = () => {
		if (timer) {
			pause();
		} else {
			play();
		}
	};

	useEffect(() => {
		fetch('https://demo-live-data.highcharts.com/population.json')
			.then(response => response.json())
			.then(data => {
				setDataset(data);
				const initialData = getData(startYear);
				setOptions({
					chart: {
						animation: { duration: 500 },
						marginRight: 50,
						type: 'bar',
					},
					title: {
						text: null,
					},
					subtitle: {
						useHTML: true,
						text: getSubtitle(startYear),
						floating: true,
						align: 'right',
						verticalAlign: 'middle',
						y: -80,
						x: -100,
					},
					legend: {
						enabled: false,
					},
					xAxis: {
						type: 'category',
					},
					yAxis: {
						opposite: true,
						tickPixelInterval: 150,
						title: {
							text: null,
						},
					},
					plotOptions: {
						series: {
							animation: false,
							groupPadding: 0,
							pointPadding: 0.1,
							borderWidth: 0,
							colorByPoint: true,
							dataSorting: {
								enabled: true,
								matchByName: true,
							},
							type: 'bar',
							dataLabels: {
								enabled: true,
							},
						},
					},
					series: [
						{
							type: 'bar',
							name: startYear,
							data: initialData[1],
						},
					],
					responsive: {
						rules: [
							{
								condition: {
									maxWidth: 750,
								},
								chartOptions: {
									xAxis: {
										visible: false,
									},
									subtitle: {
										x: 0,
									},
									plotOptions: {
										series: {
											dataLabels: [
												{
													enabled: true,
													y: 8,
												},
												{
													enabled: true,
													format: '{point.name}',
													y: -8,
													style: {
														fontWeight: 'normal',
														opacity: 0.7,
													},
												},
											],
										},
									},
								},
							},
						],
					},
				});
			});

		return () => pause();
	}, []);

	return (
		<figure className='highcharts-figure'>
			<div id='parent-container'>
				<div id='play-controls'>
					<button
						id='play-pause-button'
						onClick={handlePlayPause}
						title={timer ? 'pause' : 'play'}
					>
						{timer ? 'Pause' : 'Play'}
					</button>
					<input
						id='play-range'
						type='range'
						value={year}
						min={startYear}
						max={endYear}
						onChange={handleRangeChange}
					/>
				</div>
				<HighchartsReact
					highcharts={Highcharts}
					options={options}
					containerProps={{ id: 'container' }}
				/>
			</div>
			<p className='highcharts-description'>
				Bar chart showing the world population by countries from 1960 to 2022.
			</p>
		</figure>
	);
};

export default BarInformation;

// Отлично, помогло! Теперь давай приступим к следующему этапу. Сейчас нужно подставить в график мои данные, которые будут браться не из запроса, а из состояния redux toolkit.
// Вот пример данных которые приходят из запроса: {
//   "Afghanistan": {
//     "2017": "35643418",
//     "2018": "36686784",
//     "2019": "37769499",
//     "2020": "38972230",
//     "2021": "40099462",
//     "2022": "41128771",
//     "2023": "..",
//     "Country Code": "AFG",
//     "Indicator Name": "Population, total",
//     "Indicator Code": "SP.POP.TOTL"
//   },
//   "Albania": {
//     "2017": "2873457",
//     "2018": "2866376",
//     "2019": "2854191",
//     "2020": "2837849",
//     "2021": "2811666",
//     "2022": "2777689",
//     "2023": "..",
//     "Country Code": "ALB",
//     "Indicator Name": "Population, total",
//     "Indicator Code": "SP.POP.TOTL"
//   }
// }.
// Вот пример данных, которые есть у меня:
