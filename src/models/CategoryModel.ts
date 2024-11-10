export interface CategoryTableData {
    key: string;
    name: string;
    description: string;
    slug: string;
    imageUrl: string
    parentId: any;
    createdAt: string;
    updatedAt: string;
    children?: CategoryTableData[];
  }

  export interface CategoryResponse {
    id: string
    imageUrl: string
    name: string
    description: string
    slug: any
    parentId: any
    createdAt: string
    updatedAt: string
  }