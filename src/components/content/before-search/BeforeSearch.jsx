import { Link } from 'react-router-dom';

import styles from './BeforeSearch.module.scss';

const BeforeSearch = ({ title }) => {
	return (
		<div className={styles.wrapper_before}>
			<div className={styles.block__description}>
				<h2 className={styles.title}>{title}</h2>
				<p className={styles.instruction}>
					Для отображения данных выберите необходимые параметры и нажмите кнопку
					«Запуск»
				</p>
				<Link to='/faq' className={styles.detail}>
					Подробнее о работе со страницей
				</Link>
			</div>
		</div>
	);
};

export default BeforeSearch;
