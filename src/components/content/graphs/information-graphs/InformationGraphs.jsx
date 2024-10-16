import { Suspense, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { informationButtons } from '../../../../data/panel.data';
import { useSaveImageGraph } from '../../../../hooks/useSaveImageGraph';
import Loader from '../../../loading/loader/Loader';
import PanelTargetGraph from '../../../ui/panel-target-graph/PanelTargetGraph';

import styles from './InformationGraphs.module.scss';
import BarInformation from './bar-information/BarInformation';
import Bubbles from './bubbles/Bubbles';
import ScatterChart from './scatter-chart/ScatterChart';

const InformationGraphs = () => {
	const { pathname } = useLocation();
	const [isViewSource, setIsViewSource] = useState(true);
	const [activeButton, setActiveButton] = useState(
		'Граф распространения информации',
	);

	const handleDownloadImage = useSaveImageGraph();

	const handleClick = useCallback(
		but => {
			setActiveButton(but);
		},
		[activeButton],
	);

	return (
		<div className={styles.block__graph}>
			<div className={styles.block__title}>
				<PanelTargetGraph
					handleClick={handleClick}
					dataButtons={informationButtons}
					activeButton={activeButton}
				/>
				<div className={styles.block__settings}>
					{pathname !== '/information-graf' && (
						<button
							className={styles.button__description}
							onClick={() => setIsViewSource(!isViewSource)}
						>
							{isViewSource ? 'Скрыть' : 'Показать'} пояснения к графику
						</button>
					)}
					<button
						className={styles.button__settings}
						onClick={() => handleDownloadImage('graph-for-download')}
					>
						<img src='/images/icons/setting/upload_active.svg' alt='icon' />
					</button>
				</div>
			</div>
			<div className={styles.container__graph} id='graph-for-download'>
				{activeButton === 'Граф распространения информации' ? (
					<Suspense fallback={<Loader />}>
						<Bubbles />
					</Suspense>
				) : activeButton === 'Динамика распространения' ? (
					<Suspense fallback={<Loader />}>
						<BarInformation />
					</Suspense>
				) : (
					<Suspense fallback={<Loader />}>
						<ScatterChart />
					</Suspense>
				)}
			</div>
		</div>
	);
};

export default InformationGraphs;
