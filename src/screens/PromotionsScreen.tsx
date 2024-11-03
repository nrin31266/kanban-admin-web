import { Avatar, Button, message, Modal, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import PromotionModal from "../modals/PromotionModal";
import Table, { ColumnProps } from "antd/es/table";
import { PromotionResponse } from "../models/PromotionModel";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";
import { ApiResponse, PageResponse, SoftDeleteRequest } from "../models/AppModel";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

const PromotionsScreen = () => {
  const [isVisibleAddPromotionModal, setIsVisibleAddPromotionModal] =
    useState(false);
  const [isInitLoading, setIsInitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promotions, setPromotions] = useState<PromotionResponse[]>();
  const [promotionSelected, setPromotionSelected] =
    useState<PromotionResponse>();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { confirm } = Modal;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsInitLoading(true);
    await getPromotions();
    setIsInitLoading(false);
  };

  const getPromotions = async () => {
    setIsLoading(true);
    const api = `${API.PROMOTIONS}?page=${page}&size=${size}`;
    try {
      const res = await handleAPI(api);
      const response: ApiResponse<PageResponse<PromotionResponse>> = res.data;
      setPromotions(response.result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSoftDelete = async (id: string[]) => {
    setIsLoading(true);
    const api = `${API.PROMOTIONS}/soft-delete`;
    const req: SoftDeleteRequest = {ids: id}; 
    try {
      await handleAPI(api, req, 'put');
      message.success('Deleted');
      getPromotions();
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<PromotionResponse>[] = [
    {
      key: "image",
      dataIndex: "imageUrl",
      title: "Image",
      width: 80,
      render: (imageUrl: string) =>
        imageUrl ? (
          <div>
            <Avatar shape="square" size={50} src={imageUrl} />
          </div>
        ) : (
          <Typography.Title level={4} type="secondary">
            N/A
          </Typography.Title>
        ),
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      key: "code",
      dataIndex: "code",
      title: "CODE",
    },
    {
      key: "quantity",
      dataIndex: "quantity",
      title: "Availability",
    },
    {
      key: "discountType",
      dataIndex: "discountType",
      title: "Discount type",
    },
    {
      key: "value",
      dataIndex: "value",
      title: "Value",
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "",
      align: "right",
      fixed: "right",
      render: (promotion: PromotionResponse) => (
        <div>
          <Space>
            <Button
              className="p-0"
              type="text"
              icon={
                <RiDeleteBin5Fill
                  className="text-danger"
                  size={20}
                  onClick={() => {
                    confirm({
                      title: "CONFIRM",
                      content: "Are you sure want delete this promotion?",
                      onOk: () => {
                        handleSoftDelete([promotion.id]);
                      },
                    });
                  }}
                />
              }
            ></Button>
            <Button
              onClick={() => {
                setPromotionSelected(promotion);
                setIsVisibleAddPromotionModal(true);
              }}
              className="p-0"
              type="text"
              icon={<FaEdit className="text-primary" size={20} />}
            ></Button>
          </Space>
        </div>
      ),
    },
  ];
  return isInitLoading ? (
    <Spin />
  ) : (
    <div>
      <Button onClick={() => setIsVisibleAddPromotionModal(true)}>Open</Button>
      <div>
        <Table loading={isLoading} dataSource={promotions} columns={columns}></Table>
      </div>

      <PromotionModal
        promotion={promotionSelected}
        onFinish={(values) => {
          console.log(values);
          setPromotionSelected(undefined);
          getPromotions();
        }}
        onClose={() => {
          setIsVisibleAddPromotionModal(false);
          setPromotionSelected(undefined);
        }}
        visible={isVisibleAddPromotionModal}
      />
    </div>
  );
};

export default PromotionsScreen;
