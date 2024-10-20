import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Content from '@/components/content/Content';
import SectionSelection from '@/components/content/section-selection/SectionSelection';
import Layout from '@/components/layout/Layout';
import LeftMenu from '@/components/ui/left-menu/LeftMenu';
import LeftMenuActive from '@/components/ui/left-menu/left-menu-active/LeftMenuActive';

import { useAuth } from '@/hooks/useAuth';

import { useActions } from '../../../hooks/useActions';

import { useGetDataUsersQuery } from '@/services/other.service';

const Home = () => {
	const navigate = useNavigate();
	const { addData, addIndex } = useActions();
	const { active_menu } = useSelector(store => store.booleanValues);
	const { values: dataUser } = useSelector(store => store.dataUsersSlice);
	const { isAuth } = useAuth();
	console.log('isAuth', isAuth);

	if (!isAuth) navigate('/');

	const { data, isError, error, isLoading, isSuccess } = useGetDataUsersQuery();

	useEffect(() => {
		if (isSuccess && data) {
			const dataUserJson = JSON.stringify(dataUser);
			const newDataJson = JSON.stringify(data.values);

			if (dataUserJson !== newDataJson) {
				addData(data.values);
			}
		}
	}, [isSuccess, data]);

	return (
		<Layout>
			{active_menu ? <LeftMenuActive /> : <LeftMenu />}
			<Content>
				{isError && <p>Вы не авторизованы</p>}
				<SectionSelection />
			</Content>
		</Layout>
	);
};

export default Home;
