import axios from 'axios';
import Cookies from 'js-cookie';

import { API_URL, TOKEN } from '../app.constants';

export const authService = {
	login: async (email, password, setIsAuth) => {
		try {
			const { data } = await axios.post(
				`${API_URL}/auth/jwt/login`,
				`grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`,
				// {
				// 	username: email,
				// 	password,
				// },
			);

			// console.log(data);

			if (data.access_token) {
				Cookies.set(TOKEN, data.access_token);
				setIsAuth(true);
			}
		} catch (error) {
			console.log(error);
		}
	},
};
