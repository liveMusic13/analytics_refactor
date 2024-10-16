import { useCallback, useEffect, useState } from 'react';

import { competitiveButtons } from '../../../../data/panel.data';
import { useSaveImageGraph } from '../../../../hooks/useSaveImageGraph';
import PanelTargetGraph from '../../../ui/panel-target-graph/PanelTargetGraph';

import styles from './CompetitiveGraphs.module.scss';

const CompetitiveGraphs = () => {
	const [activeButton, setActiveButton] = useState('Динамика сообщений');
	const [activeSubcategory, setActiveSubcategory] = useState('Socmedia');
	const [isViewSource, setIsViewSource] = useState(false);

	const handleDownloadImage = useSaveImageGraph();

	const handleClick = useCallback(button => {
		setActiveButton(button);
	}, []);

	const handleClickSubcategory = useCallback(button => {
		setActiveSubcategory(button);
	}, []);

	useEffect(() => {
		console.log(activeSubcategory);
	}, [activeSubcategory]);

	return (
		<div className={styles.block__graph}>
			<div className={styles.block__title}>
				<PanelTargetGraph
					handleClick={handleClick}
					dataButtons={competitiveButtons}
					activeButton={activeButton}
				/>

				{/* <div className={styles.block__subcategory}>
					<input type='radio'/>
					<button
						className={
							activeSubcategory === 'SMI'
								? styles.activeSubcategory
								: styles.button
						}
						style={
							activeButton === 'Динамика сообщений' ? { display: 'none' } : {}
						}
						onClick={() =>
							activeButton === 'Динамика сообщений'
								? undefined
								: handleClickSubcategory('SMI')
						}
					>
						SMI
					</button>
					<button
						className={
							activeSubcategory === 'Socmedia'
								? styles.activeSubcategory
								: styles.button
						}
						style={
							activeButton === 'Динамика сообщений' ? { display: 'none' } : {}
						}
						onClick={() =>
							activeButton === 'Динамика сообщений'
								? undefined
								: handleClickSubcategory('Socmedia')
						}
					>
						Socmedia
					</button>
				</div> */}

				<div className={styles.block__settings}>
					<button
						className={styles.button__settings}
						onClick={() => handleDownloadImage('graph-for-download')}
					>
						<img src='/images/icons/setting/upload_active.svg' alt='icon' />
					</button>
				</div>
			</div>
			<div className={styles.block__subcategory}>
				<div
					className={styles.block__radio}
					style={
						activeButton === 'Динамика сообщений' ? { display: 'none' } : {}
					}
				>
					<input
						type='radio'
						className={styles.radio}
						name='subcategory' // добавляем одинаковый атрибут name
						checked={activeSubcategory === 'SMI'}
						onChange={() => handleClickSubcategory('SMI')}
					/>
					<p className={styles.text__radio}>СМИ</p>
				</div>
				<div
					className={styles.block__radio}
					style={
						activeButton === 'Динамика сообщений' ? { display: 'none' } : {}
					}
				>
					<input
						type='radio'
						className={styles.radio}
						name='subcategory' // добавляем одинаковый атрибут name
						checked={activeSubcategory === 'Socmedia'}
						onChange={() => handleClickSubcategory('Socmedia')}
					/>
					<p className={styles.text__radio}>Соцмедиа</p>
				</div>
			</div>
			<div className={styles.container__graph} id='graph-for-download'>
				{/* {activeButton === 'dynamic' ? (
					<LineDynamic isViewSource={isViewSource} />
				) : activeButton === 'bubble' ? (
					<>
						<BubbleComparison
							isViewSource={isViewSource}
							one={true}
							activeSubcategory={activeSubcategory}
						/>
						<BubbleComparison
							isViewSource={isViewSource}
							one={false}
							activeSubcategory={activeSubcategory}
						/>
					</>
				) : (
					<>
						<BubbleLineComparison
							isViewSource={isViewSource}
							activeSubcategory={activeSubcategory}
						/>
					</>
				)} */}
			</div>
		</div>
	);
};

export default CompetitiveGraphs;
