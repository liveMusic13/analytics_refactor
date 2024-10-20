import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Loader from '@/components/loading/loader/Loader';
import PanelTargetGraph from '@/components/ui/panel-target-graph/PanelTargetGraph';

import { useSaveImageGraph } from '@/hooks/useSaveImageGraph';

import { funksTonality } from '@/utils/editData';

import styles from './TonalityGraphs.module.scss';
import AuthorsGraph from './authors-graph/AuthorsGraph';
import Mentions from './mentions/Mentions';
import { tonalityButtons } from '@/data/panel.data';

const TonalityGraphs = () => {
	const tonalityData = useSelector(state => state.tonalityData);
	const cashingData = useMemo(() => tonalityData, [tonalityData]);
	const [data, setData] = useState(
		funksTonality.convertValuesToValue(
			funksTonality.addColor(
				cashingData.tonality_hubs_values.negative_hubs,
				'red',
			),
		),
	);

	const [activeButton, setActiveButton] = useState('Негативные упоминания');
	const [isViewSource, setIsViewSource] = useState(false);
	const [isViewAuthors, setIsViewAuthors] = useState(false);

	const handleClick = useCallback(button => {
		setActiveButton(button);
		if (button === 'Тональность авторов') {
			setIsViewAuthors(true);
		} else {
			setIsViewAuthors(false);
		}
	}, []);

	useEffect(() => {
		if (activeButton === 'Негативные упоминания') {
			setData(
				funksTonality.convertValuesToValue(
					funksTonality.addColor(
						cashingData.tonality_hubs_values.negative_hubs,
						'red',
					),
				),
			);
		} else if (activeButton === 'Позитивные упоминания') {
			setData(
				funksTonality.convertValuesToValue(
					funksTonality.addColor(
						cashingData.tonality_hubs_values.positive_hubs,
						'green',
					),
				),
			);
		}
	}, [activeButton]);

	const handleDownloadImage = useSaveImageGraph();

	const dataCounters = {
		negative: cashingData?.tonality_values?.negative_count,
		positive: cashingData?.tonality_values?.positive_count,
	};

	return (
		<div className={styles.block__graph}>
			<div className={styles.block__title}>
				<PanelTargetGraph
					handleClick={handleClick}
					dataButtons={tonalityButtons}
					activeButton={activeButton}
					dataCounters={dataCounters}
				/>
				<div className={styles.block__settings}>
					<button
						className={styles.button__description}
						onClick={() => setIsViewSource(!isViewSource)}
					>
						{isViewSource ? 'Скрыть' : 'Показать'} пояснения к графику
					</button>
					<button
						className={styles.button__settings}
						onClick={() => handleDownloadImage('graph-for-download')}
					>
						<img src='/images/icons/setting/upload_active.svg' alt='icon' />
					</button>
				</div>
			</div>
			<div className={styles.container__graph} id='graph-for-download'>
				{isViewAuthors ? (
					<Suspense fallback={<Loader />}>
						<AuthorsGraph
							cashingData={cashingData}
							isViewSource={isViewSource}
						/>
					</Suspense>
				) : (
					<Suspense fallback={<Loader />}>
						<Mentions
							isViewSource={isViewSource}
							data={data}
							setData={setData}
						/>
					</Suspense>
				)}
			</div>
		</div>
	);
};

export default TonalityGraphs;
