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
  Spin,
  TreeSelect,
  Typography,
} from "antd";
import handleAPI from "../../../apis/handleAPI";
import { API, colors } from "../../../configurations/configurations";
import {
  SelectModel,
  TreeModel,
  TreeModelChildren,
} from "./../../../models/FormModel";
import { SupplierModel } from "../../../models/SupplierModel";
import { replace } from "react-router-dom";
import { replaceName } from "../../../utils/replaceName";
import { uploadFile } from "../../../utils/uploadFile";
import { AddSquare } from "iconsax-react";
import { ModalCategory } from "../../../modals";
import { ProductModel } from './../../../models/Products';

const { Text, Title, Paragraph } = Typography;
const initContent = {
  title: "",
  description: "",
  supplier: "",
};

const AddProduct = () => {
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [suppliersOption, setSuppliersOption] = useState<SelectModel[]>();
  const editorRef = useRef<any>(null);
  const [form] = Form.useForm();
  const [fileURL, setFileURL] = useState<string>("");
  const [isVisibleCategory, setIsVisibleCategory] = useState(false);
  const [categories, setCategories] = useState<TreeModel[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const inputFileRef = useRef<any>(null); 

  const handleAddNewProduct = async (values: ProductModel) => {
    setIsLoading(true);
    const content = editorRef.current.getContent();
    values.content = content;
    values.slug = replaceName(values.title); 
    if (files.length > 0) {
      const uploadPromises = Object.keys(files).map(async (i) => {
          const index = parseInt(i);
          const url = await uploadFile(files[index]);
          return url;
      });
      values.images = await Promise.all(uploadPromises);
  }
    try {
      const res = await handleAPI(API.PRODUCTS, values, 'post');
      message.success(`Add product with name '${values.title}' successfully!`);
      form.resetFields();
      editorRef.current.setContent('');
    } catch (error) {
      console.log(error);
      message.error('An error occurred when adding a product!');
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
      <Title level={3}>Add new product</Title>
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

            <Editor
              onBlur={(_evt, editor) => (editorRef.current = editor)}
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
              initialValue={content}
            />
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
                name={"categories"}
              >
                <TreeSelect
                  filterTreeNode={(input, treeNode) =>
                    replaceName(treeNode.props.title).includes(replaceName(input))
                  }
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
            <Card title={'Images'} extra={
              <Button size="small" onClick={()=>inputFileRef.current.click()}>Upload images</Button>
            }>
              {
                files.length > 0 &&
                <Image.PreviewGroup>
                  {
                    Object.keys(files).map((i) => {
                      const index = parseInt(i);
                      return <Image style={{
                        border: '1px solid silver'
                      }} width={'50%'} src={URL.createObjectURL(files[index])}/>
                    })
                  }
                </Image.PreviewGroup>
              }
              
            </Card>
            <Card>
              <Space>
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    form.resetFields();
                    editorRef.current = null;
                  }}
                >
                  Cancel
                </Button>
                <Button loading={isLoading} type="primary" onClick={() => form.submit()}>
                  Submit
                </Button>
              </Space>
            </Card>
            <Card>
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
            </Card>
          </div>
        </div>
      </Form>
      <div className="d-none">
        <input type="file" multiple accept="image/*" ref={inputFileRef} 
        onChange={(values: any)=> setFiles(values.target.files)}></input>
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
