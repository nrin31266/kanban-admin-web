import React, { useState } from "react";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { URL } from "url";
import { UploadChangeParam } from "antd/es/upload";
import { url } from "inspector";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";
import { isValidTimeRange } from "../utils/dateTime";
import { PromotionRequest, PromotionResponse } from "../models/PromotionModel";
import { changeFileListToUpload, processFileList } from "../utils/uploadFile";
import { ColumnProps } from "antd/es/table";

interface Props {
  visible: boolean;
  onClose: () => void;
  promotion?: any;
}
const PromotionModal = (props: Props) => {
  const { onClose, visible, promotion } = props;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const handleClose = () => {
    onClose();
  };
  const handleAddNewPromotion = async (values: PromotionRequest) => {
    setIsLoading(true);
    if (!isValidTimeRange(new Date(values.start), new Date(values.end))) return;
    const imageUrl: string = (await processFileList(fileList))[0];
    values.imageUrl= imageUrl;
    console.log(values);
    try {
      const res = await handleAPI(API.PROMOTIONS, values, 'post');
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };
  const handleChangeFile = (val: UploadChangeParam<UploadFile<any>>) => {
    const files: UploadFile[] = val.fileList;
    setFileList(changeFileListToUpload(files));
  };

  

  return (
    <Modal
      title={"Add promotion"}
      onClose={handleClose}
      onCancel={handleClose}
      okButtonProps={{
        loading: isLoading,
      }}
      open={visible}
      onOk={() => {
        form.submit();
      }}
    >
      <div className="mb-3">
        <Upload
          accept="image/*"
          listType="picture-card"
          fileList={fileList}
          onChange={handleChangeFile}
        >
          {fileList.length === 0 ? "Upload" : null}
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
              initialValue={false}
            >
              <Select
              allowClear
                options={[
                  {

                    label: "PERCENTAGE",
                    value: "PERCENTAGE",
                  },
                  {
                    label: "FIXED_AMOUNT",
                    value: "FIXED_AMOUNT",
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
              <InputNumber style={{ width: "100%" }} />
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
              <InputNumber style={{ width: "100%" }} />
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

export default PromotionModal;
