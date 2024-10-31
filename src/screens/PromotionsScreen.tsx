import { Button } from 'antd';
import React, { useState } from 'react'
import AddPromotionModal from '../modals/AddPromotionModal';

const PromotionsScreen = () => {
    const [isVisibleAddPromotionModal, setIsVisibleAddPromotionModal] = useState(false);
  return (
    <div>
        <Button onClick={()=> setIsVisibleAddPromotionModal(true)}>
            Open
        </Button>
        <AddPromotionModal onClose={()=> setIsVisibleAddPromotionModal(false)} visible={isVisibleAddPromotionModal} />
    </div>
  )
}

export default PromotionsScreen