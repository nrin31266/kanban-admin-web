import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth } from '../apis/axiosClient';
import handleAPI from '../apis/handleAPI';
import { API } from '../configurations/configurations';
import { refreshToken, removeAuth } from '../redux/reducers/authReducer';


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
    }finally{
      message.success('Signed out successfully!');
      setIsLoading(false);
    }
  };

  const verifyToken = async () => {
    setIsLoading(true);
    try {
      const dataToken = getAuth();
      const res = await handleAPI(API.VERIFY_TOKEN, dataToken, "post");
      console.log(res.data);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefreshToken = async () => {
    setIsLoading(true);
    try {
      const dataToken = getAuth();
      const res = await handleAPI(API.REFRESH_TOKEN, dataToken, "post");
      if (res.data.result.token){
        dispatch(refreshToken(res.data.result.token));
        message.success("Refreshed token!");
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  

  

  return (
    <div>
      <Button
        loading={isLoading}
        onClick={handleLogout}
      >Logout</Button>
      <Button
        loading={isLoading}
        onClick={verifyToken}
      >verify</Button>
      <Button
        loading={isLoading}
        onClick={handleRefreshToken}
      >refreshToken</Button>
    </div>
  )
}

export default HomeScreen