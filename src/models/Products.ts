import { CategoryResponse } from "./CategoryModel";
import { TreeModel } from "./FormModel";
import { SupplierResponse } from "./SupplierModel";

export interface CategoryModel {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProductResponse {
  id: string
  options: string[];
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

  supplierResponse: SupplierResponse
  categoryResponse: CategoryResponse[]
}
export interface ProductRequest {
  options: string[];
  title: string
  description: string
  slug: string
  supplierId: string
  content: string
  expiredDate: string
  images: string[]
  categoryIds: string[]
}
export interface SubProductResponse{
  id: string
  options: Record<string, any>;
  discount: number
  price: number
  quantity: number
  images: string[]
  productId: string
  createdAt: string
  updatedAt: string
}
export interface SubProductRequest{
  options: Record<string, any>;
  discount: number
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