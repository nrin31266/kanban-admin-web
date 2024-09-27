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
  value: any;
  label: string;
  placeholder: string;
  type: 'default' | 'select' | 'number' | 'email' | 'tel' |'file' | 'check-box' | 'text-area';
  lockupItem: SelectModel[];
  required: boolean;
  message: string;
  defaultValue: string;
  checked: boolean;
  displayLength: number
}
export interface SelectModel {
    label: string;
    value: string;
};
export interface TreeModelChildren{
  title: string,
  value: string,
  disabled?: boolean 
  style?:any
}
export interface TreeModel {
  title: string,
  value: string,
  style?:any
  disabled?: boolean
  children?:TreeModelChildren[]
}
