import { Button, message, Modal, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { MdOutlineFilterList, MdOutlineLibraryAdd } from "react-icons/md";
import { RxDownload } from "react-icons/rx";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";
import { ToggleSupplier } from "../modals";
import { SupplierModel } from "../models/SupplierModel";
import { FormModel } from "./../models/FormModel";
const { Title, Text } = Typography;
const { confirm } = Modal;

const SupplierScreen = () => {
  const [isVisibleToggleSupplies, setIsVisibleToggleSupplies] = useState(false);
  const [suppliersSelected, setSuppliersSelected] = useState<
    SupplierModel | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [ColumnProps, setColumnProps] = useState<any[]>([]);
  const [forms, setForms] = useState<FormModel>();

  // const columns: ColumnProps<SupplierModel>[] = [
  //   {
  //     title: "#",
  //     align: "center",
  //     render: (_, __, index) => (page - 1) * size + index + 1,
  //   },
  //   {
  //     dataIndex: "name",
  //     title: "Name",
  //     key: "name",
  //   },
  //   {
  //     key: "product",
  //     dataIndex: "product",
  //     title: "Product",
  //   },
  //   {
  //     key: "price",
  //     dataIndex: "price",
  //     title: "Price",
  //   },
  //   {
  //     key: "contact",
  //     dataIndex: "contact",
  //     title: "Contact",
  //   },
  //   {
  //     key: "categories",
  //     dataIndex: "categories",
  //     title: "Categories",
  //   },
  //   {
  //     key: "email",
  //     dataIndex: "email",
  //     title: "Email",
  //   },
  //   {
  //     key: "talking",
  //     dataIndex: "talking",
  //     title: "Talking",
  //     render: (isTalking: boolean) => (
  //       <Text type={isTalking ? "success" : "danger"}>
  //         {isTalking ? "Talking return" : "Not talking return"}
  //       </Text>
  //     ),
  //   },
  //   {
  //     key: "onTheWay",
  //     dataIndex: "onTheWay",
  //     title: "On the way",
  //     render: (num: number) => (num === 0 ? "-" : num),
  //   },
  //   {
  //     key: "buttonContainer",
  //     title: "Actions",
  //     render: (item: SupplierModel) => (
  //       <Space>
  //         <Button
  //           onClick={() => {
  //             setSuppliersSelected(item);
  //             setIsVisibleToggleSupplies(true);
  //           }}
  //           className="text-info"
  //           type="text"
  //           icon={<FaRegEdit size={20} />}
  //         />
  //         <Button
  //           onClick={() =>
  //             confirm({
  //               title: "Confirm",
  //               content: `Are you sure you want to remove supplier with name ${item.name}?`,
  //               onOk: () => {
  //                 handleRemoveSupplier(item.id);
  //               },
  //             })
  //           }
  //           className="text-danger"
  //           type="text"
  //           icon={<IoPersonRemoveOutline size={20} />}
  //         />
  //       </Space>
  //     ),
  //     fixed: "right",
  //   },
  // ];
  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    getSuppliers();
  }, [page, size]);

  useEffect(() => {
    if (forms?.formItems?.length) {
      const items: ColumnProps<SupplierModel>[] = [
        {
          title: "#",
          dataIndex: 'index',
          key:'index',
          align: "center",
          render: (_, __, index) => (page - 1) * size + index + 1,
        },
        ...forms.formItems.map((item) => ({
          key: item.key,
          dataIndex: item.value,
          title: item.label,
        })),
      ];

      setColumnProps(items);
    } 
  }, [forms, page, size]);

  const getInitData = async () => {
    setIsLoading(true);
    try {
      // await getSuppliers();
      await getForms();
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuppliers = async () => {
    try {
      const res = await handleAPI(API.GET_SUPPLIERS(page, size));
      if (res.data.result.data) {
        console.log(res.data);
        setTotal(res.data.result.totalElements);
        setSuppliers(res.data.result.data);
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }
  };

  const getForms = async () => {
    const res = await handleAPI(API.GET_FORM);
    setForms(res.data.result);
    console.log(res.data);
  };

  const handleRemoveSupplier = async (supplierId: string) => {
    try {
      const res = await handleAPI(
        API.DELETE_SUPPLIER(supplierId),
        undefined,
        "delete"
      );
      res.data.result
        ? message.success(res.data.message)
        : message.error(res.data.message);
      getSuppliers();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <Table
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setSize(size);
          },
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
          },
        }}
        scroll={{
          y: "calc(100vh - 330px)",
        }}
        rowKey="id"
        loading={isLoading}
        dataSource={suppliers}
        columns={ColumnProps}
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
        onAddNew={() =>
          // setSuppliers((prev) => [...prev, val]),
          getSuppliers()
        }
        supplier={suppliersSelected}
      />
    </div>
  );
};

export default SupplierScreen;
