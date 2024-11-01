import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import {
  Button,
  Card,
  Divider,
  Form,
  Image,
  Input,
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
import { SupplierModel } from "../../models/SupplierModel";
import { replace, useNavigate, useSearchParams } from "react-router-dom";
import { replaceName } from "../../utils/replaceName";
import {
  changeFileListToUpload,
  processFileList,
  uploadFile,
  uploadFiles,
} from "../../utils/uploadFile";
import { AddSquare } from "iconsax-react";
import { ModalCategory } from "../../modals";
import {
  ProductModel,
  ProductRequest,
  ProductResponse,
} from "./../../models/Products";

const { Title } = Typography;

const AddProduct = () => {
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliersOption, setSuppliersOption] = useState<SelectModel[]>();
  // const editorRef = useRef<any>(null);
  const [form] = Form.useForm();
  // const [fileURL, setFileURL] = useState<string>("");
  const [isVisibleCategory, setIsVisibleCategory] = useState(false);
  const [categories, setCategories] = useState<TreeModel[]>([]);
  // const [files, setFiles] = useState<any[]>([]);
  // const inputFileRef = useRef<any>(null);
  // const [content, setContent] = useState<string>("");
  const [searchPrams] = useSearchParams();
  const [idProduct, setIdProduct] = useState<string | null>("");
  const [product, setProduct] = useState<ProductResponse>();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<any[]>([]);

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

  const handleAddNewProduct = async (values: ProductRequest) => {
    // values.content = content;
    values.slug = replaceName(values.title);
    setIsLoading(true);
    if (fileList && fileList.length > 0) {
      const imageUrls = await processFileList(fileList);
      if (imageUrls.length > 0) values.images = imageUrls;
    }
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
        navigate("/inventory");
      }
      // setContent("");
      setFileList([]);
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
    const options = data.map((item: SupplierModel) => ({
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
      <Form
        disabled={isLoading}
        size="large"
        form={form}
        onFinish={handleAddNewProduct}
        layout="vertical"
      >
        <div className="row">
          <div className="col-md-8 ">
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
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
                name={"supplierId"}
              >
                <Select
                  placeholder={"Select supplier"}
                  showSearch
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
            {/* <Editor
              onInit={(_evt, editor) => (editorRef.current = editor)}
              apiKey="ih07bjaxxgp5ywku0piogyodrxm13wttrpxz59qydzru6vpj"
              init={{
                plugins: [
                  // Core editing features
                  "anchor",
                  "autolink",
                  "charmap",
                  "codesample",
                  "emoticons",
                  "image",
                  "link",
                  "lists",
                  "media",
                  "searchreplace",
                  "table",
                  "visualblocks",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                tinycomments_mode: "embedded",
                tinycomments_author: "Author name",
                mergetags_list: [
                  { value: "First.Name", title: "First Name" },
                  { value: "Email", title: "Email" },
                ],
              }}
              value={content} // Đảm bảo content đã được khởi tạo
              onEditorChange={(newContent, _editor) => {
                setContent(newContent); // Cập nhật trạng thái khi nội dung thay đổi
              }}
            /> */}
          </div>
          <div className="col-md-4">
            <Card size="small" className="mt-4" title="Categories">
              <Form.Item
                rules={[
                  {
                    required: false,
                    message: "Required",
                  },
                ]}
                name={"categoryIds"}
              >
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
            <Card>
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
            {/* <Card
              title={"Images"}
              extra={
                <Button
                  size="small"
                  onClick={() => inputFileRef.current.click()}
                >
                  Upload images
                </Button>
              }
            >
              {files.length > 0 && (
                <Image.PreviewGroup>
                  {Object.keys(files).map((i) => {
                    const index = parseInt(i);
                    return (
                      <Image
                        style={{
                          border: "1px solid silver",
                        }}
                        width={"50%"}
                        src={URL.createObjectURL(files[index])}
                      />
                    );
                  })}
                </Image.PreviewGroup>
              )}
            </Card> */}
            <Card>
              <Space>
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    form.resetFields();
                    // setContent("");
                    setFileList([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  loading={isLoading}
                  type="primary"
                  onClick={() => form.submit()}
                >
                  {idProduct ? "Update" : "Submit"}
                </Button>
              </Space>
            </Card>
            {/* <Card>
              <Input
                allowClear
                onClear={() => setFileURL("")}
                value={fileURL}
              />
              <Input
                accept="image/*"
                type="file"
                onChange={async (files: any) => {
                  const file = files.target.files[0];
                  if (file) {
                    const downloadUrl = await uploadFile(file);
                    downloadUrl && setFileURL(downloadUrl);
                  }
                }}
              />
            </Card> */}
          </div>
        </div>
      </Form>
      {/* <div className="d-none">
        <input
          type="file"
          multiple
          accept="image/*"
          ref={inputFileRef}
          onChange={(values: any) => setFiles(values.target.files)}
        ></input>
      </div> */}
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
