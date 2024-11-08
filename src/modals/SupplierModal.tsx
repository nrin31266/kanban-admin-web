import { Form, Input, message, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { changeFileListToUpload, processFileList } from "../utils/uploadFile";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { API } from "../configurations/configurations";
import handleAPI from "../apis/handleAPI";
import { replaceName } from "../utils/replaceName";

interface Props {
  visible: boolean;
  supplier?: any;
  onClose: () => void;
  onSubmit: () => void;
}

const SupplierModal = ({ visible, supplier, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();

  const handleClose = () => {
    form.resetFields();
    onClose();
    setFileList([]);
  };

  const handleSubmit = async (values: any) => {
    if (fileList.length !== 1) {
      message.error("Please add an image of the supplier");
      return;
    }

    values.slug = replaceName(values.name);
    setIsLoading(true);
    const photoUrl = await processFileList(fileList);
    values.photoUrl = photoUrl[0];

    const api = supplier ? `${API.SUPPLIER}/${supplier.id}` : API.SUPPLIER;

    console.log(values);
    try {
      await handleAPI(api, values, supplier ? "put" : "post");
      message.success("Successfully submitted");
      handleClose();
    } catch (error) {
      console.error(error);
      message.error("Failed to submit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeFile = (val: UploadChangeParam<UploadFile<any>>) => {
    const files: UploadFile[] = val.fileList;
    setFileList(changeFileListToUpload(files));
  };

  useEffect(() => {
    form.setFieldsValue(supplier);
    if (supplier) {
      if (supplier.photoUrl) {
        const item = {
          url: supplier.photoUrl,
          status: "done",
          uid: "blabala", // UID should be unique for each file
          name: supplier.name,
        };
        setFileList([item]);
      }
    }
  }, [supplier]);

  return (
    <Modal
      title={(supplier ? "Update" : "Add") + " Supplier"}
      open={visible}
      onOk={() => form.submit()}
      onCancel={handleClose}
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <div className="mb-3">
        <Upload
          listType="picture-circle"
          accept="image/*"
          fileList={fileList}
          onChange={handleChangeFile}
        >
          {fileList.length === 0 && "Upload"}
        </Upload>
      </div>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Supplier Name"
          rules={[
            { required: true, message: "Please input the supplier name!" },
          ]}
        >
          <Input placeholder="Enter supplier name" />
        </Form.Item>

        <Form.Item
          name="contactPerson"
          label="Contact Person"
          rules={[
            { required: true, message: "Please input the contact person!" },
          ]}
        >
          <Input placeholder="Enter contact person name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please input a valid email!" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SupplierModal;
