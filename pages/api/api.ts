import axios, { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  baseURL: "https://chessbots-backend-live-umfn7eaela-ts.a.run.app",
  timeout: 10000,
};

export const api = axios.create(config);

export const botapi = axios.create({
  baseURL: "https://chessbots-gamemaster-live-umfn7eaela-ts.a.run.app",
  timeout: 60000,
});
