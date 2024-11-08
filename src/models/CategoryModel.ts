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