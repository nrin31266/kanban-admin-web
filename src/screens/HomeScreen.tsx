import { Button, message } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { addAuth, removeAuth } from '../redux/reducers/authReducer';
import handleAPI from '../apis/handleAPI';
import { API } from '../configurations/configurations';
import { getToken } from '../services/localStoreService';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const dataToken = getToken();
      console.log('Token Data:', dataToken); // Kiểm tra giá trị của dataToken
      if (dataToken) { 
        await handleAPI(API.LOGOUT, dataToken, 'post'); 
      }
      dispatch(removeAuth(null))
      message.success('Signed out successfully');
    } catch (error:any) {
      console.log(error);
      message.error(error.message);
    }
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
      >Logout</Button>
    </div>
  )
}

export default HomeScreen