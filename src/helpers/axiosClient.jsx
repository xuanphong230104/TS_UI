import axios from "axios";
import storage from "./localStorage";

const axiosClient = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

axiosClient.interceptors.request.use((request) => {
  const authorization = storage.getAuthToken();
  if (authorization) request.headers.Authorization = `Token ${authorization}`;
  return request;
});

export default axiosClient;
