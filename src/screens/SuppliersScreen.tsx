import { Button, Space, Table, Typography } from 'antd'
import { ColumnProps } from 'antd/es/table';
import { useState } from 'react';
import { MdOutlineFilterList } from "react-icons/md";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { RxDownload } from "react-icons/rx";
import { ToggleSuppliers } from '../modals';
const {Title} = Typography;

const SuppliersScreen = () => {

  const [isVisibleToggleSupplies, setIsVisibleToggleSupplies] = useState(false);
  
  const columns: ColumnProps<any>[] = [

  ];

  return (
    <div>
      <Table dataSource={[]} columns={columns}
      title={() =>
        <div className='row'>
          <div className="col">
        <Title level={5}>Suppliers</Title>
          </div>
          <div className="col text-right">
            <Space>
              <Button icon={<MdOutlineLibraryAdd size={22}/>} type='primary'
                onClick={() => setIsVisibleToggleSupplies(true)}
              >Add supplier</Button>
              <Button icon={<MdOutlineFilterList size={22}/>}>Filters</Button>
              <Button icon={<RxDownload size={22}/>}>Download all</Button>
            </Space>
          </div>
        </div>
      }
      />

      <ToggleSuppliers 
        visible={isVisibleToggleSupplies} 
        onClose={() => setIsVisibleToggleSupplies(false)}
        onAddNew={val => console.log(val)}
        suppliers={{}}
      />
    </div>
  )
}

export default SuppliersScreen