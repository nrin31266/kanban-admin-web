import React, { useEffect, useState } from 'react';
import AuthRouter from './AuthRouter';
import MainRouter from './MainRouter';
import { useDispatch, useSelector } from 'react-redux';
import { addAuth, authSelector, AuthState } from '../redux/reducers/authReducer';
import { getToken } from '../services/localStoreService';
import { Spin } from 'antd';

const Routers = () => {
  const [isLoading, setIsLoading] = useState(true); 

  const auth: AuthState = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (token) {
          dispatch(addAuth(JSON.parse(token))); 
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [dispatch]);

  return isLoading ? <Spin /> : !auth.token ? <AuthRouter /> : <MainRouter />;
};

export default Routers;
