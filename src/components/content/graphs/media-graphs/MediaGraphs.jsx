import { Suspense, useCallback, useState } from 'react';

import Loader from '@/components/loading/loader/Loader';
import PanelTargetGraph from '@/components/ui/panel-target-graph/PanelTargetGraph';

import { useSaveImageGraph } from '@/hooks/useSaveImageGraph';

import styles from './MediaGraphs.module.scss';
import BubbleChart from './bubble-chart/BubbleChart';
import SplitBubble from './split-bubble/SplitBubble';
import { mediaButtons } from '@/data/panel.data';

const MediaGraphs = () => {
	const handleDownloadImage = useSaveImageGraph();
	const [activeButton, setActiveButton] = useState('Рейтинг тональности в СМИ');

	const handleClick = useCallback(button => {
		setActiveButton(button);
	}, []);

	return (
		<div className={styles.block__graph}>
			<div className={styles.block__title}>
				<PanelTargetGraph
					handleClick={handleClick}
					dataButtons={mediaButtons}
					activeButton={activeButton}
				/>
				<div className={styles.block__settings}>
					<button
						className={styles.button__settings}
						onClick={() => handleDownloadImage('graph-for-download')}
					>
						<img src='/images/icons/setting/upload_active.svg' alt='icon' />
					</button>
				</div>
			</div>
			<div className={styles.container__graph} id='graph-for-download'>
				{activeButton === 'Рейтинг тональности в СМИ' ? (
					<Suspense fallback={<Loader />}>
						<SplitBubble />
					</Suspense>
				) : (
					<Suspense fallback={<Loader />}>
						<BubbleChart />
					</Suspense>
				)}
			</div>
		</div>
	);
};

export default MediaGraphs;
