export interface PromotionRequest {
    name: string
    description: string
    discountType: boolean
    value: number
    quantity: number
    imageUrl: string;
    code: string
    start: string
    end: string
  }