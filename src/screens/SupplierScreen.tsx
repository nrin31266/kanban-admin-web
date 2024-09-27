import { Button, message, Modal, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";
import { ToggleSupplier } from "../modals";
import { SupplierModel } from "../models/SupplierModel";
import { FormModel } from "./../models/FormModel";
import TableComponent from "../components/TableComponent";
import { FiUserX } from "react-icons/fi";
import { FiEdit3 } from "react-icons/fi";
const { confirm } = Modal;

const SupplierScreen = () => {
  const [isVisibleToggleSupplies, setIsVisibleToggleSupplies] = useState(false);
  const [suppliersSelected, setSuppliersSelected] = useState<
    SupplierModel | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [pageInfo, setPageInfo] = useState<{
    size: number;
    page: number; 
  }>({
    page: 1,
    size: 10,
  });
  const [total, setTotal] = useState<number>(10);
  const [forms, setForms] = useState<FormModel>();

  // const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const p = searchParams.get('page');
  // const s = searchParams.get('size');
  


  useEffect(() => {
    getInitData();
  }, []);

  // useEffect(() => {
  //   console.log(isLoading);
  // }, [isLoading]);

  useEffect(() => {
    getSuppliers();
  }, [pageInfo]);

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
    setIsLoading(true);
    try {
      const res = await handleAPI(API.GET_SUPPLIERS(pageInfo.page, pageInfo.size));
      if (res.data.result.data) {
        setTotal(res.data.result.totalElements);
        setSuppliers(res.data.result.data);
      }  
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }finally{
      setIsLoading(false);
    }
  };

  const getForms = async () => {
    const res = await handleAPI(API.FORM_SUPPLIERS);
    setForms(res.data.result);
  };

  const handleRemoveSupplier = async (supplierId: string) => {
    try {
      const res = await handleAPI(
        API.DELETE_SUPPLIER(supplierId), undefined, "delete"
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
      {forms && (
        <TableComponent
          api={API.SUPPLIER}
          onPageChange={(val) => {
            // navigate(`?page=${val.page}&size=${val.size}`)
            setPageInfo(val);
          }}
          onAddNew={() => setIsVisibleToggleSupplies(true)}
          total={total}
          loading={isLoading}
          forms={forms}
          records={suppliers}
          extraColumns = {(item)=>
            <Space>
              <Button
                onClick={() => {
                  setSuppliersSelected(item);
                  setIsVisibleToggleSupplies(true);
                }}
                className="text-info"
                type="text"
                icon={<FiEdit3 size={20} />}
              />
              <Button
                onClick={() =>
                  confirm({
                    title: "Confirm",
                    content: `Are you sure you want to remove supplier?`,
                    onOk: () => {
                      handleRemoveSupplier(item.id);
                    },
                  })
                }
                className="text-danger"
                type="text"
                icon={<FiUserX size={20} />}
              />
            </Space>
          }/>
      )}
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
