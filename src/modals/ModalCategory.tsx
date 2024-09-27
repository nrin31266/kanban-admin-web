import React, { useState } from "react";
import { Form, Input, message, Modal, TreeSelect } from "antd";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";
import { API } from "../configurations/configurations";
import { SelectModel, TreeModel } from "../models/FormModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: () => void,
  values: TreeModel[]
}

const ModalCategory = (props: Props) => {
  const { visible, onClose, onAddNew, values } = props;
    const [form] = Form.useForm();
    const [ isLoading, setIsLoading ] = useState(false);

    

  const handleOnClose = () => {
    onClose();
    form.resetFields();
  };
  const handleSubmit = async(values: any)=>{
    setIsLoading(true);
    if(!values.parentId) 
        values.parentId = null;
    values.slug = replaceName(values.name);
    
    try {
        const res = await handleAPI(API.CATEGORY, values, 'post');
        message.success('Create category successfully!');
        onAddNew();
        handleOnClose();
    } catch (error:any) {
        message.error(error.message);
    }finally{
        setIsLoading(false);
    }
  }

  return (
    <>
      <Modal
        open={visible}
        closable={!isLoading}
        onOk={form.submit}
        title={'Add category'}
        onClose={handleOnClose}
        onCancel={handleOnClose}
        okButtonProps={{
            loading: isLoading,
            disabled: isLoading,
        }}
        cancelButtonProps={{
            loading: isLoading,
            disabled: isLoading,
        }}
      >
        <Form 
        disabled={isLoading}
        layout="vertical"  
        form={form} onFinish={(values)=>handleSubmit(values)} size="large">
            <Form.Item name={'parentId'} label={'Parent'}>
                <TreeSelect treeData={values}
                allowClear
                showSearch/>
            </Form.Item>
            <Form.Item name={'name'} label={'Name'} rules={[{
                required: true,
                message: 'Enter category name!'
            }]}>
                <Input allowClear/>
            </Form.Item>
            <Form.Item name={'description'} label={'Description'} rules={[{
                required: true,
                message: 'Enter category description!'
            }]}>
                <Input.TextArea rows={3} allowClear/>
            </Form.Item>
        </Form>

      </Modal>
    </>
  );
};

export default ModalCategory;
