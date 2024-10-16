import { useNavigate } from 'react-router-dom';

import Button from '../../ui/button/Button';

import styles from './NotFound.module.scss';

const NotFound = () => {
	const nav = useNavigate();
	// const { error } = useSelector(state => state.errorState);
	// const validError = error >= 400 && error < 500;

	const validError = true;

	return (
		<div className={styles.wrapper_notFound}>
			<img
				className={styles.logo}
				src='/images/full_logo.svg'
				alt='full logo'
			/>
			<img
				className={styles.error}
				src={validError ? '/images/errors/404.png' : '/images/errors/502.png'}
				alt={validError ? '404' : '502'}
			/>
			<p className={styles.paragraph}>
				{validError ? 'Страница не найдена' : 'Ошибка сервера'}
			</p>
			<Button onClick={() => nav('/home')}>На главную</Button>
		</div>
	);
};

export default NotFound;
