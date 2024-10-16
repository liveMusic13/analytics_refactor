import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/button/Button';
import InputAuth from '@/components/ui/fields/input-auth/InputAuth';

import { useAuth } from '@/hooks/useAuth';
import { useAuthPage } from '@/hooks/useAuthPage';

import { colors } from '../../../app.constants';

import styles from './Auth.module.scss';

const Auth = () => {
	const { onSubmit, register, handleSubmit, errors } = useAuthPage();
	const { isAuth } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuth) navigate('/home');
	}, [isAuth]);

	const emailError = errors.email?.message;
	const errorPassword = errors.password;

	return (
		<Layout>
			<div className={styles.block__auth}>
				<img
					className={styles.logo__image}
					src='/images/full_logo.svg'
					alt='logo'
				/>
				<h2 className={styles.title}>Авторизация</h2>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					{/* <form className={styles.form}> */}
					<div className={styles.block__field}>
						<InputAuth
							type='text'
							placeholder='Введите e-mail'
							register={register}
							id='email'
							label='E-mail'
							styleInput={emailError ? { borderColor: colors.color_red } : {}}
						/>
						{emailError && <span>{errors.email?.message}</span>}
					</div>
					<div className={styles.block__field}>
						<InputAuth
							label='Пароль'
							id='password'
							type='password'
							placeholder='Введите пароль'
							register={register}
							styleInput={
								errorPassword ? { borderColor: colors.color_red } : {}
							}
						/>
						{errorPassword && (
							<span>
								Неверный пароль. Повторите попытку ввода или обратитесь к
								администратору
							</span>
						)}
					</div>

					<Button>Войти</Button>
				</form>
			</div>
		</Layout>
	);
};

export default Auth;
