import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import styles from './Bubbles.module.scss';

const Bubbles = () => {
	const chartRef = useRef(null); // Используем useRef для хранения ссылки на chart
	const informationGraphData = useSelector(state => state.informationGraphData);

	useEffect(() => {
		if (
			!informationGraphData.values ||
			informationGraphData.values.length === 0
		)
			return;

		// Уничтожаем предыдущий график, если он существует
		if (chartRef.current) {
			chartRef.current.dispose();
		}

		const root = am5.Root.new('chartdiv');
		root.setThemes([am5themes_Animated.new(root)]);

		const container = root.container.children.push(
			am5.Container.new(root, {
				width: am5.percent(100),
				height: am5.percent(100),
				layout: root.verticalLayout,
			}),
		);

		const series = container.children.push(
			am5hierarchy.Tree.new(root, {
				singleBranchOnly: false,
				downDepth: 1,
				initialDepth: 5,
				topDepth: 0,
				valueField: 'value',
				categoryField: 'name',
				childDataField: 'children',
				orientation: 'vertical',
			}),
		);

		// Открытие URL при двойном клике
		series.nodes.template.events.on('dblclick', function (ev) {
			const data = ev.target.dataItem.dataContext;
			const url = data.url;
			if (url) {
				window.open(url);
			}
		});

		// Настройка данных
		series.data.setAll([
			{
				name: informationGraphData.values[0].author.fullname,
				url: informationGraphData.values[0].author.url || '',
				value: 0,
				children: informationGraphData.values.map(author => ({
					name: author.author.fullname,
					url: author.author.url || '',
					type: 'values',
					...(author.reposts.length === 0
						? { value: author.author.audienceCount }
						: {
								children: author.reposts.map(repost => ({
									name: repost.fullname,
									value: repost.audienceCount,
									url: repost.url || '',
									type: 'reposts',
								})),
							}),
				})),
			},
		]);

		series.set('selectedDataItem', series.dataItems[0]);

		// Сохраняем ссылку на график
		chartRef.current = root;

		// Очистка при размонтировании компонента
		return () => {
			if (chartRef.current) {
				chartRef.current.dispose();
				chartRef.current = null;
			}
		};
	}, [informationGraphData]); // Обновляем график, если изменяется информация

	return (
		<TransformWrapper>
			<TransformComponent>
				<div id='chartdiv' className={styles.chartdiv}></div>
			</TransformComponent>
		</TransformWrapper>
	);
};

export default Bubbles;
