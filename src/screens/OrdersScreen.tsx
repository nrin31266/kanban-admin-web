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
import { Tabs, TabsProps, Typography } from "antd";
import { FormatCurrency } from "../utils/formatNumber";

const OrdersScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PageResponse<OrderResponse>>();
  const pageRef = useRef(1);
  const [keyStatus, setKeyStatus] = useState<string>(Status.PENDING);
  const isInitLoad = useRef(true);

  useEffect(() => {
    if (isInitLoad.current) {
      getData();
      isInitLoad.current = false;
    }
  }, []);

  useEffect(()=>{
    getOrders();
  },[keyStatus])

  const getData = async () => {
    await getOrders();
  };

  const getOrders = async () => {
    setIsLoading(true);
    const urlApi = `${API.ORDERS}/ad?page=${pageRef.current}&status=${keyStatus}`;
    try {
      const res = await handleAPI(urlApi);
      setData(res.data.result);
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
    },]

  const columns: ColumnProps<OrderResponse>[] = [
    {
      title: "#",
      dataIndex: "",
      width: 120,
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
              {keyStatus === Status.PENDING ? "Created" : "Updated"}
              {": "}
            </span>
            <span>
              {keyStatus === Status.PENDING ? item.created : item.updated}
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
      width: 300,
    },
    {
      width: 300,
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
  ];
  // const
  const onChange = (key: string) => {
    pageRef.current = 1;
    setKeyStatus(key);
  };

  return (
    <div>
      <Tabs 
          type="card"
          defaultActiveKey={Status.PENDING}
          items={items}
          onChange={onChange}
        />
      {data && (
        <Table
          rowClassName={() => "custom-row"}
          scroll={{ x: "max-content", y: "calc(100vh - 250px)" }}
          pagination={{
            size: "small",
            current: data.currentPage,
            showQuickJumper: false,
            total: data.totalElements,
            onChange: (page, _pageSize) => {
              console.log(page);
            },
            pageSize: data.pageSize,
          }}
          loading={isLoading}
          columns={columns}
          dataSource={data.data}
        ></Table>
      )}
    </div>
  );
};

export default OrdersScreen;
