import { Button, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addAuth, removeAuth } from '../redux/reducers/authReducer';
import handleAPI from '../apis/handleAPI';
import { getToken, removeToken, setToken } from '../services/localStoreService';
import { API } from '../configurations/configurations';
import { useNavigate } from 'react-router-dom';
import { wait } from '@testing-library/user-event/dist/utils';


const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const dataToken = getToken();
      if (dataToken) {
        await handleAPI(API.LOGOUT, dataToken, 'post');
      }
      dispatch(removeAuth({}));
      
    } catch (error: any) {
      dispatch(removeAuth({}));
      console.log(error);
      message.error(error.message);
    }finally{
      message.success('Signed out successfully');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        loading={isLoading}
        onClick={handleLogout}
      >Logout</Button>
    </div>
  )
}

export default HomeScreen