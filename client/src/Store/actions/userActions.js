import { userConstants } from '../constants/userConstants';
//import { userService } from '../_services';
// import { alertActions } from './';
// import { history } from '../_helpers';

export const userActions = {
    login,
    logout
};

function login(username, password) {
    return dispatch => {
        //dispatch(request({ username }));

        // userService.login(username, password)
        //     .then(
        //         user => { 
        //             dispatch(success(user));
        //             //history.push('/');
        //         },
        //         error => {
        //             dispatch(failure(error));
        //             dispatch(alertActions.error(error));
        //         }
        //     );
        localStorage.setItem('user', username)
        dispatch(success(username));


    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    localStorage.removeItem('user')
    return { type: userConstants.LOGOUT };
}