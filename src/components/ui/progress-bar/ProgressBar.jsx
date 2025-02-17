import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

import { PROGRESSBAR } from '../../../app.constants';

import styles from './ProgressBar.module.scss';

const ProgressBar = ({ style }) => {
	const { progress_load } = useSelector(state => state.aiData);

	const progressCookies = Cookies.get(PROGRESSBAR);
	const progress = progressCookies || progress_load;

	return (
		<div className={styles.wrapper_progressBar} style={style}>
			<div className={styles.block__progressBar}>
				<div
					className={
						progress === '100'
							? `${styles.progress} ${styles.green}`
							: `${styles.progress}`
					}
					style={{ width: `${progress}%` }}
				></div>
			</div>
			<p
				className={styles.present}
				style={progress === '100' ? { color: '#3DCC6D' } : {}}
			>
				{progress}%
			</p>
		</div>
	);
};

export default ProgressBar;
