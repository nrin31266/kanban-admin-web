import { Checkbox, Form, Input, Select } from "antd";
import React from "react";
import { FormItemsModel } from "../models/FormModel";

interface Props {
  item: FormItemsModel;
}

const FormItem = (props: Props) => {
  const { item } = props;

  const renderInput = (item: FormItemsModel) =>{
    let content = <></>;

    switch(item.type){
        case 'check-box':
            content = <Checkbox />
            break;
        case 'select': 
            content = <Select placeholder={item.placeholder} options={item.lockupItem}/>
            break;
        default:
            content = <Input type={item.type} placeholder={item.placeholder} />
            break;
    }

    return content;
  };
  return (
    <Form.Item

      key={item.key}
      name={item.value}
      label={item.label}
      valuePropName= {item.type==='check-box'? "checked" : "value"}
      rules={[
        {
          required: item.required,
          message: item.message,
        },
      ]}
    >
      {renderInput(item)}
    </Form.Item>
  );
};

export default FormItem;
