import { userConstants } from '../constants/userConstants';
import axios from 'axios';
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

        axios.post('api/login', {
            net_id: username,
            password: password
        })
        .then((response) => {
            if(response.data.data[0].length > 0){
                localStorage.setItem('user', response.data.data)
                dispatch(success(response.data.data));
            } else{
                var username = response.data.data[0]
                dispatch(failure(username));

            }
        })
        .catch(error => {
            console.log('error')
        })



    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    localStorage.removeItem('user')
    return { type: userConstants.LOGOUT };
}