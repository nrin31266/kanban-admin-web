import { Form, Modal } from "antd";
import { AddCategory } from "../components";
import { TreeModel } from "../models/FormModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: () => void,
  values: TreeModel[]
}

const ModalCategory = (props: Props) => {
  const { visible, onClose, onAddNew, values } = props;
    const [form] = Form.useForm();

    

  const handleOnClose = () => {
    onClose();
    form.resetFields();
  };
  return (
    <>
      <Modal
        open={visible}
        title={'Add category'}
        onClose={handleOnClose}
        onCancel={handleOnClose}
        footer={null}

      >
        <AddCategory values={values} onAddNew={() => {
          onAddNew();
          onClose();
          }}/>
      </Modal>
    </>
  );
};

export default ModalCategory;
