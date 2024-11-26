import React, { useEffect, useRef, useState } from "react";
import {
  OrderProductResponse,
  OrderResponse,
  Status,
  StatusDetails,
} from "../models/PaymentModel";
import { API } from "../configurations/configurations";
import handleAPI from "../apis/handleAPI";
import { PageResponse } from "../models/AppModel";
import Table, { ColumnProps } from "antd/es/table";
import { Button, message, Tabs, TabsProps, Typography } from "antd";
import { FormatCurrency } from "../utils/formatNumber";
import LoadingComponent from "../components/LoadingComponent";
import { colors } from "../constants/listColors";

const OrdersScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<PageResponse<OrderResponse>>({
    data: [],
    currentPage: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
  });
  const pageRef = useRef(1);
  const [keyStatus, setKeyStatus] = useState<string>(Status.PENDING);
  const isInitLoad = useRef(true);
  const [isInitLoading, setIsInitLoading] = useState(false);

  // useEffect(() => {
  //   if (isInitLoad.current) {
  //     getData();
  //     isInitLoad.current = false;
  //   }
  // }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Nếu là lần render đầu tiên, bỏ qua việc gọi API
      isFirstRender.current = false;
    } else {
      // Nếu không phải lần render đầu tiên, gọi API
      getOrders();
    }
  }, [keyStatus]);

  const getData = async () => {
    setIsInitLoading(true);
    await getOrders();
    setIsInitLoading(false);
  };

  const getOrders = async (page?: number) => {
    setIsLoading(true);
    const pageNow = page ?? pageRef.current;
    const urlApi = `${API.ORDERS}/ad?page=${pageNow}&status=${keyStatus}`;
    try {
      const res = await handleAPI(urlApi);
      setPageData(res.data.result);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const items: TabsProps["items"] = [
    {
      key: Status.PENDING,
      label: "Pending",
    },
    {
      key: Status.CONFIRMED,
      label: "Confirmed",
    },
    {
      key: Status.SHIPPING,
      label: "Shipping",
    },
    {
      key: Status.DELIVERED,
      label: "Delivered",
    },
    {
      key: Status.COMPLETED,
      label: "Completed",
    },
    {
      key: Status.CANCELLED,
      label: "Cancelled",
    },
    {
      key: Status.RETURNS,
      label: "Returns",
    },
    {
      key: Status.DENY,
      label: "Deny",
    },
  ];

  const updateOrderStatus = async (status: string, orderId: string) => {
    const api = `${API.ORDERS}/status/${status}/${orderId}`;
    setIsLoading(true);
    try {
      await handleAPI(api, undefined, "put");
      const newData = pageData.data.filter((item) => item.id !== orderId);
      if (newData.length === 0) {
        await getOrders(1);
      } else {
        setPageData((pre) => ({ ...pre, data: newData }));
      }
      message.success("Ok");
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<OrderResponse>[] = [
    {
      title: "#",
      dataIndex: "",
      width: 180,
      render: (item: OrderResponse) => (
        <div>
          <div
            style={{
              background: `rgba(${parseInt(
                StatusDetails[keyStatus].color.slice(1, 3),
                16
              )}, ${parseInt(
                StatusDetails[keyStatus].color.slice(3, 5),
                16
              )}, ${parseInt(
                StatusDetails[keyStatus].color.slice(5, 7),
                16
              )}, 0.1)`,
              border: `1px solid ${StatusDetails[keyStatus].color}`, // Giữ nguyên màu viền
              width: "max-content",
              padding: "0 0.3rem",
              borderRadius: "4px", // Tùy chọn, để các góc mềm mại
            }}
          >
            <span>{StatusDetails[keyStatus].label}</span>
          </div>
          <div>
            <span>
              {'Created: '}
            </span>
            <span>
              {item.created}
            </span>
          </div>
          <div>
            <span>
              {'Updated: '}
            </span>
            <span>
              {item.updated}
            </span>
          </div>
          <div>
            <span>Amount: </span>
            <span style={{ fontWeight: "500", fontSize: "1rem" }}>
              {FormatCurrency.VND.format(item.amount)}
            </span>
          </div>
          <div>
            <span>Payment method: </span>
            <span>{item.paymentMethod}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Personal information",
      dataIndex: "orderProductResponses",
      render: (orderProducts: OrderProductResponse[]) => (
        <div>
          {orderProducts &&
            orderProducts.length &&
            orderProducts.map((item, index) => (
              <div style={{ padding: "0.1rem", display: "flex" }} key={item.id}>
                <img
                  style={{ border: "1px solid silver" }}
                  width={50}
                  src={item.imageUrl}
                  alt=""
                />
                <div>
                  <div>
                    <Typography.Text className="order-item-title">
                      {item.name}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text style={{ fontWeight: "500" }}>
                      {"x"}
                      {item.count}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ),
      width: 400,
    },
    {
      width: 400,
      title: "Personal information",
      dataIndex: "",
      render: (order: OrderResponse) => (
        <div>
          <div>
            <span>Name: </span>
            <span>{order.customerName}</span>
          </div>
          <div>
            <span>Phone: </span>
            <span>{order.customerPhone}</span>
          </div>
          <div>
            <span>Address: </span>
            <span>{order.customerAddress}</span>
          </div>
          <div>
            <span>Phone: </span>
            <span>{order.customerPhone}</span>
          </div>
          <div>
            <span>Email: </span>
            <span>{order.customerEmail}</span>
          </div>
        </div>
      ),
    },
    {
      dataIndex: "",
      title: "Actions",
      render: (item: OrderResponse) => (
        <div>
          <div className="mb-2">
            <Button
              className="m-1"
              hidden={keyStatus !== Status.PENDING}
              onClick={() => {
                updateOrderStatus(Status.CONFIRMED, item.id);
              }}
              style={{ backgroundColor: colors[3] }}
            >
              Confirm
            </Button>
            <Button
              hidden={keyStatus === Status.DENY}
              onClick={() => {
                updateOrderStatus(Status.DENY, item.id);
              }}
              className="btn-danger m-1"
              size="small"
            >
              Deny
            </Button>
          </div>
          <div>
            <Button
              hidden={keyStatus === Status.PENDING}
              onClick={() => {
                updateOrderStatus(Status.PENDING, item.id);
              }}
              className="m-1"
              size="small"
            >
              Pending
            </Button>
            <Button
              hidden={keyStatus === Status.SHIPPING}
              onClick={() => {
                updateOrderStatus(Status.SHIPPING, item.id);
              }}
              className="m-1"
              size="small"
            >
              Shipping
            </Button>
            <Button
              hidden={keyStatus === Status.DELIVERED}
              onClick={() => {
                updateOrderStatus(Status.DELIVERED, item.id);
              }}
              className="m-1"
              size="small"
            >
              Delivered
            </Button>
            <Button
              hidden={keyStatus === Status.CANCELLED}
              onClick={() => {
                updateOrderStatus(Status.CANCELLED, item.id);
              }}
              className="m-1"
              size="small"
            >Cancel</Button>
            <Button
              hidden={keyStatus === Status.COMPLETED}
              onClick={() => {
                updateOrderStatus(Status.COMPLETED, item.id);
              }}
              className="m-1"
              size="small"
            >
              Completed
            </Button>
            <Button
              hidden={keyStatus === Status.RETURNS}
              onClick={() => {
                updateOrderStatus(Status.RETURNS, item.id);
              }}
              className="m-1"
              size="small"
            >
              Give back
            </Button>
          </div>
        </div>
      ),
      fixed: "right",
      width: 250,
    },
  ];
  // const
  const onChange = (key: string) => {
    pageRef.current = 1;
    setKeyStatus(key);
  };

  return isInitLoading ? (
    <LoadingComponent />
  ) : (
    <div>
      <Tabs
        type="card"
        defaultActiveKey={Status.PENDING}
        items={items}
        onChange={onChange}
      />
      {pageData && (
        <Table
          rowClassName={() => "custom-row"}
          scroll={{ x: "max-content", y: "calc(100vh - 250px)" }}
          pagination={{
            size: "small",
            current: pageData.currentPage,
            showQuickJumper: false,
            total: pageData.totalElements,
            onChange: (page, _pageSize) => {
              getOrders(page);
            },
            pageSize: pageData.pageSize,
          }}
          loading={isLoading}
          columns={columns}
          dataSource={pageData.data}
        ></Table>
      )}
    </div>
  );
};

export default OrdersScreen;
