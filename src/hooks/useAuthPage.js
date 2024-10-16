import { useForm } from 'react-hook-form';
import { authService } from '../services/auth.service';
import { useAuth } from './useAuth';

export const useAuthPage = () => {
	const { setIsAuth } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
	});

	const onSubmit = async data => {
		console.log(data);
		authService.login(data.email, data.password, setIsAuth);
	};

	return {
		onSubmit,
		register,
		handleSubmit,
		errors,
	};
};
