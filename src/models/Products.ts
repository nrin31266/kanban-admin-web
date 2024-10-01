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
