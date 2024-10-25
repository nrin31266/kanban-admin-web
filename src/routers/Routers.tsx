/** @format */

import { useDispatch, useSelector } from 'react-redux';
import { addAuth, authSelector, refreshAccessToken, refreshInfo, removeAuth } from '../redux/reducers/authReducer';
import AuthRouter from './AuthRouter';
import MainRouter from './MainRouter';
import { useEffect, useState } from 'react';
import { localDataNames, Role } from '../constants/appInfos';
import { Spin } from 'antd';
import { AuthModel } from '../models/AuthenticationModel';
import handleAPI from '../apis/handleAPI';
import { API } from '../configurations/configurations';
import { UserInfoModel } from '../models/UserModel';
import { Login } from 'iconsax-react';

const Routers = () => {
	const [isLoading, setIsLoading] = useState(false);
	const auth: AuthModel = useSelector(authSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setIsLoading(true);
		try {
			const res = localStorage.getItem(localDataNames.authData);
			if (res) {
				const authData: AuthModel = JSON.parse(res);
				if (authData.accessToken) {
					const resUserInfo = await handleAPI(API.USER_INFO);
					const userInfo: UserInfoModel = resUserInfo.data.result;
					authData.userInfo = userInfo;
					dispatch(addAuth(authData));
				}
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setIsLoading(false);
		}
	};
	
	return isLoading ? <Spin /> : !auth.accessToken ? <AuthRouter /> : auth.userInfo.roles.some(item => item.name === Role.ADMIN)? <MainRouter /> : <AuthRouter/>;
};

export default Routers;
