import { Button, message, Modal, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { MdOutlineFilterList } from "react-icons/md";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { RxDownload } from "react-icons/rx";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";
import { FaRegEdit } from "react-icons/fa";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { SupplierModel } from "../models/SupplierModel";
import { ToggleSupplier } from "../modals";
const { Title, Text } = Typography;
const { confirm } = Modal;

const SupplierScreen = () => {
  const [isVisibleToggleSupplies, setIsVisibleToggleSupplies] = useState(false);
  const [suppliersSelected, setSuppliersSelected] = useState<
    SupplierModel | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);

  const columns: ColumnProps<SupplierModel>[] = [
    // Uncomment and adjust if necessary
    // {
    //   key: 'photoUrl',
    //   dataIndex: 'photoUrl',
    //   title: 'Avatar',
    //   render: (url) => url ? <Avatar src={url} size={40}/> : <Avatar size={40}><User size={36}/></Avatar>
    // },
    {
      key: "name",
      dataIndex: "name",
      title: "Name",
    },
    {
      key: "product",
      dataIndex: "product",
      title: "Product",
    },
    {
      key: "price",
      dataIndex: "price",
      title: "Price",
    },
    {
      key: "contact",
      dataIndex: "contact",
      title: "Contact",
    },
    {
      key: "categories",
      dataIndex: "categories",
      title: "Categories",
    },
    {
      key: "email",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "talking",
      dataIndex: "talking",
      title: "Talking",
      render: (isTalking: boolean) => (
        <Text type={isTalking ? "success" : "danger"}>
          {isTalking ? "Talking return" : "Not talking return"}
        </Text>
      ),
    },
    {
      key: "onTheWay",
      dataIndex: "onTheWay",
      title: "On the way",
      render: (num: number) => (num === 0 ? "-" : num),
    },
    {
      key: "buttonContainer",
      title: "Actions",
      render: (item: SupplierModel) => (
        <Space>
          <Button
            onClick={() => {
              setSuppliersSelected(item);
              setIsVisibleToggleSupplies(true);
            }}
            className="text-info"
            type="text"
            icon={<FaRegEdit size={20} />}
          />
          <Button
            onClick={() =>
              confirm({
                title: "Confirm",
                content: `Are you sure you want to remove supplier with name ${item.name}?`,
                onOk: () => {
                  handleRemoveSupplier(item.id);
                },
              })
            }
            className="text-danger"
            type="text"
            icon={<IoPersonRemoveOutline size={20} />}
          />
        </Space>
      ),
      fixed: "right",
    },
  ];

  const getSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await handleAPI(API.GET_SUPPLIERS);
      if (res.data.result) {
        setSuppliers(res.data.result);
      }
    } catch (error: any) {
      message.error(
        error.message || "An error occurred while fetching suppliers."
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  const handleRemoveSupplier = async (supplierId: string) => {
    try {
      const res = await handleAPI(
        API.DELETE_SUPPLIER(supplierId),
        undefined,
        "delete"
      );
      message.info(res.data.message);
      getSuppliers();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <Table
        pagination={{
          pageSize: 10
        }}
        rowKey="id"
        loading={isLoading}
        dataSource={suppliers}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Suppliers</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button
                  icon={<MdOutlineLibraryAdd size={22} />}
                  type="primary"
                  onClick={() => setIsVisibleToggleSupplies(true)}
                >
                  Add supplier
                </Button>
                <Button icon={<MdOutlineFilterList size={22} />}>
                  Filters
                </Button>
                <Button icon={<RxDownload size={22} />}>Download all</Button>
              </Space>
            </div>
          </div>
        )}
      />

      <ToggleSupplier
        visible={isVisibleToggleSupplies}
        onClose={() => {
          if (suppliersSelected) {
            getSuppliers();
          }
          setSuppliersSelected(undefined);
          setIsVisibleToggleSupplies(false);
        }}
        onAddNew={(val) => setSuppliers((prev) => [...prev, val])}
        supplier={suppliersSelected}
      />
    </div>
  );
};

export default SupplierScreen;
