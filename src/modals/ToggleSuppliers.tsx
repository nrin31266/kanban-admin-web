import { Avatar, Button, Form, Input, message, Modal, Select, Typography } from "antd";
import React, { useRef, useState } from "react";
import { colors } from "../configurations/configurations";
import { LuImagePlus } from "react-icons/lu";
import BigDecimal from "js-big-decimal";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (values: any) => void;
  suppliers?: any;
}

const ToggleSuppliers = (props: Props) => {
  const { visible, onClose, onAddNew, suppliers } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [talking, setTalking] = useState<number>(0);
  const [file, setFile] = useState<any>();
  const { Paragraph } = Typography;

  const [form] = Form.useForm();
  const inpRef = useRef<any>();

  const addNewSuppliers = async (values: any) => {
    const data: any = {};

    for(const i in values){
      data[i] = values[i] ?? "";
    }

    data.price = values.price ? new BigDecimal(values.price).getValue() : new BigDecimal(0).getValue();

    data.talking = talking? 'true' : 'false';

    setIsLoading(true);
    try {
      console.log(data);
    } catch (error:any) {
      console.log(error);
      message.error(error.message);
    }finally{
      setIsLoading(false);
    }

  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      loading={isLoading}
      open={props.visible}
      onClose={handleClose}
      onCancel={handleClose}
      title="Add suppliers"
      okText="Add suppliers"
      cancelText="Discard"
      onOk={() => form.submit()}
    >
      <div className="d-none">
        <input
          type="file"
          onChange={(val: any) => setFile(val.target.files[0])}
          id="inpFile"
          ref={inpRef}
          accept="image/*"
        />
      </div>
      <label
        htmlFor="inpFile"
        className="p-2 mb-4 row"
      >
        <div className="text-right col m-0">
        {file ? (
          <Avatar size={100} src={URL.createObjectURL(file)} 
          style={{
            border: "3px solid #E5E5E5",
          }}/>
        ) : (
          <Avatar
            size={100}
            style={{
              backgroundColor: "white",
              border: "2px dashed grey",
            }}
          >
            <LuImagePlus size={50} color={colors.grey600} />
          </Avatar>
        )}
        </div>
        <div className="mt-2 col text-left m-0">
          <Paragraph className="text-muted m-0">Drag image here</Paragraph>
          <Paragraph className="text-muted m-0" style={{ marginBottom: "5px" }}>
            Or
          </Paragraph>
          <Button  type="link" onClick={() => inpRef.current.click()}>
            Browne image
          </Button>
        </div>
      </label>
      <Form
        onFinish={addNewSuppliers}
        layout="horizontal"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        size="large"
      >
        <Form.Item
          name={"name"}
          label={"Suppliers name"}
          rules={[
            {
              required: true,
              message: "The suppliers name must not be left blank!",
            },
          ]}
        >
          <Input placeholder="Enter suppliers name" allowClear={true} />
        </Form.Item>
        <Form.Item name={"product"} label={"Product name"}>
          <Input placeholder="Enter product" allowClear={true} />
        </Form.Item>
        <Form.Item name={"categories"} label={"Category"}>
          <Select options={[]} placeholder="Select product category"></Select>
        </Form.Item>
        <Form.Item name={"price"} label={"Buying Price"}>
          <Input
            placeholder="Enter buying price"
            allowClear={true}
            type="number"
          />
        </Form.Item>
        <Form.Item name={"contact"} label={"Contact Number"}>
          <Input
            placeholder="Enter supplier contact number"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item label={"Talking return type?"}>
          <Button
            className="mr-2"
            onClick={() => setTalking(1)}
            type={talking == 1 ? "primary" : "default"}
            style={{}}
          >
            Talking return
          </Button>
          <Button
            onClick={() => setTalking(2)}
            type={talking == 2 ? "primary" : "default"}
            style={{}}
          >
            Not talking return
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ToggleSuppliers;
