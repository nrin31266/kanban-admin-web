import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import {
  Button,
  Card,
  Divider,
  Form,
  Image,
  Input,
  List,
  message,
  Select,
  Space,
  TreeSelect,
  Typography,
  Upload,
  UploadProps,
} from "antd";

import handleAPI from "../../apis/handleAPI";
import { API, colors } from "../../configurations/configurations";
import { SelectModel, TreeModel } from "./../../models/FormModel";
import { SupplierResponse } from "../../models/SupplierModel";
import { useNavigate, useSearchParams } from "react-router-dom";
import { replaceName } from "../../utils/replaceName";
import {
  changeFileListToUpload,
  processFileList,
} from "../../utils/uploadFile";
import { AddSquare } from "iconsax-react";
import { ModalCategory } from "../../modals";
import { ProductRequest, ProductResponse } from "./../../models/Products";

const { Title } = Typography;

const AddProduct = () => {
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliersOption, setSuppliersOption] = useState<SelectModel[]>();
  const [form] = Form.useForm();
  const [isVisibleCategory, setIsVisibleCategory] = useState(false);
  const [categories, setCategories] = useState<TreeModel[]>([]);
  const [searchPrams] = useSearchParams();
  const [idProduct, setIdProduct] = useState<string | null>("");
  const [product, setProduct] = useState<ProductResponse>();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState<string>(""); 
  const [options, setOptions] = useState<string[]>(['Color', 'Size', 'Code']); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddOption = () => {
    if (inputValue.trim()) {
      setOptions([...options, inputValue]);
      setInputValue("");
    }
  };

  useEffect(() => {
    if (searchPrams.get("id")) {
      const id: string | null = searchPrams.get("id");
      setIdProduct(id);
    }
    getData();
  }, []);

  useEffect(() => {
    if (idProduct) {
      getProductDetail(idProduct);
    }
  }, [idProduct]);

  useEffect(() => {
    if (product) {
      console.log(product);
      // setContent(item.content);
      form.setFieldsValue(product);
      if (product.images && product.images.length > 0) {
        const imgs: any = [];
        product.images.forEach((urlImg, index) => {
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
  }, [product]);

  const getProductDetail = async (idProduct: string) => {
    try {
      const res = await handleAPI(`${API.PRODUCTS}/${idProduct}`);
      console.log(res.data);
      const item: ProductResponse = res.data.result;
      setProduct(item);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values: ProductRequest) => {
    if(options.length === 0){
      message.error('Please add less one option of product');
      return;
    }
    values.slug = replaceName(values.title);
    setIsLoading(true);
    if (fileList && fileList.length > 0) {
      const imageUrls = await processFileList(fileList);
      if (imageUrls.length > 0) values.images = imageUrls;
    }
    values.options = options;
    console.log(values);
    const api = idProduct ? `${API.PRODUCTS}/${idProduct}` : API.PRODUCTS;
    try {
      const res = await handleAPI(api, values, idProduct ? "put" : "post");
      console.log(res.data);
      message.success(
        `${idProduct ? "Update" : "Add"} product with name '${
          values.title
        }' successfully!`
      );
      form.resetFields();
      if (idProduct) {
        setIdProduct(null);
      }
      navigate("/inventory");
      
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async () => {
    setIsInitLoading(true);
    try {
      await getSuppliers();
      await getCategories();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsInitLoading(false);
    }
  };

  const getSuppliers = async () => {
    const res = await handleAPI(API.SUPPLIER);
    const data = res.data.result.data;
    const options = data.map((item: SupplierResponse) => ({
      value: item.id,
      label: `Name: ${item.name}, Email: ${item.email}`,
    }));
    setSuppliersOption(options);
  };
  const getCategories = async () => {
    const res = await handleAPI(`${API.CATEGORY}/get-tree`);
    setCategories(res.data.result);
  };

  return isInitLoading ? (
    <div className="loader">
      <span className="loader" />
    </div>
  ) : (
    <div className="container">
      <Title level={3}>
        {idProduct ? "Update product" : "Add new product"}
      </Title>

      <div className="row">
        <div className="col-lg-6">
          <Form
            disabled={isLoading}
            size="large"
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              name={"title"}
              label={"Title"}
              rules={[
                {
                  required: true,
                  message: "Please",
                },
              ]}
            >
              <Input maxLength={150} showCount />
            </Form.Item>
            <Card size="small" className="mt-4" title="Supplier">
              <Form.Item name={"supplierId"}>
                <Select
                  placeholder={"Select supplier"}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    replaceName(option?.label ? option.label : "").includes(
                      replaceName(input)
                    )
                  }
                  options={suppliersOption}
                ></Select>
              </Form.Item>
            </Card>
            <Form.Item
              name={"description"}
              label={"Description"}
              rules={[
                {
                  required: true,
                  message: "Please",
                },
              ]}
            >
              <Input.TextArea rows={3} showCount maxLength={1000} />
            </Form.Item>
            <Card size="small" className="mt-4" title="Categories">
              <Form.Item name={"categoryIds"}>
                <TreeSelect
                  filterTreeNode={(input, treeNode) =>
                    replaceName(treeNode.props.title).includes(
                      replaceName(input)
                    )
                  }
                  placeholder={"Select categories!"}
                  multiple
                  allowClear
                  treeData={categories}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider className="m-0" />
                      <Button
                        onClick={() => setIsVisibleCategory(true)}
                        icon={<AddSquare size={20} className="mt-1" />}
                        style={{ padding: "0 8px" }}
                        type="link"
                      >
                        Add new
                      </Button>
                    </>
                  )}
                ></TreeSelect>
              </Form.Item>
            </Card>
          </Form>
        </div>
        <div className="col-lg-6">
          <Card title={"Options"} size="small">
            <Space direction="vertical" style={{ width: "100%" }}>
              <List
                bordered
                dataSource={options}
                renderItem={(item, index) => (
                  <List.Item
                  >
                    <div className="row" style={{ width: "100%" }}>
                      <div
                        className="col-10 d-flex"
                        style={{ alignItems: "center" }}
                      >
                        {item}
                      </div>
                      <div className="col-2">
                        <Button
                          type="link"
                          className="p-0"
                          style={{
                            color: "red",
                          }}
                          onClick={() =>
                            setOptions(
                              options.filter((_, i) => i !== index)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
              <div className="d-flex">
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter option"
                  style={{ width: "80%" }}
                />
                <Button onClick={handleAddOption} type="primary" className="ml-2">
                  Add
                </Button>
              </div>
            </Space>
          </Card>
          <Card className="mt-4">
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
          </Card>
          <Card>
            <div>
              <Button
                style={{ width: "100%" }}
                loading={isLoading}
                type="primary"
                onClick={() => form.submit()}
              >
                {idProduct ? "Update" : "Submit"}
              </Button>
              <Button
              className="mt-3"
                style={{ width: "100%" }}
                disabled={isLoading}
                onClick={() => {
                  form.resetFields();
                  setFileList([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <ModalCategory
        values={categories}
        visible={isVisibleCategory}
        onAddNew={async () => {
          await getCategories();
        }}
        onClose={() => setIsVisibleCategory(false)}
      />
    </div>
  );
};

export default AddProduct;

{
  /* <div>
        <Typography.Title level={4}>Options</Typography.Title>
        <div>
          <Input />
          <Button>Add</Button>
        </div>
      </div> */
}
