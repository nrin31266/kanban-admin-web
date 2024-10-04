import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import queryString from "query-string";
import { localDataNames } from "../constants/appInfos";
import handleAPI from "./handleAPI";
import { API } from "../configurations/configurations";
import { AuthModel } from "../models/AuthenticationModel";

const baseURL = `http://localhost:8888/api/v1`;

// let isRefreshing = false;
// let refreshSubscribers: Array<(token: string) => void> = []; 

// function onRefreshed(token: string): void {
//   refreshSubscribers.forEach((callback) => callback(token));
//   refreshSubscribers = [];
// }

// function addRefreshSubscriber(callback: (token: string) => void): void {
//   refreshSubscribers.push(callback);
// }

export const getAuth = () => {
  const res = localStorage.getItem(localDataNames.authData);
  return res ? JSON.parse(res) : {};
};

const axiosClient = axios.create({
  baseURL,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  async (config: any) => {
    const authData:AuthModel = getAuth();

    config.headers = {
      Authorization: authData.accessToken
        ? `Bearer ${authData.accessToken}`
        : undefined,
      Accept: "application/json",
      ...config.headers,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { code } = response.data;
    if (code === 1000) {
      return response;
    } else {
      return Promise.reject(response.data);
    }
  },
  async (error: AxiosError) => {
    const { response } = error;
    // if (response && response.data && (response.data as any).code === 500) {
    //   const config = error.config as AxiosRequestConfig;

    //   if (!isRefreshing) {
    //     isRefreshing = true;
    //     const token = await getRefreshToken();
    //     try {
    //       if (token === undefined) {
    //         isRefreshing = false;
    //         await store.dispatch(removeAuth({}));
    //         localStorage.clear();
    //         return Promise.reject(response.data);
    //       } else if (token === true) {
    //         isRefreshing = false;
    //         return axiosClient(config);
    //       } else {
    //         await store.dispatch(refreshToken(token));
    //         isRefreshing = false;
    //         onRefreshed(token);
    //         config.headers = {
    //           ...config.headers,
    //           Authorization: `Bearer ${token}`,
    //         };
    //         return axiosClient(config);
    //       }
    //     } catch (err) {
    //       isRefreshing = false;
    //       const navigate = useNavigate();
    //       await store.dispatch(removeAuth({}));
    //       localStorage.clear();
    //       return Promise.reject(err);
    //     }
    //   } else {
    //     return new Promise((resolve) => {
    //       addRefreshSubscriber((token: string) => {
    //         config.headers = {
    //           ...config.headers,
    //           Authorization: `Bearer ${token}`,
    //         };
    //         resolve(axiosClient(config));
    //       });
    //     });
    //   }
    // }
    return Promise.reject(response?.data);
  }
);

export default axiosClient;


