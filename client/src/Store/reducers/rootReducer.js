import { combineReducers } from 'redux';

import { auth } from './authReducer';
// import { users } from './users.reducer';
// import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  auth
});

export default rootReducer;