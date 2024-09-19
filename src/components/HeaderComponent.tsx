import React, { useState } from "react";
import { Avatar, Button, Input, Space, Dropdown, Menu, Typography, MenuProps } from "antd";
import { MdOutlineManageSearch } from "react-icons/md";
import { TbMessageExclamation } from "react-icons/tb";
import { API, colors } from "../configurations/configurations";
import handleAPI from "../apis/handleAPI";
import { useDispatch } from 'react-redux';
import { removeAuth } from "../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../apis/axiosClient";
const { Title } = Typography;

function HeaderComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const dataToken = getAuth();
      if (dataToken) {
        await handleAPI(API.LOGOUT, dataToken, 'post');
      }
      dispatch(removeAuth({}));
      localStorage.clear();
      navigate('/');
    } catch (error: any) {
      console.log(error);
      dispatch(removeAuth({}));
      localStorage.clear();
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const items: MenuProps['items'] = [
		{
			key: 'logout',
			label: 'Log out',
			onClick: async () => {
				handleLogout();
				dispatch(removeAuth({}));
				localStorage.clear();
				navigate('/');
			},
		},
	];

  return (
    <div className="p-2 ml-1 mr-1 row bg-white">
      <div className="col">
        <Input
          placeholder="Search product, supplier, order"
          style={{
            borderRadius: 90,
            width: "100%",
          }}
          size="large"
          prefix={<MdOutlineManageSearch className="text-muted" size={20} />}
        />
      </div>
      <div className="col text-right">
        <Space>
          <Button
            icon={<TbMessageExclamation size={22} color={colors.grey600} />}
            type="text"
          />
          <Dropdown menu={{items}} trigger={["click"]}>
            <Avatar
              src={
                "https://th.bing.com/th/id/OIP.OMUWV51vu3Q-fXdwcAlw1AHaHa?rs=1&pid=ImgDetMain"
              }
              size={40}
              style={{ cursor: "pointer" }}
            />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
}

export default HeaderComponent;
