import axios from "axios";
import queryString from "query-string";
import { localDataNames } from "../constants/appInfos";

const baseURL = `http://172.20.10.4:8888/api/v1`;

export const getAuth = () => {
  const res = localStorage.getItem(localDataNames.authData);
  return res ? JSON.parse(res) : {};
}

const axiosClient = axios.create({
  baseURL,
  paramsSerializer: (params) => queryString.stringify(params),
});


axiosClient.interceptors.request.use(async (config: any) => {
  const accessToken = getAuth();

  config.headers = {
    Authorization: accessToken.token,
    Accept: "application/json",
    ...config.headers,
  };
  if (config.data) {
    // Thực hiện các hành động với config.data
  }
  console.log(config);
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    const { code, result, message } = response.data;

    if (code === 1000) {
      return response;
    } else {
      return Promise.reject(response.data.message);
    }
  },
  (error) => {
    const { response } = error;
    return Promise.reject(response.data);
  }
);

export default axiosClient;
