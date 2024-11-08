import React, { useEffect, useState } from "react";

import { Button, Card, message, Modal, Space, Table, Tooltip } from "antd";
import { ColumnProps } from "antd/es/table";

import { Link } from "react-router-dom";
import { TreeModel } from "../../models/FormModel";
import handleAPI from "../../apis/handleAPI";
import { API } from "../../configurations/configurations";
import { AddCategory } from "../../components";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { CategoryTableData } from "../../models/CategoryModel";

const { confirm } = Modal;

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<CategoryTableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [categoryTree, setCategoryTree] = useState<TreeModel[]>([]);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [categorySelected, setCategorySelected] = useState<CategoryTableData>();

  useEffect(() => {
    getCategories();
  }, [page, size]);

  useEffect(() => {
    getData();
  }, []);

  const getData =async () =>{
    setIsInitLoading(true);
    await getCategories();
    await getCategoriesTree();
    setIsInitLoading(false);
  }
  const getCategoriesTree = async () => {
    setIsLoading(true);
    try {
      const treeValue = await handleAPI(API.GET_CATEGORIES_TREE);
      setCategoryTree(treeValue.data.result);
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const res = await handleAPI(`${API.CATEGORY}/table-data`);
      setCategories(res.data.result);
      
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
      // setCategories((categories) => categories.filter(element => element.key !== categoryId ));
      await getCategories();
    } catch (error) {
      console.log(error);
    }
  };


  const columns: ColumnProps<CategoryTableData>[] = [
    {
      key: "index",
      title: "#",
      dataIndex: "index",
      render: (_, __, index) => index + 1
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "",
      render: (item: CategoryTableData)=> <Link to={`/categories/detail/${item.slug}?id=${item.key}`}>{item.name}</Link>
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
      render: (item: CategoryTableData) => (
        <Space>
          <Tooltip title="Edit categories" key={"btnEdit"}>
            <Button 
            onClick={() => setCategorySelected(item)}
            icon={<FaEdit size={20}  />} type="text" className="text-primary" />
          </Tooltip>
          <Tooltip title="Delete categories" key={"btnDelete"}>
            <Button
              onClick={() =>
                confirm({
                  title: "Confirm",
                  content: "You sure want delete this?",
                  onOk: async () => handleRemoveCategory(item.key),
                })
              }
              icon={<RiDeleteBin5Fill size={20} className="text-danger" />}
              type="text"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return isInitLoading ? (
    <div className="loader">
      <span />
    </div>
  ) : (
    <>
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-4">
            <div>
              <AddCategory
              onClose={()=>setCategorySelected(undefined)}
              selected={categorySelected}
              onAddNew={()=>{
                categorySelected && setCategorySelected(undefined);
                getCategories(); 
                getCategoriesTree()}} 
              values={categoryTree}/>
            </div>
          </div>
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
