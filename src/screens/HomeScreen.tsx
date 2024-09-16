import { Button, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAuth, authSelector, AuthState, refreshToken, removeAuth } from '../redux/reducers/authReducer';
import handleAPI from '../apis/handleAPI';
import { getAuth } from '../apis/axiosClient';
import { API } from '../configurations/configurations';


const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const dataToken = getAuth();
      if (dataToken) {
        await handleAPI(API.LOGOUT, dataToken, 'post');
      }
      dispatch(removeAuth({}));
    } catch (error: any) {
      dispatch(removeAuth({}));
      console.log(error);
      message.error(error.message);
    }finally{
      message.destroy('Signed out successfully!');
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