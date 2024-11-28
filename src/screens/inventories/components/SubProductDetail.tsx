import {
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
import { ModalAddSubProduct } from "../../../modals";
import { ProductResponse, SubProductResponse } from "../../../models/Products";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FormatCurrency } from "../../../utils/formatNumber";
import { ColumnProps } from "antd/es/table";
import { API } from "../../../configurations/configurations";
import handleAPI from "../../../apis/handleAPI";

interface Props {
  product: ProductResponse;
}

const SubProductDetail = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [subProducts, setSubProducts] = useState<SubProductResponse[]>();
  const [isVisibleModalAddSubProduct, setIsVisibleModalAddSubProduct] =
    useState(false);
  const [subProductSelected, setSubProductSelected] =
    useState<SubProductResponse>();
    const { product } = props;

    useEffect(() => {
      if(product){
        getSubProducts();
      }
    }, [product]);

  useEffect(() => {
    if (subProductSelected) {
      setIsVisibleModalAddSubProduct(true);
    }
  }, [subProductSelected]);

  
  const getSubProducts = async () => {
    const api = API.PRODUCT_DETAIL(product.id);
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
        if (discount) {
          return FormatCurrency.VND.format(discount);
        } else {
          return "N/A";
        }
      },
    },
    {
      key: "quantity",
      dataIndex: "quantity",
      title: "Quantity",
    },
    {
      key: "options",
      dataIndex: "options",
      title: "Options",
      render: (options: any) => {
        if (product && product.options && product.options.length > 0) {
          return product.options.map((option) => {
            const value = options[option];
            if (value) {
              return option === "Color" ? (
                <div className="d-flex">
                  <strong>{option}:</strong>
                  <div
                    style={{ width: 30, height: 30, backgroundColor: value }}
                  ></div>
                  {value}
                </div>
              ) : (
                <div key={option}>
                  <strong>{option}:</strong>

                  <Tag>{value}</Tag>
                </div>
              );
            }
            return <span key={option}>No values for {option}</span>;
          });
        }
        return <span>No options available</span>;
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
  return (
    <div>
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
      <ModalAddSubProduct
        product={product}
        onClose={() => {
          setIsVisibleModalAddSubProduct(false);
          setSubProductSelected(undefined);
        }}
        visible={isVisibleModalAddSubProduct}
        subProduct={subProductSelected}
        onFinish={() => {
          setSubProductSelected(undefined);
          getSubProducts();
        }}
      />
    </div>
  );
};

export default SubProductDetail;
