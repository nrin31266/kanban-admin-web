import { localDataNames } from "../constants/appInfos";

export const KEY_TOKEN = localDataNames.accessToken;

export const setToken = (token: any) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  const data = localStorage.getItem(KEY_TOKEN);
  return data?JSON.parse(data) : {};
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};