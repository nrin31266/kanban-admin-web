export const API = {
  LOGIN: "/identity/auth/login",
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
