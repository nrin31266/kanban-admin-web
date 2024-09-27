import React, { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";
import { CategoryModel } from "../models/Products";
import { Button, Card, message, Modal, Space, Table, Tooltip } from "antd";
import { ColumnProps } from "antd/es/table";
import { FaTrashAlt } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
const { confirm } = Modal;

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  useEffect(() => {
    getCategories();
  }, [page, size]);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const res = await handleAPI(`${API.CATEGORY}?page=${page}&size=${size}`);
      setCategories(res.data.result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRemoveCategory = async (categoryId: string) => {
    try {
      const res = await handleAPI(
        `${API.CATEGORY}/${categoryId}`,
        undefined,
        "delete"
      );
      res.data.result === true
        ? message.success("Deleted!")
        : message.error("You can not delete!");
      setCategories((categories) => categories.filter(element => element.id !== categoryId ));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateCategory = async (values: CategoryModel) => {
    try {
      const res = await handleAPI(
        `${API.CATEGORY}/${values.id}`,
        values,
        "put"
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnProps<CategoryModel>[] = [
    {
      key: "index",
      title: "#",
      dataIndex: "index",
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "actions",
      title: "Actions",
      fixed: "right",
      dataIndex: "",
      render: (item: CategoryModel) => (
        <Space>
          <Tooltip title="Edit categories" key={"btnEdit"}>
            <Button icon={<FiEdit3 size={20} color="silver" />} type="text" />
          </Tooltip>
          <Tooltip title="Delete categories" key={"btnDelete"}>
            <Button
              onClick={() =>
                confirm({
                  title: "Confirm",
                  content: "You sure want delete this?",
                  onOk: async () => handleRemoveCategory(item.id),
                })
              }
              icon={<FaTrashAlt size={20} className="text-danger" />}
              type="text"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return isLoading ? (
    <div className="loader">
      <span />
    </div>
  ) : (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4">form</div>
          <div className="col-md-8">
            <Card>
              <Table size="small" dataSource={categories} columns={columns} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesScreen;
