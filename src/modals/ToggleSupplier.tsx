import { Avatar, Button, Form, Input, message, Modal, Select, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { API, colors } from "../configurations/configurations";
import { LuImagePlus } from "react-icons/lu";
import BigDecimal from "js-big-decimal";
import { uploadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";
import { SupplierModel } from "../models/SupplierModel";
import FormItem from "../components/FormItem";
import { FormModel } from "../models/FormModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew:  () => void;
  supplier?: SupplierModel;
}

const ToggleSupplier = (props: Props) => {
  const { visible, onClose, onAddNew, supplier } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<any>();
  const { Paragraph } = Typography;
  const [formData, setFormData] = useState<FormModel>();
  const [form] = Form.useForm();
  const inpRef = useRef<any>();
  const [isGetting, setIsGetting] = useState(false);

  useEffect(() => {
    getFormData();
  }, []);

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
    }
  }, [supplier]);

  const getFormData = async () => {
    setIsGetting(true);
    try {
      const res = await handleAPI(API.FORM_SUPPLIERS);
      res.data.result && setFormData(res.data.result);
    } catch (error: any) {
      message.error(error.message)
      console.log(error);
    } finally {
      setIsGetting(false);
    }
  };

  const handleSubmitSuppliers = async (values: any) => {
    setIsLoading(true);
    const data: any = {};
    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.price = values.price
      ? new BigDecimal(values.price).getValue()
      : new BigDecimal(0).getValue();
    
    if (file) {
      data.photoUrl = await uploadFile(file);
    } else if (supplier?.photoUrl) {
      data.photoUrl = supplier.photoUrl;
    }
    data.slug = replaceName(values.name);
    data.talking = data.talking ? true : false;
    
    data.categories = [];

    try {
      const res = await handleAPI(
        supplier ? API.UPDATE_SUPPLIER(supplier.id) : API.CREATE_SUPPLIER,
        data,
        supplier ? "put" : "post"
      );
      message.success(res.data.message);
      if (!supplier) {
        onAddNew();
      }
      handleClose();
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFile(undefined);
    onClose();
  };

  return (
    <Modal
      loading={isGetting}
      closable={!isLoading}
      open={props.visible}
      onClose={handleClose}
      onCancel={handleClose}
      title={supplier ? "Update supplier" : "Add supplier"}
      okText={supplier ? "Update" : "Add"}
      cancelText="Discard"
      onOk={() => form.submit()}
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <div className="d-none">
        <input
          type="file"
          onChange={(val: any) => setFile(val.target.files[0])}
          id="inpFile"
          ref={inpRef}
          accept="image/*"
        />
      </div>
      <label htmlFor="inpFile" className="p-2 mb-4 row">
        <div className="text-right col m-0">
          {file ? (
            <Avatar
              size={100}
              src={URL.createObjectURL(file)}
              style={{
                border: "3px solid #E5E5E5",
              }}
            />
          ) : supplier?.photoUrl ? (
            <Avatar
              size={100}
              src={supplier.photoUrl}
              style={{
                border: "3px solid #E5E5E5",
              }}
            />
          ) : (
            <Avatar
              size={100}
              style={{
                backgroundColor: "white",
                border: "2px dashed grey",
              }}
            >
              <LuImagePlus size={50} color={colors.grey600} />
            </Avatar>
          )}
        </div>
        <div className="mt-2 col text-left m-0">
          <Paragraph className="text-muted m-0">Drag image here</Paragraph>
          <Paragraph className="text-muted m-0" style={{ marginBottom: "5px" }}>
            Or
          </Paragraph>
          <Button type="link" onClick={() => inpRef.current.click()}>
            Browne image
          </Button>
        </div>
      </label>

      {formData && (
        <Form
        
          disabled={isLoading}
          onFinish={handleSubmitSuppliers}
          layout={formData.layout}
          form={form}
          labelCol={{ span: formData.labelCol }}
          wrapperCol={{ span: formData.wrapperCol }}
          size="large"
        >
          {formData.formItems.map((item) => (
              <FormItem item={item}/>
            ))}
        </Form>
      )}
    </Modal>
  );
};

export default ToggleSupplier;
