import styles from './ProgressBar.module.scss';

const ProgressBar = ({ stateLoad }) => {
	return (
		<div className={styles.wrapper_progressBar}>
			<div className={styles.block__progressBar}>
				<div
					className={
						stateLoad === '100'
							? `${styles.progress} ${styles.green}`
							: `${styles.progress}`
					}
					style={{ width: `${stateLoad}%` }}
				></div>
			</div>
			<p
				className={styles.present}
				style={stateLoad === '100' ? { color: '#3DCC6D' } : {}}
			>
				{stateLoad}%
			</p>
		</div>
	);
};

export default ProgressBar;
