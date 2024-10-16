import Auth from '@/components/screens/auth/Auth';
import Faq from '@/components/screens/faq/Faq';
import Home from '@/components/screens/home/Home';
import Information from '@/components/screens/information/Information';
import MediaRating from '@/components/screens/media-rating/MediaRating';
import UserTonality from '@/components/screens/user-tonality/UserTonality';

import Competitive from '../components/screens/competitive/Competitive';
import VoiceOfCustomer from '../components/screens/voice-of-customer/VoiceOfCustomer';

export const routes = [
	{
		path: '/',
		component: Auth,
		isAuth: false,
	},
	{
		path: '/home',
		component: Home,
		isAuth: true,
	},
	{
		path: '/user-tonality',
		component: UserTonality,
		isAuth: true,
	},
	{
		path: '/information-graf',
		component: Information,
		isAuth: true,
	},
	{
		path: '/media-rating',
		component: MediaRating,
		isAuth: true,
	},
	{
		path: '/voice-of-customer',
		component: VoiceOfCustomer,
		isAuth: true,
	},
	{
		path: '/competitive',
		component: Competitive,
		isAuth: true,
	},
	{
		path: '/faq',
		component: Faq,
		isAuth: true,
	},
];
