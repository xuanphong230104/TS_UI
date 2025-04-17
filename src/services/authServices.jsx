import { API_ENDPOINTS } from "../constants";
import storage from "../helpers/localStorage";
import axiosClient from "../helpers/axiosClient";

const getUserLogin = () =>
  axiosClient
    .get(API_ENDPOINTS.USER_ME)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      storage.removeAuthToken();
      return Promise.reject(error);
    });

const login = (username, password) =>
  axiosClient
    .post(API_ENDPOINTS.LOGIN, { username, password })
    .then((response) => {
      storage.setAuthToken(response.data.auth_token);
      return getUserLogin();
    })
    .catch((error) => {
      storage.removeAuthToken();
      const message =
        error.status === 404
          ? error.message
          : Object.values(error.response?.data || {});
      return Promise.reject({ message });
    });

const logout = () =>
  axiosClient
    .post(API_ENDPOINTS.LOGOUT)
    .then(() => {
      storage.removeAuthToken();
    })
    .catch(() => {
      storage.removeAuthToken();
    });

export default {
  getUserLogin,
  login,
  logout,
};
