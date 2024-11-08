import { TreeModel } from "./FormModel";

export interface CategoryModel {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}


export interface ProductModel {
  id: string
  title: string
  description: string
  slug: string
  supplierId: string
  content: string
  expiredDate: any
  images: string[]
  categories: CategoryModel[]
  createdAt: string
  updatedAt: string
  subProductResponse?: SubProductModel[];
}

export interface ProductResponse {
  id: string
  title: string
  description: string
  slug: string
  supplierId: string
  content: string
  expiredDate: string
  images: string[]
  categoryIds: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductRequest {
  title: string
  description: string
  slug: string
  supplierId: string
  content: string
  expiredDate: string
  images: string[]
  categoryIds: string[]
}



export interface SubProductModel {
  size: string
  color: any
  price: number
  quantity: number
  images: string[]
  product: ProductModel
  createdAt: string
  updatedAt: string
}

export interface SubProductResponse{
  id: string
  size: string
  color: any
  discount: number
  price: number
  quantity: number
  images: string[]
  productId: string
  createdAt: string
  updatedAt: string
}
export interface SubProductRequest{
  size: string
  discount: number
  color: any
  price: number
  productId: string
  quantity: number
  images: string[]
}

export interface FilterProductValue{
  color?: string|string[];
  categories?: string[],
  size?: string|string[],
  price?:{
    min: number,
    max: number
  }
}

export interface ProductsFilterValuesRequest{
  colors?: string[],
  categoryIds?: string[]
  title?:string,
  sizes?:string[]
  maxPrice?: number,
  minPrice?:number
  page: number,
  size: number

}

export interface FilterValueResponse {
  key: string
  selectData: string[]
}