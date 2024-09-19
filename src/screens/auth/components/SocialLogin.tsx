import { Button, message } from "antd";
import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../../../firebase/firebaseConfig";
import handleAPI from "../../../apis/handleAPI";
import { addAuth } from "../../../redux/reducers/authReducer";
import { API } from "../../../configurations/configurations";

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.setCustomParameters({
  prompt: 'select_account' 
});

const SocialLogin = () => {
  const [isLoading, setIsLoading] =useState(false);
  const dispatch = useDispatch();
  
  const handleLoginWithGoogle = async() =>{
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if(result){
        const user = result.user;
        console.log(user);
        const idToken = await user.getIdToken(); // Chờ cho Promise hoàn thành
        const data = {
            idToken: idToken,
        };
        const res = await handleAPI(API.LOGIN_WITH_GOOGLE, data, 'post');
        await signOut(auth);
        dispatch(addAuth(res.data.result));
        message.success('Login with google successfully!');
      }else{
        message.error('Can not sign in');
      }
    } catch (error:any) {
      console.log(error);
      message.error(error.message);
    }finally{
      setIsLoading(false);
    }

  }

  return (
    <Button
    loading={isLoading}
    onClick={handleLoginWithGoogle}
    style={{
      width: '100%'
    }}
    size="large"
      icon={
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/color/48/google-logo.png"
          alt="google-logo"
        />
      }
    >Google</Button>
  );
};

export default SocialLogin;
