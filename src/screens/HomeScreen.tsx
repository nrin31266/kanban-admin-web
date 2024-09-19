import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, getRefreshToken, verifyToken } from '../apis/axiosClient';
import handleAPI from '../apis/handleAPI';
import { API } from '../configurations/configurations';
import { refreshToken, removeAuth } from '../redux/reducers/authReducer';
import { demoData } from '../data/demoData';
import { replaceName } from '../utils/replaceName';
import { useNavigate } from 'react-router-dom';


const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    
  }, []);

  const handleVerifyToken =async ()=>{
    setIsLoading(true);
    try {
      await verifyToken();
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

const handleRefreshToken =async ()=>{
    setIsLoading(true);
    try {
      const res:any = await getRefreshToken();
      if(res){
        if(res !== true){
          dispatch(refreshToken(res));
        }
      }else{
        dispatch(removeAuth({}))
        localStorage.clear();
        navigate('/');
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally{
      setIsLoading(false);
    }
  };


  return (
    <div>
      <Button
        loading={isLoading}
        onClick={handleVerifyToken}
      >verify</Button>
      <Button
        loading={isLoading}
        onClick={handleRefreshToken}
      >refreshToken</Button>
    </div>
  )
}

export default HomeScreen