import { Avatar, Button, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import SupplierModal from '../modals/SupplierModal';
import handleAPI from '../apis/handleAPI';
import { API } from '../configurations/configurations';
import { ColumnProps } from 'antd/es/table';
import { SupplierResponse } from '../models/SupplierModel';

const SupplierScreen = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [isVisibleSupplierModal, setIsVisibleSupplierModal] = useState(false);
  const [supplierSelected, setSupplierSelected] = useState();
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>();
  useEffect(()=>{
    getData();
  },[])

  const getData = async ()=>{
    await getSuppliers();
  }

  const getSuppliers = async ()=>{
    setIsLoading(true);
    try {
      const res = await handleAPI(API.SUPPLIER);
      setSuppliers(res.data.result.data);
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }
  const columns: ColumnProps<SupplierResponse>[]=[
    {
      key: 'avatar',
      dataIndex: 'photoUrl',
      title: '',
      render: (photoUrl: string)=> <Avatar size={40} src={photoUrl}/>
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Supplier Name',
    },
    {
      key: 'contactPerson',
      dataIndex: 'contactPerson',
      title: 'Contact Person',
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
    },
  ]

  return (
    <div>
      <div>
        <Button type='primary' onClick={()=>setIsVisibleSupplierModal(true)}>Add supplier</Button>
      </div>
      <Table
        dataSource={suppliers}
        columns={columns}
      >

      </Table>
      <SupplierModal onClose={()=>{setIsVisibleSupplierModal(false)}} onSubmit={()=>{}} visible={isVisibleSupplierModal} supplier={supplierSelected}/>
    </div>
    
  )
}

export default SupplierScreen