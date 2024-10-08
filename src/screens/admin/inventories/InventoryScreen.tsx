import { Avatar, Button, Image, Space, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  CategoryModel,
  ProductModel,
  SubProductModel,
} from "../../../models/Products";
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
      key: "colors",
      dataIndex: "subProductResponse",
      title: "Color",
      render: (items: SubProductModel[]) => {
        if (!items || items.length === 0) {
          return null; // Không có gì để hiển thị
        }

        const colors: string[] = [];

        items.forEach((sub) => {
          if (!colors.includes(sub.color)) {
            colors.push(sub.color);
          }
        });

        return (
          <Space>
            {colors.map((color, index) => (
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: color,
                  borderRadius: 12,
                  border: "1px solid #000", // Thêm viền nếu muốn nhìn rõ màu
                }}
                key={`color-${color}-${index}`}
              />
            ))}
          </Space>
        );
      },
    },

    {
      key: "sizes",
      dataIndex: "subProductResponse",
      title: "Sizes",
      render: (items: SubProductModel[]) => {
        if (!items || items.length === 0) {
          return null; // Không có gì để hiển thị
        }
        return (
          <Space wrap>
            {items.length > 0 &&
              items.map((item, index) => (
                <Tag key={`size${item.size}-${index}`}>{item.size}</Tag>
              ))}
          </Space>
        );
      },
    },
    {
      key: "prices",
      dataIndex: "subProductResponse",
      title: "Prices",
      render: (items: SubProductModel[]) => {
        if (!items || items.length === 0) {
          return "";
        }

        // Nếu chỉ có một item, trả về giá trị price của item đó
        if (items.length === 1) {
          return items[0].price;
        }

        // Tìm giá trị nhỏ nhất và lớn nhất của price
        const prices = items
          .filter((item) => item.price) // Lọc các item có giá trị price
          .map((item) => item.price); // Lấy danh sách các price

        if (prices.length === 0) {
          return ""; // Không có giá trị price hợp lệ
        }

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Nếu min và max bằng nhau, chỉ hiển thị một giá trị, ngược lại hiển thị range
        return minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;
      },
    },

    {
      key: "quantity",
      dataIndex: "subProductResponse",
      title: "Quantity",
      render: (items: SubProductModel[]) => {
        if (!items || items.length === 0) {
          return "";
        }

        let quantity = 0;

        items.forEach((item) => {
          if (item.quantity) {
            quantity += item.quantity;
          }
        });

        return quantity;
      },
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
        bordered
        dataSource={products}
        columns={columns}
        loading={isLoading}
      ></Table>
      <ModalAddSubProduct
        onAddNew={(values: SubProductModel) => {
          console.log(values);
        }}
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
