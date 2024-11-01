import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../../configurations/configurations";
import handleAPI from "../../apis/handleAPI";
import {
  Button,
  Empty,
  Image,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  ProductResponse,
  SubProductRequest,
  SubProductResponse,
} from "../../models/Products";
import { ColumnProps } from "antd/es/table";
import { getDownloadURL } from "firebase/storage";
import { FormatCurrency } from "../../utils/formatNumber";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ModalAddSubProduct from "./../../modals/ModalAddSubProduct";

const ProductDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitLoading, setIsInitLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<ProductResponse>();
  const productId = searchParams.get("id");
  const [subProducts, setSubProducts] = useState<SubProductResponse[]>();
  const [isVisibleModalAddSubProduct, setIsVisibleModalAddSubProduct] =
    useState<boolean>(false);
  const [subProductSelected, setSubProductSelected] =
    useState<SubProductResponse>();

  useEffect(() => {
    if (productId) {
      getInitData();
    }
  }, []);
  useEffect(() => {
    if (subProductSelected) {
      setIsVisibleModalAddSubProduct(true);
    }
  }, [subProductSelected]);

  const handleSoftRemoveSubProduct = async (subProductId: string[]) => {
    setIsLoading(true);
    try {
      const res = await handleAPI(
        `${API.SUB_PRODUCTS}/soft-delete`,
        { ids: subProductId },
        "put"
      );
      message.success("Deleted!");
      getSubProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitData = async () => {
    setIsInitLoading(true);
    await getProductDetail();
    await getSubProducts();
    setIsInitLoading(false);
  };

  const getProductDetail = async () => {
    const api = `${API.PRODUCTS}/${productId}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setProduct(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubProducts = async () => {
    if (!productId) {
      return;
    }
    const api = API.PRODUCT_DETAIL(productId);
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setSubProducts(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleUpdateSubProduct = async (
  //   subProductRequest: SubProductRequest,
  //   subProductId: string
  // ) => {
  //   const api = `${API.SUB_PRODUCTS}/${subProductId}`;
  //   setIsLoading(true);
  //   try {
  //     const res = await handleAPI(api, subProductRequest, "put");
  //     message.success("Update successfully!");
  //     getSubProducts();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const columns: ColumnProps<SubProductResponse>[] = [
    {
      key: "images",
      dataIndex: "images",
      title: "Images",
      render: (imageUrls: []) => {
        if (!imageUrls) {
          return (
            <Typography.Title level={5} type="secondary">
              No image
            </Typography.Title>
          );
        }
        return (
          <div>
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                style={{ width: "100px", height: "100px", margin: "5px" }}
              />
            ))}
          </div>
        );
      },
    },
    {
      key: "price",
      dataIndex: "price",
      title: "Price",
      render: (price: number) => {
        return FormatCurrency.VND.format(price);
      },
    },
    {
      key: "discount",
      dataIndex: "discount",
      title: "Discount",
      render: (discount: number) => {
        if(discount){
          return FormatCurrency.VND.format(discount);
        }else{
          return 'N/A';
        }
        
      },
    },
    {
      key: "quantity",
      dataIndex: "quantity",
      title: "Quantity",
    },
    {
      key: "size",
      dataIndex: "size",
      title: "Size",
      render: (size) => {
        if (!size) {
          return (
            <Typography.Title level={5} type="secondary">
              No size
            </Typography.Title>
          );
        }
        return <Tag>{size}</Tag>;
      },
      align: "center",
    },
    {
      key: "color",
      dataIndex: "color",
      title: "Color",
      align: "center",
      render: (color) => {
        if (!color) {
          return (
            <Typography.Title level={5} type="secondary">
              No color
            </Typography.Title>
          );
        }
        return (
          <div className="d-flex">
            <div className="div-color-50" style={{ backgroundColor: color }} />
            {color}
          </div>
        );
      },
    },
    {
      key: "action",
      dataIndex: "",
      title: "Actions",
      fixed: "right",
      render: (item: SubProductResponse) => (
        <Space>
          <Tooltip title={"Edit sub product"} key={"btnEdit"}>
            <Button
              className="p-0"
              size="small"
              type="text"
              onClick={() => {
                setSubProductSelected(item);
              }}
            >
              <FaEdit className="text-primary" size={20} />
            </Button>
          </Tooltip>
          <Tooltip title={"Delete sub product"} key={"btnDelete"}>
            <Button className="p-0" size="small" type="text" onClick={() => {}}>
              <RiDeleteBin5Fill
                className="text-danger"
                size={20}
                onClick={() => {
                  {
                    Modal.confirm({
                      title: "Confirm",
                      content: "Do you really want to remove this sub product?",
                      onOk: () => {
                        handleSoftRemoveSubProduct([item.id]);
                      },
                      onClose: () => console.log(item.id),
                    });
                  }
                }}
              />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return isInitLoading ? (
    <Spin />
  ) : product ? (
    <>
      <div
        className="container-fluid"
        style={{ backgroundColor: "", width: "96%", height: "96%" }}
      >
        <Typography.Title className="mb-0">
          Product: {product.title}
        </Typography.Title>
        <div className="row">
          <div className="col">
            <Typography.Title level={4} className="mt-0" type="secondary">
              Sub product
            </Typography.Title>
          </div>
          <div className="col text-right">
            <Tooltip title={"Add sub product"} key={"addSubProduct"}>
              <Button
                className=""
                size="small"
                type="primary"
                onClick={() => {
                  setIsVisibleModalAddSubProduct(true);
                }}
              >
                Add sub product
              </Button>
            </Tooltip>
          </div>
        </div>

        <Table
          bordered
          loading={isLoading}
          dataSource={subProducts}
          columns={columns}
        />
      </div>
      <ModalAddSubProduct
      product={product}
        onClose={() => {
          setIsVisibleModalAddSubProduct(false);
          setSubProductSelected(undefined);
        }}
        visible={isVisibleModalAddSubProduct}
        subProduct={subProductSelected}
        onUpdated={() => {
          setSubProductSelected(undefined);
          getSubProducts();
        }}
      />
    </>
  ) : (
    <Empty />
  );
};

export default ProductDetail;
