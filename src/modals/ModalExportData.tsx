import { Button, DatePicker, Divider, List, message, Modal, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FormModel } from "../models/FormModel";
import handleAPI from "../apis/handleAPI";
import Checkbox from "antd/es/checkbox/Checkbox";
import { handleExportToExcel } from "../utils/handleExportToExcel";


interface Props {
  visible: boolean;
  onClose: () => void;
  name?: string;
  api: string;
}
const { RangePicker } = DatePicker;

const ModalExportData = (props: Props) => {
  const { visible, onClose, api, name } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormModel>();
  const [isGetting, setIsGetting] = useState(false);
  const [checkedValue, setCheckedValue] = useState<string[]>([]);
  const [timeSelected, setTimeSelected] = useState<string>("all");
  const [datesExport, setDatesExport] = useState<{
    start: string;
    end: string;
  }>({
    start: "",
    end: "",
  });

  useEffect(() => {
    if (visible) {
      getForm();
    }
  }, [visible, api]);

  const getForm = async () => {
    setIsGetting(true);
    const url = `${api}/form`;
    try {
      const res = await handleAPI(url);
      res.data.result && setForm(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGetting(false);
    }
  };

  const changeTimeSelected = () => {
    if (timeSelected === "all") {
      setTimeSelected("range");
    } else {
      setTimeSelected("all");
      datesExport && setDatesExport({ start: "", end: "" });
    }
  };

  const handleChangeCheckedValue = (val: string) => {
    const items = [...checkedValue];
    const index = items.findIndex((element) => element === val);
    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(val);
    }
    setCheckedValue(items);
  };
  const rangePickerRef = useRef<any>(null);
  let url = "";
  const handleExport = async () => {
    if (timeSelected === "range") {
      if (datesExport.start && datesExport.end) {
        url = `${api}/export-data?start=${datesExport.start}&end=${datesExport.end}`;
        console.log(url);
      } else {
        message.error("Please select days export!");
        if (rangePickerRef.current) {
          rangePickerRef.current.focus();
        }
        return;
      }
    } else {
      url = `${api}/export-data`;
    }
    if (Object.keys(checkedValue).length > 0) {
      setIsLoading(true);
      const data: { checkedValue: string[] } = {
        checkedValue: checkedValue,
      };
      try {
        const res = await handleAPI(url, data, "post");
        
        res.data.result && await handleExportToExcel(res.data.result, 'name');

        handleOnClose();

      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error("Please select at least 1 field to export!");
    }
  };

  const handleOnClose = () => {
    setCheckedValue([]);
    setTimeSelected("all");
    setDatesExport({ start: "", end: "" });
    onClose();
  };

  return (
    <Modal
      loading={isGetting}
      open={visible}
      onCancel={handleOnClose}
      onClose={handleOnClose}
      onOk={handleExport}
      okButtonProps={{
        loading: isLoading,
      }}
      title={"Export to Excel"}
    >
      <div className="mb-2">
        <Checkbox
          checked={timeSelected === "all"}
          onChange={(_val) => changeTimeSelected()}
        >
          Get all
        </Checkbox>
        <div className="mt-2">
          <Checkbox
            checked={timeSelected === "range"}
            onChange={(_val) => changeTimeSelected()}
          >
            Date range
          </Checkbox>
          {timeSelected === "range" && (
            <Space>
              <RangePicker
                ref={rangePickerRef}
                key={"range"}
                onChange={(val: any) =>
                  val
                    ? setDatesExport({
                        start: val[0],
                        end: val[1],
                      })
                    : setDatesExport({ start: "", end: "" })
                }
              ></RangePicker>
            </Space>
          )}
        </div>
      </div>
      
      <div
        className=""
        style={{
          height: "300px",
          overflowY: "scroll",
          border: '1px solid #ECECEC',
          padding: '0px 8px'
        }}
      >
        <List
          dataSource={form?.formItems}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <Checkbox
                checked={checkedValue.includes(item.value)}
                onChange={() => handleChangeCheckedValue(item.value)}
              >
                {item.label}
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ModalExportData;
