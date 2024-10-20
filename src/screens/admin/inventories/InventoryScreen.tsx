import {
  Avatar,
  Button,
  Image,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  CategoryModel,
  ProductModel,
  SubProductModel,
} from "../../../models/Products";
import handleAPI from "../../../apis/handleAPI";
import { API, colors } from "../../../configurations/configurations";
import { ColumnProps, TableProps } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import { listColors } from "../../../constants/listColors";
import { MdLibraryAdd } from "react-icons/md";
import { ModalAddSubProduct } from "../../../modals";
import { Edit2, Trash } from "iconsax-react";
import { sign } from "crypto";
import { PaginationResponseModel } from "../../../models/AppModel";
const { confirm } = Modal;

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const InventoryScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isVisibleModalAddSubProduct, setIsVisibleModalAddSubProduct] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [productSelected, setProductSelected] = useState<ProductModel>();

  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [paginationSize, setPaginationSize] = useState<number>(10); 

  const [total, setTotal] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    getProducts();
  }, [paginationPage, paginationSize]);

  useEffect(() => {
    console.log(selectedRowKeys);
  }, [selectedRowKeys]);

  const getProducts = async () => {
    setIsLoading(true);
    let api = `${API.PRODUCTS}/data?page=${paginationPage}&size=${paginationSize}`;
    try {
      const res = await handleAPI(api);
      const paginationRes : PaginationResponseModel = res.data.result;
      setTotal(paginationRes.totalElements);
      setProducts(
        paginationRes.data.map((item: ProductModel) => ({
          ...item,
          key: item.id,
        }))
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const res = await handleAPI(
        `${API.PRODUCTS}/${productId}`,
        undefined,
        "delete"
      );
      console.log(res);
      res.data.result
        ? message.success(res.data.message)
        : message.error(res.data.message);
      getProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<ProductModel> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "index",
      dataIndex: undefined,
      width: 60,
      title: "#",
      render: (_, __, index) => {
        return ((paginationPage-1) * paginationSize + (index + 1));
      },
    },
    {
      key: "title",
      dataIndex: "",
      title: "Title",
      width: 190,
      render: (item: ProductModel) => (
        <Link to={`/inventory/detail/${item.slug}?id=${item.id}`}>
          {item.title}
        </Link>
      ),
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
      width: 250,
      render: (description) => (
        <Tooltip title={description}>
          <div className="text-2-line">{description}</div>
        </Tooltip>
      ),
    },
    {
      key: "images",
      dataIndex: "images",
      title: "Image",
      width: 285,
      render: (images: string[]) =>
        images && images.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap", // Cho phép hình ảnh tự động xuống hàng
              gap: "4px", // Khoảng cách giữa các hình ảnh
            }}
          >
            {images.map((img, index) => (
              <Image
                key={`image-${index}`}
                src={img}
                width={"48px"}
                height={"48px"}
                style={{
                  borderRadius: "10px",
                  border: "1px solid silver",
                }}
              />
            ))}
          </div>
        ) : (
          <span className="text-secondary">No image</span>
        ),
    },
    {
      key: "categories",
      dataIndex: "categories",
      title: "Categories",
      width: 300,
      render: (categories: CategoryModel[]) =>
        categories &&
        categories.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap", // Cho phép hình ảnh tự động xuống hàng
              gap: "4px", // Khoảng cách giữa các hình ảnh
            }}
          >
            {categories.map((category: CategoryModel, _index) => (
              <Link to={"/categories/detail/${item.slug}?id=${item.key}"}>
                <Tag
                  style={{
                    margin: "0",
                    padding: "5px",
                    fontSize: "15px",
                  }}
                  color={
                    listColors[Math.floor(Math.random() * listColors.length)]
                  }
                >
                  {category.name}
                </Tag>
              </Link>
            ))}
          </div>
        ),
    },

    {
      key: "colors",
      dataIndex: "subProductResponse",
      title: "Color",
      width: 200,
      render: (items: SubProductModel[]) => {
        if (!items || items.length === 0) {
          return <span className="text-secondary">No color</span>;
        }

        const colors: string[] = [];

        items.forEach((sub) => {
          if (!colors.includes(sub.color)) {
            colors.push(sub.color);
          }
        });

        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {colors.map(
              (color, index) =>
                color && (
                  <div
                    style={{
                      margin: "2px",
                      width: 30,
                      height: 30,
                      backgroundColor: color,
                      borderRadius: "5%",
                      border: "1px solid black",
                    }}
                    key={`color-${color}-${index}`}
                  />
                )
            )}
          </div>
        );
      },
    },

    {
      key: "sizes",
      dataIndex: "subProductResponse",
      title: "Sizes",
      width: 300,
      render: (items: SubProductModel[]) => {
        if (!items || items.length === 0) {
          return <span className="text-secondary">No size</span>;
        }
        return (
          <Space wrap>
            {items.length > 0 &&
              items.map((item, index) => (
                <Tag
                  style={{
                    margin: "0",
                    padding: "5px",
                    fontSize: "15px",
                  }}
                  key={`size${item.size}-${index}`}
                >
                  {item.size}
                </Tag>
              ))}
          </Space>
        );
      },
    },
    {
      key: "prices",
      dataIndex: "subProductResponse",
      title: "Prices",
      width: 250,
      render: (items: SubProductModel[]) => {
        if (!items || items.length === 0) {
          return <span className="text-secondary">N/A</span>;
        }

        // Nếu chỉ có một item, trả về giá trị price của item đó
        if (items.length === 1) {
          return items[0].price.toLocaleString();
        }

        // Tìm giá trị nhỏ nhất và lớn nhất của price
        const prices = items
          .filter((item) => item.price) // Lọc các item có giá trị price
          .map((item) => item.price); // Lấy danh sách các price

        if (prices.length === 0) {
          return ""; // Không có giá trị price hợp lệ
        }

        const minPrice = Math.min(...prices).toLocaleString();
        const maxPrice = Math.max(...prices).toLocaleString();

        // Nếu min và max bằng nhau, chỉ hiển thị một giá trị, ngược lại hiển thị range
        return minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;
      },
    },

    {
      key: "quantity",
      dataIndex: "subProductResponse",
      title: "Quantity",
      width: 200,
      render: (items: SubProductModel[]) => {
        if (!items || items.length === 0) {
          return <span className="text-secondary">0</span>;
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
      width: 100,
      title: "Action",
      render: (product: ProductModel) => (
        <Space>
          <Tooltip title={"Add sub product"} key={"addSubProduct"}>
            <Button
              className="p-0"
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
          <Tooltip title={"Edit product"} key={"btnEdit"}>
            <Button
              className="p-0"
              size="small"
              type="text"
              onClick={() => {
                setProductSelected(product);
                navigate(`/inventory/add-product?id=${product.id}`);
                console.log(productSelected);
              }}
            >
              <Edit2 className="text-primary" size={20} />
            </Button>
          </Tooltip>
          <Tooltip title={"Delete product"} key={"btnDelete"}>
            <Button
              className="p-0"
              size="small"
              type="text"
              onClick={() => {
                confirm({
                  title: "Confirm",
                  content:
                    "Are you sure to delete the product, any by-products will be lost!",
                  onOk: () => handleRemoveProduct(product.id),
                  onCancel: () => console.log("Cancel"),
                });
              }}
            >
              <Trash className="text-danger" size={20} />
            </Button>
          </Tooltip>
        </Space>
      ),
      fixed: "right",
    },
  ];

  return (
    <>
      <div className="col">
        <div className="row">
          {selectedRowKeys.length > -1 && (
            <Typography.Text>
              {selectedRowKeys.length} items selected
            </Typography.Text>
          )}
        </div>
        <div className="row">
          <Table
            pagination={{
              showQuickJumper: false,
              showSizeChanger: true,
              onShowSizeChange: (_current, size) => {
                setPaginationSize(size);
              },
              total: total,
              onChange: (page, _pageSize)=>{
                setPaginationPage(page);
              }
            }}
            rowSelection={rowSelection}
            bordered
            dataSource={products}
            columns={columns}
            loading={isLoading}
            scroll={{
              y: "calc(100vh - 245px)",
            }}
          ></Table>
        </div>
      </div>
      <ModalAddSubProduct
        onAddNew={(values: SubProductModel) => {
          getProducts();
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
