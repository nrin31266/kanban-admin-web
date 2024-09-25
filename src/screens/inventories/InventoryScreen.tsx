import { Button } from 'antd'
import React, { useState } from 'react'

const InventoryScreen = () => {
  const [isVisibleModalAddProduct, setIsVisibleModalAddProduct] = useState(false);
  const handleSubmit = () =>{
    setIsVisibleModalAddProduct(true);
  };
  return (
    <>
      <Button type='primary' onClick={()=>handleSubmit()}>Add product</Button>
      
    </>
  )
}

export default InventoryScreen