import React, { useState } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select, Upload, UploadFile } from "antd";

interface Props {
  visible: boolean;
  onClose: () => void;
  promotion?: any;
}
const AddPromotionModal = (props: Props) => {
  const { onClose, visible, promotion } = props;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const handleClose = () => {
    onClose();
  };
  const handleAddNewPromotion = async (values: any) => {console.log(values);};

  return (
    <Modal
      title={"Add promotion"}
      onClose={handleClose}
      onCancel={handleClose}
      open={visible}
      onOk={() => {
        form.submit();
      }}
    >
      <div className="mb-3">
        <Upload
           listType="picture-card"
           fileList={fileList}
           onChange={(value: any)=> console.log(value)}
        >
          {fileList.length === 0? 'Upload' : null}
        </Upload>
      </div>
      <Form onFinish={handleAddNewPromotion} layout="vertical" form={form}>
        <Form.Item
          name={"name"}
          label={"Promotion name"}
          rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name={"description"}
          label={"Description"}
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} allowClear />
        </Form.Item>
        <div className="row">
        <div className="col">
            <Form.Item
              name={"discountType"}
              label={"Discount type"}
              rules={[{ required: true }]}
              initialValue={"1"}
            >
              <Select
                options={[
                  {
                    label:'PERCENTAGE',
                    value: "0",
                  },
                  {
                    label:'FIXED_AMOUNT',
                    value: "1",
                  },
                ]}
              />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item
              name={"value"}
              label={"Value"}
              rules={[{ required: true }]}
            >
              <InputNumber style={{width: '100%'}} />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Form.Item
              name={"quantity"}
              label={"Quantity"}
              rules={[{ required: true }]}
            >
              <InputNumber  style={{width: '100%'}}/>
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item
              name={"code"}
              label={"CODE"}
              rules={[{ required: true }]}
            >
              <Input allowClear />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col">
          <Form.Item
              name={"start"}
              label={"Date start"}
              rules={[{ required: true }]}
            >
              <DatePicker showTime format={"DD/MM/YYYY HH:mm:ss"} allowClear />
            </Form.Item>
          </div>
          <div className="col">
          <Form.Item
              name={"end"}
              label={"Date end"}
              rules={[{ required: true }]}
            >
              <DatePicker showTime format={"DD/MM/YYYY HH:mm:ss"} allowClear />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPromotionModal;
