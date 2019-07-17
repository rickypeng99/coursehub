import { userConstants } from '../constants/userConstants';


let user = localStorage.getItem('user');
const initialState = user ? { loggedIn: true, user } : {};

export function auth(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {
        loggedIn: false,
        user: null
      };
    case userConstants.LOGOUT:
      return {
        loggedIn: false,
        user: null
      };
    default:
      return state
  }
}