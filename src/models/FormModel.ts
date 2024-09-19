import { FormLayout } from "antd/es/form/Form";

export interface FormModel {
  title: string;
  layout?: FormLayout;
  labelCol: number;
  wrapperCol: number;
  formItems: FormItemsModel[];
}

export interface FormItemsModel {
  key: string;
  value: string;
  label: string;
  placeholder: string;
  type: 'default' | 'select' | 'number' | 'email' | 'tel' |'file' | 'check-box';
  lockupItem: SelectModel[];
  required: boolean;
  message: string;
  defaultValue: string;
  checked: boolean;
}
export interface SelectModel {
    label: string;
    value: string;
};
