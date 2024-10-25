import {
  ColorPicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  ProductModel,
  SubProductModel,
  SubProductRequest,
  SubProductResponse,
} from "../models/Products";
import { API } from "../configurations/configurations";
import { uploadFiles } from "../utils/uploadFile";
import handleAPI from "../apis/handleAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
  product?: ProductModel;
  subProduct?: SubProductResponse;
  onAddNew?: (values: SubProductModel) => void;
  onUpdated?: () => void;
}

const ModalAddSubProduct = (props: Props) => {
  const [color, setColor] = React.useState<string>("#1677ff");
  const [isLoading, setIsLoading] = useState(false);
  const { visible, onClose, product, onAddNew, subProduct, onUpdated } = props;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (subProduct) {
      console.log(subProduct);
      form.setFieldsValue(subProduct);
      subProduct.color && setColor(subProduct.color);
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
    }
  }, [subProduct]);

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  const handleSubmit = async (values: SubProductRequest) => {
    setIsLoading(true);
    if (subProduct) values.productId = subProduct.productId;
    else if (product) values.productId = product.id;
    values.color = color;
    if (fileList && fileList.length > 0) {
      const files: any[] = [];
      let imagesUrl: string[] = [];
      fileList.forEach((file, _index) => {
        if (file.originFileObj) files.push(file.originFileObj);
        else imagesUrl.push(file.url);
      });
      if (files && files.length > 0) {
        const uploadedFilesUrl: string[] | null = await uploadFiles(files);
        if (uploadedFilesUrl && uploadedFilesUrl.length > 0) {
          imagesUrl = [...imagesUrl, ...uploadedFilesUrl];
        }
      }
      if (imagesUrl && imagesUrl.length > 0) {
        values.images = imagesUrl;
      } else {
        setIsLoading(false);
        return;
      }
    }
    let api;
    subProduct
      ? (api = `${API.SUB_PRODUCTS}/${subProduct.id}`)
      : (api = `${API.SUB_PRODUCTS}`);
    try {
      const res = await handleAPI(api, values, subProduct ? "put" : "post");
      message.success((subProduct ? "Update" : "Add") + " successfully!");
      onAddNew && onAddNew(res.data.result);
      onUpdated && onUpdated();
      handleClose();
    } catch (error) {
      message.error("Error when adding sub product!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const items = newFileList.map((item) =>
      item.originFileObj
        ? {
            ...item,
            url: item.originFileObj
              ? URL.createObjectURL(item.originFileObj)
              : "",
            status: "done",
          }
        : { ...item }
    );
    setFileList(items);
  };

  return (
    <Modal
      onOk={form.submit}
      okButtonProps={{
        loading: isLoading,
      }}
      title={subProduct ? "Update sub product" : "Add sub product"}
      open={visible}
      onCancel={handleClose}
      onClose={handleClose}
    >
      <Typography.Title level={5}>{product?.title}</Typography.Title>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        size="large"
        form={form}
        disabled={isLoading}
      >
        <Form.Item name="color" label="Color">
          <ColorPicker
            defaultValue={color}
            onChange={(c) => {
              const hexColor = c.toHexString();
              setColor(hexColor);
            }}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "type device size",
            },
          ]}
          name="size"
          label="Size"
        >
          <Input allowClear />
        </Form.Item>
        <div className="row">
          <div className="col">
            <Form.Item name={"quantity"} label="Quantity">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item name={"price"} label="Price">
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
        onChange={handleChange}
      >
        Upload
      </Upload>
    </Modal>
  );
};

export default ModalAddSubProduct;
