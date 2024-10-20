import { useSelector } from 'react-redux';

import { useActions } from '../../hooks/useActions';
import BackgroundLoader from '../loading/background-loader/BackgroundLoader';
import PopupNormal from '../popups/popup-normal/PopupNormal';

import styles from './Content.module.scss';

const Content = ({ children, graph }) => {
	const { isPopup, description, link, time } = useSelector(
		state => state.popupNormal,
	);
	const { active_menu } = useSelector(store => store.booleanValues);
	const { default_popupNormal, defaultActiveMenu } = useActions();

	const isDataSetPath = /^\/data-set(\/processed)?\/[^/]+$/.test(
		location.pathname,
	);

	const style = {
		paddingRight: graph ? 'calc(28/1440 * 100vw)' : undefined,
		// justifyContent: isFolder ? 'flex-start' : 'center',
		alignItems: isDataSetPath ? 'flex-start' : 'center',
		// alignItems: isFolder ? 'flex-start' : 'center',
		overflow: isDataSetPath ? 'hidden' : 'visible',
	};

	return (
		<div
			className={styles.wrapper_content}
			style={style}
			onClick={() => {
				if (active_menu) defaultActiveMenu('');
			}}
		>
			{isPopup && (
				<>
					<BackgroundLoader
						onClick={() => (isPopup ? default_popupNormal('') : undefined)}
					/>
					<PopupNormal text={description} url={link} time={time} />
				</>
			)}
			{children}
		</div>
	);
};

export default Content;
