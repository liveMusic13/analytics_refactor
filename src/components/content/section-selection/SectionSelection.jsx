import styles from './SectionSelection.module.scss';
import SectionInfo from './section-info/SectionInfo';
import { menuPageData } from '@/data/menuPage.data';

const SectionSelection = () => {
	return (
		<>
			<img
				className={styles.logo}
				src='/images/full_logo.svg'
				alt='full_logo'
			/>
			{/* <p className={styles.description}>Powered by using machine learning</p> */}
			<p className={styles.description}>
				<span>Аналитика Соцмедиа & СМИ</span>
				<br /> С применением ИИ
			</p>
			<h2 className={styles.title}>Выберите нужный раздел</h2>
			<div className={styles.block__choice}>
				{menuPageData.map(elemInfo => {
					return <SectionInfo key={elemInfo.id} elemInfo={elemInfo} />;
				})}
			</div>
		</>
	);
};

export default SectionSelection;
