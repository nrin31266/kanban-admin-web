import { Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { RatingResponse } from "../models/RatingModel";
import TextArea from "antd/es/input/TextArea";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";

interface Props {
  visible: boolean;
  onFinish: (v: RatingResponse) => void;
  onClose: () => void;
  rating: RatingResponse
}

const ReplyRatingModal = (props: Props) => {
  const { onFinish, visible, onClose, rating } = props;
  const [ isLoading, setIsLoading ] = useState(false);
  const [form] = Form.useForm();


  useEffect(() => {
    if(rating && rating.reply){
        form.setFieldValue("reply", rating.reply);
    }
  }, [rating]);
  const handleSubmit = async (v: any) => {
    console.log(v)
    setIsLoading(true);
    const url = `${API.RATING}/reply/${rating.id}`
    try {
        const res = await handleAPI(url, v, 'put');
        onFinish(res.data.result);
        handleClose();
    } catch (error) {
        console.log(error)
    }finally{
        setIsLoading(false);
    }
    
  };
  const handleClose = ()=>{
    onClose();
    form.resetFields();
  }
  return (
    <Modal loading={isLoading} okButtonProps={{loading: isLoading, disabled: isLoading}} onCancel={handleClose} closable={false} open={visible} onOk={form.submit}>
      <Form onFinish={handleSubmit} layout="vertical" form={form}>
        <Form.Item rules={[{ required: true }]} name={"reply"} label={"Reply"}>
          <TextArea allowClear maxLength={1000} showCount placeholder="thanks..." style={{ height: "20vh" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReplyRatingModal;
