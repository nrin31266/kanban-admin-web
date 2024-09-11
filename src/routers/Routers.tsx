/** @format */

import { useDispatch, useSelector } from 'react-redux';
import { addAuth, authSelector, AuthState } from '../redux/reducers/authReducer';
import AuthRouter from './AuthRouter';
import MainRouter from './MainRouter';
import { useEffect, useState } from 'react';
import { localDataNames } from '../constants/appInfos';
import { Spin } from 'antd';
import { getToken } from '../services/localStoreService';

const Routers = () => {
	const [isLoading, setIsLoading] = useState(false);

	const auth: AuthState = useSelector(authSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const res = getToken();
		res && dispatch(addAuth(res));
	};

	return isLoading ? <Spin /> : !auth.token ? <AuthRouter /> : <MainRouter />;
};

export default Routers;