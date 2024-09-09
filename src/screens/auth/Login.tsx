import { Button, Card, Checkbox, Form, Input, Space, Typography } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import handleAPI from "../../apis/handleAPI";

const { Title, Paragraph, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log(values);
    

  };

  return (
    <>
      <Card
        style={{
        }}
      >
        <div className="text-center">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/kanban-ac9c5.appspot.com/o/kanban-logo.png?alt=media&token=b72b8db5-b31d-4ae9-aab8-8bd7e10e6d8e"
            alt="kanban-logo"
            style={{
              width: "48px",
              height: "48px",
            }}
            className="mb-3"
          />
          <Title level={2}>Login to your account</Title>
          <Paragraph type="secondary">
            Welcome back! Please enter your details.
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          disabled={isLoading}
          size="large"
        >
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
            <Input allowClear maxLength={100} type="email" />
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
            <Input.Password allowClear maxLength={100} type="password" />
          </Form.Item>
        </Form>
        <div className="row">
          <div className="col">
            <Checkbox
              checked={isRemember}
              onChange={(value) => setIsRemember(value.target.checked)}
            >
              Remember for 30 days
            </Checkbox>
          </div>
          <div className="col text-right">
            <Link to={"/"}>Forgot password?</Link>
          </div>
        </div>

        <div className="mt-4 mb-3">
          <Button
            onClick={() => form.submit()}
            type="primary"
            style={{
              width: "100%",
            }}
            size="large"
          >
            Login
          </Button>
        </div>
        <SocialLogin />
        <div className="mt3 text-center">
          <Space>
            <Text type="secondary">Don't have an account</Text>
            <Link to={"/sign-up"}>Sign up</Link>
          </Space>
        </div>
      </Card>
    </>
  );
};

export default Login;