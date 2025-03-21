import { authTypes } from "./actionTypes";
import authService from "../services/authServices";

const getUserLogin = () => {
  const getRequest = () => ({
    type: authTypes.LOGIN_REQUEST,
  });

  const getSuccess = (payload) => ({
    type: authTypes.LOGIN_SUCCESS,
    payload,
  });

  const getFailure = () => ({
    type: authTypes.LOGIN_FAILURE,
  });

  return (dispatch) => {
    dispatch(getRequest());
    authService
      .getUserLogin()
      .then((user) => {
        dispatch(getSuccess(user));
      })
      .catch(() => {
        dispatch(getFailure());
      });
  };
};

const login = (values, navigate) => {
  const loginRequest = () => ({
    type: authTypes.LOGIN_REQUEST,
  });

  const loginSuccess = (payload) => ({
    type: authTypes.LOGIN_SUCCESS,
    payload,
  });

  const loginFailure = (payload) => ({
    type: authTypes.LOGIN_FAILURE,
    payload,
  });

  return (dispatch) => {
    dispatch(loginRequest());
    authService
      .login(values.username, values.password)
      .then((user) => {
        dispatch(loginSuccess(user));
        navigate();
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  };
};

const logout = () => {
  authService.logout();
  return (dispatch) => {
    dispatch({ type: authTypes.LOGOUT });
  };
};

export default {
  getUserLogin,
  login,
  logout,
};
