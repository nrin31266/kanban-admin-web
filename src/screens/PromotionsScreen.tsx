import { Button } from 'antd';
import React, { useState } from 'react'
import PromotionModal from '../modals/PromotionModal';

const PromotionsScreen = () => {
    const [isVisibleAddPromotionModal, setIsVisibleAddPromotionModal] = useState(false);
  return (
    <div>
        <Button onClick={()=> setIsVisibleAddPromotionModal(true)}>
            Open
        </Button>
        <PromotionModal onClose={()=> setIsVisibleAddPromotionModal(false)} visible={isVisibleAddPromotionModal} />
    </div>
  )
}

export default PromotionsScreen