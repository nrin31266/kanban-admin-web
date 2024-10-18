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
export interface CategoryTableData {
  key: string;
  name: string;
  description: string;
  slug: string;
  parentId: any;
  createdAt: string;
  updatedAt: string;
  children?: CategoryTableData[];
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
