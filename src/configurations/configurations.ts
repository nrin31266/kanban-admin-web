export const API = {
  USER: "/identity/users",
  USER_INFO: "/identity/users/info",
  LOGIN: "/identity/auth/admin",
  LOGOUT: "/identity/auth/logout",
  LOGIN_WITH_GOOGLE: "/identity/auth/outbound/google-login",
  SIGNUP: "/identity/users/create",
  REFRESH_TOKEN: "/identity/auth/refresh",
  VERIFY_TOKEN:'identity/auth/introspect',
  CREATE_SUPPLIER: "/kanban/suppliers/create",
  SUPPLIER:'/kanban/suppliers',
  GET_SUPPLIERS: (page:number|string,size: number|string) => `/kanban/suppliers?page=${page}&size=${size}`,
  UPDATE_SUPPLIER: (suppliersId:string) => `/kanban/suppliers/${suppliersId}`,
  DELETE_SUPPLIER: (suppliersId:string) => `/kanban/suppliers?suppliersId=${suppliersId}`,
  FORM_SUPPLIERS: "/kanban/suppliers/form",
  CATEGORY: "/kanban/categories",
  GET_CATEGORIES_TREE: "/kanban/categories/get-tree",
  PRODUCTS: "/kanban/products",
  SUB_PRODUCTS: "/kanban/sub-products",
  GET_PRODUCT_FILTER_VALUES: "/kanban/sub-products/filter-values",
  PRODUCTS_FILTER_VALUES: "/kanban/products/filter",
  PRODUCT_DETAIL: (productId:string)=> `/kanban/sub-products/product-detail/${productId}`,
  PROMOTIONS: "/kanban/promotions",
  BESTSELLER_PRODUCTS: '/kanban/products/bestseller',
  CARTS: '/kanban/carts',
  ADDRESSES: '/profiles/addresses',
  PROFILES: '/profiles',
  USER_PROFILE: '/profiles/users',
  GET_MENU_CATEGORIES_TREE: "/kanban/categories/get-menu-tree",
  ORDERS: 'kanban/orders',
    RATING: 'kanban/rating'
};

export const appInfos = {
  logo: "https://firebasestorage.googleapis.com/v0/b/kanban-ac9c5.appspot.com/o/kanban-logo.png?alt=media&token=b72b8db5-b31d-4ae9-aab8-8bd7e10e6d8e",
  title: "KANBAN",
  description: "",
};

export const colors = {
  primary500: '#1570EF',
  grey600: '#5D6679',
  grey800: '#383E49',
};
