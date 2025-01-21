import { useForm } from 'react-hook-form';

import { useAuth } from './useAuth';
import { authService } from '@/services/auth.service';

export const useAuthPage = () => {
	const { setIsAuth } = useAuth();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
	});

	const onSubmit = async data => {
		console.log(data);
		authService.login(data.email, data.password, setIsAuth);
	};

	const onSubmitRegistr = async data => {
		console.log(data);
		authService.registration(data.email, data.password);
	};

	const validatePasswordRepeat = value => {
		return value === watch('password') || 'Пароли не совпадают';
	};

	return {
		onSubmit,
		register,
		handleSubmit,
		errors,
		validatePasswordRepeat,
		onSubmitRegistr,
	};
};
