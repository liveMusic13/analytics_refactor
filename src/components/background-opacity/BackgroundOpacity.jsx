import styles from './BackgroundOpacity.module.scss';

const BackgroundOpacity = ({ onClick }) => {
	return <div className={styles.background__opacity} onClick={onClick}></div>;
};

export default BackgroundOpacity;
