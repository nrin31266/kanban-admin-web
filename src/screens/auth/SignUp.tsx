import { Button, Card, Checkbox, Form, Input, message, Space, Typography } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import handleAPI from "../../apis/handleAPI";
import { useDispatch } from "react-redux";
import { API, appInfos } from "../../configurations/configurations";
const { Title, Paragraph, Text } = Typography;

const SignUp = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const apiSignUp ='/kanban/users/create';
  const apiSignIn ='/kanban/auth/login';
  const dispatch = useDispatch();

  const handleSignUp = async (values: {name:string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await handleAPI(API.SIGNUP, values, 'post');
      message.success('Register successfully!');
      navigate('/');

    } catch (error: any) {
      console.log(error);
      message.error(error.message)
    }
    setIsLoading(false);
  };

  return (
    <>
      <Card style={{
        width: '380px'
      }}>
        <div className="text-center">
        <img
            src={appInfos.logo}
            alt="kanban-logo"
            style={{
              width: "48px",
              height: "48px",
            }}
            className="mb-3"
          />
          <Title level={2}>Create an account</Title>
          <Paragraph type="secondary">
            Start your-30 days trial
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSignUp}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name={"name"}
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter name!",
              },
            ]}
          >
            <Input allowClear maxLength={255} type="text" placeholder="Enter your name"/>
          </Form.Item>
          <Form.Item
            name={"email"}
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter email!",
              },
            ]}
          >
            <Input allowClear maxLength={100} type="email" placeholder="Enter your email"/>
          </Form.Item>
          <Form.Item
            name={"password"}
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter password!",
              },
            ]}
          >
            <Input.Password allowClear maxLength={100} type="password" placeholder="Enter your password"/>
          </Form.Item>
        </Form>
      

        <div className="mt-5 mb-3">
          <Button
            loading={isLoading}
            onClick={() => form.submit()}
            type="primary"
            style={{
              width: "100%",
            }}
            size="large"
          >
            Get started
          </Button>
        </div>
        <SocialLogin />
        <div className="mt3 text-center">
            <Space>
              <Text type="secondary">Already an account?</Text>
              <Link to={'/'}>Login</Link>
            </Space>
        </div>
      </Card>
    </>
  );
}

export default SignUp