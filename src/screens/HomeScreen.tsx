import { Button } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { removeAuth } from '../redux/reducers/authReducer';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const handleLogout = ()=> {
    dispatch(removeAuth(null))
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