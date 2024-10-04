import { Button, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { ProductModel } from '../../../models/Products';
import handleAPI from '../../../apis/handleAPI';
import { API } from '../../../configurations/configurations';

const InventoryScreen = () => {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(()=>{
    getProducts();
  }, [])
  const getProducts =async () =>{
    setIsLoading(true);
    try {
      const res = await handleAPI(`${API.PRODUCTS}/data`);
      console.log(res.data.result);
      setProducts(res.data.result);
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

  
  return (
    <>
      <Table
      dataSource={products}
      columns={[]}
      loading={isLoading}>
      
      </Table>
      
    </>
  )
}

export default InventoryScreen