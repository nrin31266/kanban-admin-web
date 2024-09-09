import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, SignUp } from "../screens";
import { Typography } from "antd";


const { Title } = Typography;
const AuthRouter = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col text-center d-none d-md-block" style={{
          marginTop: '15%'
        }}>
          <div className="mb-4">
            <img src="https://firebasestorage.googleapis.com/v0/b/kanban-ac9c5.appspot.com/o/kanban-logo.png?alt=media&token=b72b8db5-b31d-4ae9-aab8-8bd7e10e6d8e" 
            alt="" style={{
              width: 256,
              objectFit: 'cover',
              
            }}/>
          </div>
          <Title className="text-primary">KANBAN</Title>
        </div>
        <div className="col content-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
