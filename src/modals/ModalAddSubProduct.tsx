import {
  ColorPicker,
  theme,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Typography,
  Upload,
  UploadProps,
  ColorPickerProps,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  ProductResponse,
  SubProductRequest,
  SubProductResponse,
} from "../models/Products";
import { API } from "../configurations/configurations";
import {
  changeFileListToUpload,
  processFileList,
  uploadFiles,
} from "../utils/uploadFile";
import { generate, green, presetPalettes, red } from "@ant-design/colors";
import handleAPI from "../apis/handleAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
  product: ProductResponse;
  subProduct?: SubProductResponse;
  onFinish: () => void;
}

const ModalAddSubProduct = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { visible, onClose, product, subProduct, onFinish } = props;
  const [form] = Form.useForm();
  const [optionsForm] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
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
      console.log(subProduct);
      form.setFieldsValue(subProduct);
      if (subProduct.images && subProduct.images.length > 0) {
        const imgs: any = [];
        subProduct.images.forEach((urlImg, index) => {
          imgs.push({
            uid: index,
            name: `image-${index}`,
            status: "done",
            url: urlImg,
          });
        });
        setFileList((prev) => [...prev, ...imgs]);
      }
      optionsForm.setFieldsValue(subProduct.options);
    }
  }, [subProduct]);

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    onClose();
    optionsForm.resetFields();
  };

  const handleSubmit = async () => {
    optionsForm
      .validateFields()
      .then((optionsFormValue) => {
        if (optionsFormValue.Color) {
          optionsFormValue.Color = optionsFormValue.Color.toHexString();
        }
        form
          .validateFields()
          .then(async (formValues) => {
            const values: SubProductRequest = {
              ...formValues,
              options: optionsFormValue,
            };
            console.log(values);
            setIsLoading(true);
            if (subProduct) values.productId = subProduct.productId;
            else values.productId = product.id;

            if (fileList && fileList.length > 0) {
              const imagesUrl = await processFileList(fileList);
              if (imagesUrl.length > 0) values.images = imagesUrl;
            }

            const api = subProduct
              ? `${API.SUB_PRODUCTS}/${subProduct.id}`
              : `${API.SUB_PRODUCTS}`;

            try {
              await handleAPI(api, values, subProduct ? "put" : "post");
              message.success(
                (subProduct ? "Update" : "Add") + " successfully!"
              );
              onFinish();
              handleClose();
            } catch (error) {
              message.error("Error when adding sub product!");
              console.log(error);
            } finally {
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.log("Form 2 validation failed:", error);
          });
      })
      .catch((error) => {
        console.log("Options form validation failed:", error);
      });
  };

  return (
    <Modal
      onOk={() => handleSubmit()}
      okButtonProps={{
        loading: isLoading,
      }}
      title={
        <Typography.Title>
          {subProduct ? "Update sub product" : "Add sub product"}
        </Typography.Title>
      }
      open={visible}
      onCancel={handleClose}
      onClose={handleClose}
    >
      <Typography.Title level={4}>
        {"Main product: "}
        {product.title}
      </Typography.Title>
      <Form
        size="large"
        disabled={isLoading}
        layout="vertical"
        form={optionsForm}
      >
        {product.options &&
          product.options.map((option, index) => (
            <div key={"option" + index}>
              {option === "Color" || option === "color" ? (
                <div className="d-flex">
                  <Form.Item
                    name={option}
                    label={option}
                    rules={[
                      { required: true, message: `${option} is required!` },
                    ]}
                  >
                    <ColorPicker presets={presets} />
                  </Form.Item>
                </div>
              ) : (
                <Form.Item
                  name={option}
                  label={option}
                  rules={[
                    { required: true, message: `${option} is required!` },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              )}
            </div>
          ))}
      </Form>
      <Form layout="vertical" size="large" form={form} disabled={isLoading}>
        <div className="row">
          <div className="col">
            <Form.Item
              name={"quantity"}
              label="Quantity"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item
              name={"price"}
              label="Price"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item
              name={"discount"}
              label="Discount"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </div>
      </Form>
      <Upload
        multiple
        fileList={fileList}
        accept="image/*"
        listType="picture-card"
        onChange={(newFileList) =>
          setFileList(changeFileListToUpload(newFileList.fileList))
        }
      >
        Upload
      </Upload>
    </Modal>
  );
};

export default ModalAddSubProduct;
