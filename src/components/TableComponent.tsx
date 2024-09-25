import React, { useEffect, useState } from "react";
import { FormModel } from "../models/FormModel";
import { Button, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import { MdOutlineFilterList, MdOutlineLibraryAdd } from "react-icons/md";
import { RxDownload } from "react-icons/rx";
import { Resizable } from "re-resizable";
import { ModalExportData } from "../modals";

interface Props {
  forms: FormModel;
  loading?: boolean;
  records: any[];
  onPageChange: (val: { page: number; size: number }) => void;
  onAddNew: () => void;
  scrollHeight?: string;
  total?: number;
  extraColumns?: (item: any) => any;
  api: string;
}

const TableComponent = (props: Props) => {
  const {
    forms,
    loading,
    records,
    onPageChange,
    onAddNew,
    scrollHeight,
    total,
    extraColumns,
    api,
  } = props;

  const [pageInfo, setPageInfo] = useState<{
    page: number;
    size: number;
  }>({
    page: 1,
    size: 10,
  });

  const [columns, setColumns] = useState<ColumnProps<any>[]>([]);

  const { Title } = Typography;

  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);

  useEffect(() => {
    if (forms?.formItems?.length) {
      const items: ColumnProps<any>[] = [
        {
          title: "#",
          dataIndex: "index",
          width: 100,

          key: "index",
          render: (_, __, index) =>
            (pageInfo.page - 1) * pageInfo.size + index + 1,
        },
        ...forms.formItems.map((item) => ({
          key: item.key,
          dataIndex: item.value,
          title: item.label,
          width: item.displayLength,
          render: (value: any) => {
            if (typeof value === "boolean") {
              return value ? (
                <div
                  style={{
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    backgroundColor: "green",
                  }}
                ></div>
              ) : (
                <div
                  style={{
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                  }}
                ></div>
              );
            }
            return value;
          },
        })),
      ];
      if (extraColumns) {
        items.push({
          title: "Actions",
          width: 100,
          key: "actions",
          align: "center",
          render: (item: any) => extraColumns(item),
          fixed: "right",
        });
      }
      setColumns(items);
    }
  }, [forms, records]);

  const RenderTitle = (props: any) => {
    const { children, ...restProps } = props;
    return (
      <th {...restProps} style={{ padding: "6px 6px" }}>
        <Resizable
          onResizeStop={(_e, _direction, _ref, d) => {
            const item = columns.find(
              (element) => element.title === children[1]
            );
            if (item) {
              const items = [...columns];
              const newWidth = (item.width as number) + d.width;
              const index = columns.findIndex(
                (element) => element.key === item.key
              );
              if (index !== -1) {
                items[index].width = newWidth;
              }
              setColumns(items);
            }
          }}
          enable={{ right: true }}
        >
          {children}
        </Resizable>
      </th>
    );
  };
  const [isVisibleModalExport, setIsVisibleModalExport] = useState(false);

  return (
    <>
      <Table
        style={{
          padding: '5px 0px'
        }}
        components={{
          header: {
            cell: RenderTitle,
          },
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageInfo((prev) => ({
              ...prev,
              size: size,
            }));
          },
          total: total,
          onChange: (page, pageSize) => {
            setPageInfo((prev) => ({
              ...prev,
              page: page,
              size: pageSize,
            }));
          },
        }}
        scroll={{
          y: scrollHeight ?? "calc(100vh - 250px)",
        }}
        bordered
        rowKey="key"
        loading={loading}
        dataSource={records}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>{forms.title}</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button
                  icon={<MdOutlineLibraryAdd size={22} />}
                  type="primary"
                  onClick={onAddNew}
                >
                  Add supplier
                </Button>
                <Button icon={<MdOutlineFilterList size={22} />}>
                  Filters
                </Button>
                <Button icon={<RxDownload size={22}/>} onClick={()=> setIsVisibleModalExport(true)}>Export to Excel</Button>
              </Space>
            </div>
          </div>
        )
        }/>
      <ModalExportData 
        visible={isVisibleModalExport} 
        onClose={()=>setIsVisibleModalExport(false)} 
        api={api}
        name={api}
        />  
    </>
  );
};

export default TableComponent;
