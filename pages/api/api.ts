import axios, { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  baseURL: "https://chessbots-webpage-dev-umfn7eaela-ts.a.run.app",
  timeout: 10000,
};

const api = axios.create(config);

export default api;
