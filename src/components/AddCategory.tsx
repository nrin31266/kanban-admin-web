import { Button, Form, Input, message, Modal, Space, TreeSelect } from "antd";
import React, { useEffect, useState } from "react";
import { API } from "../configurations/configurations";
import handleAPI from "../apis/handleAPI";
import { TreeModel } from "../models/FormModel";
import { replaceName } from "../utils/replaceName";
import { CategoryModel, CategoryTableData } from "../models/Products";

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

  const handleAddSubmit = async (values: any) => {
    setIsLoading(true);
    if (!values.parentId) values.parentId = null;
    values.slug = replaceName(values.name);
    try {
      await handleAPI(API.CATEGORY, values, "post");
      message.success("Create category successfully!");
      onAddNew();
      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateSubmit = async (values: any, id: string) => {
    setIsLoading(false);

    if (!values.parentId) values.parentId = null;
    values.slug = replaceName(values.name);
    try {
      await handleAPI(`${API.CATEGORY}/${id}`, values, "put");
      message.success("Update category successfully!");

      onAddNew();
      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selected) {
      form.setFieldsValue(selected);
    }
  }, [selected]);

  return (
    <>
      <Form
        disabled={isLoading}
        layout="vertical"
        form={form}
        onFinish={(values) => {
          selected
            ? handleUpdateSubmit(values, selected.key)
            : handleAddSubmit(values);
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
        {onClose && (
          <Button
            type="primary"
            disabled={isLoading}
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            Cancel
          </Button>
        )}
        <Button type="primary" disabled={isLoading} onClick={form.submit}>
          {selected ? "Update" : "Submit"}
        </Button>
      </Space>
    </>
  );
};

export default AddCategory;
