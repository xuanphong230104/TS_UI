import { authTypes } from "../actions/actionTypes";
import storage from "../helpers/localStorage";

const initialState = {
  isLogged: !!storage.getAuthToken(),
  error: null,
  isLoading: false,
  user: null,
};

const authentication = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case authTypes.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case authTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLogged: true,
        error: null,
        user: payload,
      };
    case authTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isLogged: false,
        error: payload,
      };
    case authTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authentication;
