import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from "antd";
import handleAPI from "../../apis/handleAPI";
import { API } from "../../configurations/configurations";
import { SelectModel } from "./../../models/FormModel";
import { SupplierModel } from "../../models/SupplierModel";
import { replace } from "react-router-dom";
import { replaceName } from "../../utils/replaceName";
import { uploadFile } from "../../utils/uploadFile";

const { Text, Title, Paragraph } = Typography;
const initContent = {
  title: "",
  description: "",
  supplier: "",
};

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [suppliersOption, setSuppliersOption] = useState<SelectModel[]>();
  const editorRef = useRef<any>(null);
  const [form] = Form.useForm();
  const [fileURL, setFileURL] = useState<string>("");

  const handleAddNewProduct = async (values: any) => {
    const content = editorRef.current.getContent();
    console.log(content);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getSuppliers();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuppliers = async () => {
    const res = await handleAPI(API.SUPPLIER);
    const data = res.data.result.data;
    const options = data.map((item: SupplierModel) => ({
      value: item.id,
      label: `${item.name}-${item.contact}-${item.email}`,
    }));
    setSuppliersOption(options);
  };

  return (
    <div className="container">
      <Title level={3}>Add new product</Title>
      <Form
        size="large"
        form={form}
        onFinish={handleAddNewProduct}
        layout="vertical"
      >
        <div className="row">
          <div className="col-8">
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
                name={"supplier"}
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
          <div className="col-4">
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
                <Select
                  dropdownRender={(menu) => (
                    <>
                      {menu},
                      <Divider />
                      <Button type="link">Add new</Button>
                    </>
                  )}
                  mode="multiple"
                ></Select>
              </Form.Item>
            </Card>
            <Card>
              <Space>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Submit
                </Button>
              </Space>
            </Card>
            <Card>
              <Input allowClear onClear={()=> setFileURL('')} value={fileURL} />
              <Input accept="image/*" type="file" onChange= { async (files: any)=>{
                const file = files.target.files[0];
                if(file){
                    const downloadUrl = await uploadFile(file);
                    downloadUrl && setFileURL(downloadUrl)
                }
              }}/>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddProduct;
