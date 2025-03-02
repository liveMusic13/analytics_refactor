import styles from './NoDataRequest.module.scss';

const NoDataRequest = () => {
	return (
		<div className={styles.noData}>
			<img
				src='/images/no_data_in_search.png'
				alt='image'
				className={styles.image}
			/>
			<p className={styles.description}>
				Результатов по запросу не найдено. <br /> Измените запрос и повторите
				поиск
			</p>
		</div>
	);
};

export default NoDataRequest;
