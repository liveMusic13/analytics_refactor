import { useSelector } from 'react-redux';

import { useActions } from '@/hooks/useActions';

import styles from './Content.module.scss';

const Content = ({ children, graph }) => {
	const { active_menu } = useSelector(store => store.booleanValues);
	const { defaultActiveMenu } = useActions();

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
			{children}
		</div>
	);
};

export default Content;
