import { localDataNames } from "../constants/appInfos";


export const KEY_TOKEN = localDataNames.accessToken;

export const setToken = (token: any) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};