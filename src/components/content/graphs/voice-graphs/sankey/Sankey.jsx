import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsSankey from 'highcharts/modules/sankey';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { funksVoice } from '@/utils/editData';

import { colors as colorsConstant } from '@/app.constants';

HighchartsSankey(Highcharts);

const Sankey = () => {
	const { data: voiceData } = useSelector(state => state.voiceData);
	const cashingVoiceData = useMemo(() => voiceData, [voiceData]);
	const { nodes, links } = funksVoice.convertDataToSankeyFormat(
		funksVoice.concatData(cashingVoiceData),
		cashingVoiceData,
	);

	const colors = funksVoice.generateColorsForObjects(nodes);

	for (let i = 0; i < nodes.length; i++) {
		nodes[i].color = colors[i];
	}

	const options = useMemo(
		() => ({
			title: {
				text: null,
			},
			chart: {
				height: 'calc(900/1440*100vw)',
			},
			accessibility: {
				enabled: false, //HELP: Отключаем модуль доступности
			},
			tooltip: {
				headerFormat: null,
				pointFormat:
					'{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight:.2f} count',
				nodeFormat: '{point.name}: {point.sum:.2f} count',
			},
			series: [
				{
					keys: ['from', 'to', 'weight'],
					nodes: nodes,
					data: links,
					type: 'sankey',
					dataLabels: {
						enabled: true,
						style: {
							color: colorsConstant.color_full_black, // Цвет текста
							textOutline: 'none', // Убираем обводку текста
						},
						backgroundColor: colorsConstant.color_white, // Белый фон для текста
						borderRadius: 3, // Кругление углов фона
						padding: 4, // Внутренний отступ вокруг текста
					},
				},
			],
		}),
		[cashingVoiceData],
	);

	return (
		<HighchartsReact
			highcharts={Highcharts}
			options={options}
			containerProps={{ style: { width: '100%' } }}
		/>
	);
};

export default Sankey;
