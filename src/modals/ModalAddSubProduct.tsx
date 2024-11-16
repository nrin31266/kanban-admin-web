import {
  ColorPicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { ProductResponse, SubProductRequest, SubProductResponse } from "../models/Products";
import { API } from "../configurations/configurations";
import { processFileList, changeFileListToUpload } from "../utils/uploadFile";
import handleAPI from "../apis/handleAPI";
import { colors } from "./../configurations/configurations";

interface Props {
  visible: boolean;
  onClose: () => void;
  product: ProductResponse;
  subProduct?: SubProductResponse;
  onFinish: () => void;
}

const ModalAddSubProduct = ({ visible, onClose, product, subProduct, onFinish }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [color, setColor] = useState<string>();
  const [form] = Form.useForm();
  const [optionsForm] = Form.useForm();

  const presets = [
    {
      label: "Basic Colors",
      colors: [
        "#000000",
        "#ff0000",
        "#ff4500",
        "#ff6347",
        "#ff7f50",
        "#ff1493",
        "#db7093",
        "#c71585",
        "#00ff00",
        "#008000",
        "#006400",
        "#228b22",
        "#32cd32",
        "#7fff00",
        "#adff2f",
        "#0000ff",
        "#000080",
        "#4169e1",
        "#1e90ff",
        "#ffffff",
        "#87cefa",
        "#4682b4",
        "#5f9ea0",
        "#ffff00",
        "#ffd700",
        "#ffa500",
        "#ff8c00",
        "#ffb6c1",
        "#f0e68c",
        "#fafad2",
        "#800080",
        "#8a2be2",
        "#4b0082",
        "#9400d3",
        "#9932cc",
        "#8b008b",
        "#d8bfd8",
        "#00ffff",
        "#00bfff",
        "#add8e6",
        "#b0e0e6",
        "#afeeee",
        "#48d1cc",
        "#20b2aa",
        "#ff00ff",
        "#da70d6",
        "#d3d3d3",
        "#c0c0c0",
        "#f5f5f5",
      ],
    },
  ];

  useEffect(() => {
    if (subProduct) {
      form.setFieldsValue(subProduct);
      optionsForm.setFieldsValue(subProduct.options);
      subProduct.images?.forEach((urlImg, index) =>
        setFileList(prev => [
          ...prev,
          { uid: index, name: `image-${index}`, status: "done", url: urlImg },
        ])
      );
      setColor(subProduct.options?.["Color"]);
    }
  }, [subProduct]);

  const handleClose = () => {
    optionsForm.resetFields();
    form.resetFields();
    setFileList([]);
    setColor(undefined);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const optionsFormValue = await optionsForm.validateFields();
      if (optionsFormValue.Color) optionsFormValue.Color = color;

      const formValues = await form.validateFields();
      const values: SubProductRequest = { ...formValues, options: optionsFormValue };
      values.productId = subProduct?.productId || product.id;

      if (fileList.length > 0) {
        const imagesUrl = await processFileList(fileList);
        if (imagesUrl.length > 0) values.images = imagesUrl;
      }

      const api = subProduct ? `${API.SUB_PRODUCTS}/${subProduct.id}` : API.SUB_PRODUCTS;
      await handleAPI(api, values, subProduct ? "put" : "post");
      message.success(`${subProduct ? "Update" : "Add"} successfully!`);
      onFinish();
      handleClose();
    } catch (error) {
      message.error("Error when adding sub product!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      onOk={handleSubmit}
      okButtonProps={{ loading: isLoading }}
      title={<Typography.Title>{subProduct ? "Update" : "Add"} Sub Product</Typography.Title>}
      open={visible}
      onCancel={handleClose}
      onClose={handleClose}
    >
      <Typography.Title level={4}>Main product: {product.title}</Typography.Title>

      <Form size="large" disabled={isLoading} layout="vertical" form={optionsForm}>
        {product.options?.map((option, index) => (
          <Form.Item
            key={index}
            name={option}
            label={option}
            rules={[{ required: true, message: `${option} is required!` }]}
          >
            {option === "Color" ? (
              <ColorPicker presets={presets} onChange={v => setColor(v.toHexString())} />
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
      </Form>

      <Form layout="vertical" size="large" form={form} disabled={isLoading}>
        <div className="row">
          {["quantity", "price", "discount"].map(field => (
            <div key={field} className="col">
              <Form.Item name={field} label={field} rules={[{  required:  field !== 'discount' ? true : false }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </div>
          ))}
        </div>
      </Form>

      <Upload
        multiple
        fileList={fileList}
        accept="image/*"
        listType="picture-card"
        onChange={newFileList => setFileList(changeFileListToUpload(newFileList.fileList))}
      >
        Upload
      </Upload>
    </Modal>
  );
};

export default ModalAddSubProduct;
