import axios from "axios";
import queryString from "query-string";
import { localDataNames } from "../constants/appInfos";
import { useState } from "react";

const baseURL = `http://172.20.10.4:8888/api/v1`;

let isRefreshToken = false;

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
    const accessToken = getAuth();
    
    config.headers = {
      Authorization: accessToken.token ? `Bearer ${accessToken.token}` : undefined,
      Accept: "application/json",
      ...config.headers,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  async (response) => {
    const { code } = response.data;
    if (code === 1000) {
      return response;
    } else {
      console.log('e1');
      return Promise.reject(response.data.message);
    }
  },
  async (error) =>{
    const { response } = error;
    return Promise.reject(response.data);
  }
);


export default axiosClient;
