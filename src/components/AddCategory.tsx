import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  TreeSelect,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import React, { useEffect, useState } from "react";
import { API } from "../configurations/configurations";
import handleAPI from "../apis/handleAPI";
import { TreeModel } from "../models/FormModel";
import { replaceName } from "../utils/replaceName";
import { changeFileListToUpload, processFileList } from "../utils/uploadFile";
import { CategoryTableData } from "../models/CategoryModel";

interface Props {
  selected?: CategoryTableData;
  onAddNew: () => void;
  values: TreeModel[];
  onClose?: () => void;
}
const AddCategory = (props: Props) => {
  const { onAddNew, values, selected, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleSubmit = async (values: any) =>{
    const imageUrl = await processFileList(fileList);
    values.imageUrl=imageUrl[0];
    const api = selected ? `${API.CATEGORY}/${selected.key}` : API.CATEGORY;
    try {
      await handleAPI(api, values, selected? 'put' : 'post');
      if(selected){
        message.success("Update category successfully!");
      }else{
        message.success("Create category successfully!");
      }
      onAddNew();
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (selected) {
      form.setFieldsValue(selected);
      if(selected.imageUrl){
        const item ={
          url: selected.imageUrl,
          status: 'done',
          uid: 'blabala',
          name: selected.name
        }
        setFileList([item]);
      }
    }
  }, [selected]);

  const handleChangeFile = (val:any) =>{
    const files: UploadFile[] = val.fileList;
    setFileList(changeFileListToUpload(files));
  }

  return (
    <Card
      title={
        <Typography.Text style={{ fontSize: "20px" }}>
          {selected ? "Update category" : "Add category"}
        </Typography.Text>
      }
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
      <Form
        disabled={isLoading}
        layout="vertical"
        form={form}
        onFinish={(values) => {
          handleSubmit(values);
        }}
        size="large"
      >
        <Form.Item name={"parentId"} label={"Parent"}>
          <TreeSelect
            onSelect={(id) => {
              if (selected && id === selected.key) {
                message.error("The category cannot be a child of itself!");
                form.setFieldsValue({ parentId: selected.parentId });
              }
            }}
            treeData={values}
            allowClear
            showSearch
            filterTreeNode={(input, treeNode) =>
              replaceName(treeNode.props.title).includes(replaceName(input))
            }
          />
        </Form.Item>
        <Form.Item
          name={"name"}
          label={"Name"}
          rules={[
            {
              required: true,
              message: "Enter category name!",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name={"description"}
          label={"Description"}
          rules={[
            {
              required: true,
              message: "Enter category description!",
            },
          ]}
        >
          <Input.TextArea rows={3} allowClear />
        </Form.Item>
      </Form>

      <Space>
        <Button type="primary" disabled={isLoading} onClick={form.submit}>
          {selected ? "Update" : "Submit"}
        </Button>
        {onClose && (
          <Button
            type="text"
            disabled={isLoading}
            onClick={() => {
              form.resetFields();
              onClose();
              setFileList([]);
            }}
          >
            Cancel
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default AddCategory;
