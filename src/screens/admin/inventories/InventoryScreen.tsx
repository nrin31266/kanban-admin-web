import { Avatar, Button, Image, Space, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { CategoryModel, ProductModel } from "../../../models/Products";
import handleAPI from "../../../apis/handleAPI";
import { API, colors } from "../../../configurations/configurations";
import { ColumnProps } from "antd/es/table";
import { Link } from "react-router-dom";
import { listColors } from "../../../constants/listColors";
import { MdLibraryAdd } from "react-icons/md";
import { ModalAddSubProduct } from "../../../modals";

const InventoryScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isVisibleModalAddSubProduct, setIsVisibleModalAddSubProduct] =
    useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();

  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    setIsLoading(true);
    try {
      const res = await handleAPI(`${API.PRODUCTS}/data`);
      console.log(res.data.result);
      setProducts(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
    },
    {
      key: "categories",
      dataIndex: "categories",
      title: "Categories",
      render: (categories: CategoryModel[]) =>
        categories &&
        categories.length > 0 && (
          <Space>
            {categories.map((category: CategoryModel, _index) => (
              <Link to={"/categories/detail/${item.slug}?id=${item.key}"}>
                <Tag
                  color={
                    listColors[Math.floor(Math.random() * listColors.length)]
                  }
                >
                  {category.name}
                </Tag>
              </Link>
            ))}
          </Space>
        ),
    },
    {
      key: "images",
      dataIndex: "images",
      title: "Image",
      render: (images: string[]) =>
        images &&
        images.length > 0 && (
          <Space>
            <Avatar.Group>
              {images.map((img, _index) => (
                <Image src={img} width={"50px"} height={"50px"} />
              ))}
            </Avatar.Group>
          </Space>
        ),
    },
    {
      key: "action",
      dataIndex: "",

      title: "Action",
      render: (product: ProductModel) => (
        <Space>
          <Tooltip title={"Add sub product"}>
            <Button
            size="small"
              type="text"
              onClick={() => {
                setIsVisibleModalAddSubProduct(true);
                setProductSelected(product);
              }}
            >
              <MdLibraryAdd color={colors.primary500} size={20} />
            </Button>
          </Tooltip>
        </Space>
      ),
      fixed: "right",
    },
  ];

  return (
    <>
      <Table
        dataSource={products}
        columns={columns}
        loading={isLoading}
      ></Table>
      <ModalAddSubProduct
        product={productSelected}
        onClose={() => {
          setIsVisibleModalAddSubProduct(false);
          setProductSelected(undefined);
        }}
        visible={isVisibleModalAddSubProduct}
      />
    </>
  );
};

export default InventoryScreen;
