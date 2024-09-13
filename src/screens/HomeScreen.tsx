import { Button, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAuth, authSelector, AuthState, refreshtoken, removeAuth } from '../redux/reducers/authReducer';
import handleAPI from '../apis/handleAPI';
import { API } from '../configurations/configurations';
import { useNavigate } from 'react-router-dom';
import { wait } from '@testing-library/user-event/dist/utils';
import { getAuth } from '../apis/axiosClient';
import { localDataNames } from '../constants/appInfos';
import useSelection from 'antd/es/table/hooks/useSelection';


const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const auth: AuthState = useSelector(authSelector);

  useEffect(() => {
    const refreshAuthToken  = async () =>{
      const auth = getAuth();
      if (auth){
        try {
          const res = await handleAPI(API.REFESH_TOKEN, getAuth(), 'post');
          if(res.data.result.token!==auth.token){
            console.log(res.data);
            dispatch(refreshtoken(res.data.result));
          }
        } catch (error:any) {
          dispatch(removeAuth({}));
          console.log(error);
          message.error(error.message);
        }
      }
    }

    refreshAuthToken ();
  }, [dispatch]);

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