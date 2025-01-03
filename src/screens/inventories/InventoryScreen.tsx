import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Image,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  CategoryModel,
  ProductResponse,
  ProductsFilterValuesRequest,
} from "../../models/Products";
import handleAPI from "../../apis/handleAPI";
import { API, colors } from "../../configurations/configurations";
import { ColumnProps, TableProps } from "antd/es/table";
import { Link, useNavigate } from "react-router-dom";
import { MdLibraryAdd } from "react-icons/md";
import { Edit2, Sort, Trash } from "iconsax-react";
import { TiTick } from "react-icons/ti";
import { PaginationResponseModel } from "../../models/AppModel";
import { replaceName } from "../../utils/replaceName";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { FilterProduct } from "../../components";
import { CategoryResponse } from "../../models/CategoryModel";
import { SupplierResponse } from "../../models/SupplierModel";
const { confirm } = Modal;

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const InventoryScreen = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [productSelected, setProductSelected] = useState<ProductResponse>();
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [paginationSize, setPaginationSize] = useState<number>(10);
  const [allowSelectRows, setAllowSelectRows] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [searchKey, setSearchKey] = useState<string>("");
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [productFilterValues, setProductFilterValues] = useState<ProductsFilterValuesRequest>();
  const navigate = useNavigate();

  useEffect(() => {
    getInitData();
  }, []);
  useEffect(() => {
    setPaginationPage(1);
  }, [paginationSize]);
  useEffect(() => {
    if(isFilter){
      handleOnFilter();
    }else if (searchKey.length >= 4) {
      getProducts(
        `${API.PRODUCTS}/data?title=${searchKey}&page=${paginationPage}&size=${paginationSize}`
      );
    } else {
      getProducts();
    }
  }, [paginationPage, paginationSize, searchKey, productFilterValues]);
  useEffect(() => {}, [selectedRowKeys]);
  const getInitData = async () => {
    setIsInitLoading(true);
    try {
      await getProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setIsInitLoading(false);
    }
  };
  const getProducts = async (api?: string) => {
    if (!api) {
      api = `${API.PRODUCTS}/data?page=${paginationPage}&size=${paginationSize}`;
    }
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      const paginationRes: PaginationResponseModel = res.data.result;

      setTotal(paginationRes.totalElements);
      setProducts(paginationRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnFilter = async () => {
    let requestBody = {...productFilterValues};
    requestBody.size= paginationSize;
    requestBody.page= paginationPage;
    const api = `${API.PRODUCTS_FILTER_VALUES}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api, requestBody, "post");
      const paginationRes: PaginationResponseModel = res.data.result;
      setTotal(paginationRes.totalElements);
      setProducts(paginationRes.data);
      console.log(paginationRes);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  const handleSearchProduct = (key: string) => {
    if (key.trim() === "") {
      return;
    }
    if (key.length < 4) {
      message.warning("Please enter at least 4 characters to search!");
      return;
    }
    let keySearch: string = replaceName(key);
    console.log("Key search:", keySearch);
    if (keySearch === searchKey) {
      return;
    }
    setIsLoading(true);
    setPaginationPage(1);
    setSearchKey(keySearch);
  };
  const handleSoftRemoveProduct = async (productIds: string[]) => {
    setIsLoading(true);
    try {
      const res = await handleAPI(
        `${API.PRODUCTS}/soft-delete`,
        { ids: productIds },
        "put"
      );
      message.success(res.data.message);
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

  const handleSelectAll = async () => {
    setAllowSelectRows(true);
    let api = `${API.PRODUCTS}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      const paginationRes: PaginationResponseModel = res.data.result;
      if (paginationRes.data.length > 0) {
        const listKeys: string[] = paginationRes.data.map(
          (item: ProductResponse) => item.id
        );
        setSelectedRowKeys(listKeys);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUnSearch = () => {
    setIsLoading(true);
    setSearchKey("");
  };
  const rowSelection: TableRowSelection<ProductResponse> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns: ColumnProps<ProductResponse>[] = [
    {
      key: "index",
      dataIndex: undefined,
      width: 60,
      title: "#",
      render: (_, __, index) => {
        return (paginationPage - 1) * paginationSize + (index + 1);
      },
    },
    {
      key: "title",
      dataIndex: "",
      title: "Title",
      width: 190,
      render: (item: ProductResponse) => (
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
              flexWrap: "wrap", 
              gap: "4px", 
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
    // {
    //   key: "categories",
    //   dataIndex: "categoryResponse",
    //   title: "Categories",
    //   width: 300,
    //   render: (categories: CategoryResponse[]) =>
    //     categories &&
    //     categories.length > 0 && (
    //       <div
    //         style={{
    //           display: "flex",
    //           flexWrap: "wrap",
    //           gap: "4px",
    //         }}
    //       >
    //         {categories.map((category: CategoryModel, index) => (
    //           <Link
    //           key={`category${index}${category.id}`}
    //             to={`/categories/detail/${category.slug}?id=${category.id}`}
    //           >
    //             <Tag
    //               style={{
    //                 margin: "0",
    //                 padding: "5px",
    //                 fontSize: "15px",
    //               }}
    //             >
    //               {category.name}
    //             </Tag>
    //           </Link>
    //         ))}
    //       </div>
    //     ),
    // },
    {
      key: 'options',
      title: 'Options list',
      dataIndex: 'options',
      width: 300,
      render: (options: string[])=> options && options.map((option, index)=><Tag key={'option'+ index}>{option}</Tag>)
    },
    // {
    //   key: 'supplier',
    //   title: 'Supplier',
    //   dataIndex: 'supplierResponse',
    //   width: 100,
    //   render: (supplier: SupplierResponse)=> supplier && supplier.photoUrl && <Avatar size={50} src={supplier.photoUrl}/>
    // },
    {
      key: "action",
      dataIndex: "",
      width: 100,
      title: "Action",
      render: (product: ProductResponse) => (
        <Space>
          <Tooltip title={"Add sub product"} key={"addSubProduct"}>
            <Button
              className="p-0"
              size="small"
              type="text"
              onClick={() => {
                navigate(`/inventory/detail/${product.slug}?id=${product.id}`);
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
              <FaEdit className="text-primary" size={20} />
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
                  onOk: () => handleSoftRemoveProduct([product.id]),
                  onCancel: () => console.log("Cancel"),
                });
              }}
            >
              <RiDeleteBin5Fill className="text-danger" size={20} />
            </Button>
          </Tooltip>
        </Space>
      ),
      fixed: "right",
    },
  ];
  return isInitLoading ? (
    <Spin size="large" />
  ) : (
    <>
      <div className="col">
        <div className="row">
          <div className="col text-left">
            <div className="row">
              <Typography.Title  level={4}>
                Products
              </Typography.Title>
              {
                isFilter && 
                <div className="ml-3 d-flex">
                  <Typography.Title type="success" level={4}>Filtered</Typography.Title>
                  <Button type="text" className="p-0" onClick={()=>{
                    setIsFilter(false);
                    setProductFilterValues(undefined);
                  }}>Cancel</Button>
                </div>
              }
            </div>
            <div className="row">
              <Space>
                {
                  <Button
                    type="text"
                    className="text-primary p-0"
                    style={{
                      height: "auto",
                    }}
                    onClick={() => {
                      if (allowSelectRows) {
                        setAllowSelectRows(false);
                        setSelectedRowKeys([]);
                      } else setAllowSelectRows(true);
                    }}
                  >
                    Allow select{" "}
                    {allowSelectRows && (
                      <TiTick className="text-primary p-0" size={15} />
                    )}
                  </Button>
                }
                {selectedRowKeys.length > 0 && (
                  <>
                    <Typography.Text>
                      {selectedRowKeys.length} items selected
                    </Typography.Text>
                    <Tooltip title="Delete products">
                      <Button
                        style={{
                          height: "auto",
                        }}
                        type="text"
                        className="text-danger p-0"
                        onClick={() => {
                          confirm({
                            title: "Confirm",
                            content: "Delete all rows selected?",
                            onCancel: () => console.log("Cancel"),
                            onOk: () => {
                              handleSoftRemoveProduct(
                                selectedRowKeys as string[]
                              );
                              setSelectedRowKeys([]);
                            },
                          });
                        }}
                      >
                        Delete rows selected
                      </Button>
                    </Tooltip>
                  </>
                )}
                {allowSelectRows &&
                  selectedRowKeys.length > -1 &&
                  selectedRowKeys.length < total && (
                    <Button
                      style={{
                        height: "auto",
                      }}
                      className="p-0"
                      type="link"
                      onClick={handleSelectAll}
                    >
                      Select all
                    </Button>
                  )}
              </Space>
            </div>
          </div>
          <div className="col text-right">
            <Space className="mt-2">
              <Input.Search
                allowClear={true}
                onClear={() => {
                  handleUnSearch();
                }}
                placeholder="Search"
                onSearch={(key: string) => {
                  handleSearchProduct(key);
                }}
              />
              <Button type="primary">Add</Button>
              <Dropdown
                trigger={["click"]}
                dropdownRender={(_menu) => (
                  <FilterProduct
                    onFilter={(filterValues: ProductsFilterValuesRequest) => {
                      setPaginationPage(1);
                      setProductFilterValues(filterValues);
                      setIsFilter(true);
                    }}
                  />
                )}
              >
                <Button className="btn-text">
                  Filter <Sort />
                </Button>
              </Dropdown>
            </Space>
          </div>
        </div>
        <div className="row">
          <Table
            rowKey={"id"}
            loading={isLoading}
            size="small"
            pagination={{
              size: "small",
              current: paginationPage,
              showQuickJumper: false,
              showSizeChanger: true,
              pageSizeOptions: [10, 50, 100],
              onShowSizeChange: (_c, size) => {
                setIsLoading(true);
                setPaginationSize(size);
              },
              total: total,
              onChange: (page, _pageSize) => {
                setIsLoading(true);
                setPaginationPage(page);
              },
              pageSize: paginationSize,
            }}
            rowSelection={allowSelectRows ? rowSelection : undefined}
            bordered
            dataSource={products}
            columns={columns}
            scroll={{ x: "max-content", y: "calc(100vh - 250px)" }}
            // scroll={{
            //   y: "calc(100vh - 245px)",
            // }}
          />
        </div>
      </div>
    </>
  );
};

export default InventoryScreen;
