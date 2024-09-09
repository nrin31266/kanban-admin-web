import axios from "axios";
import queryString from "query-string";

const baseURL = `http://172.20.10.4:8888/api/v1`;

const axiosClient = axios.create({
  baseURL,
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config: any) => {
  config.headers = {
    Authorization: "",
    Accept: "application/json",
    ...config.headers,
  };
  if (config.data) {
    // Thực hiện các hành động với config.data
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    const { code, result, message } = response.data;

    if (code === 200) {
      return response.data.result;
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
