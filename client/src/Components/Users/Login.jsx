import React, { Component } from 'react';
import { Form, Button, Input, Checkbox } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
require('./Login.css');

class Login extends Component {


    constructor(props) {
        super(props)
        this.state = {
            currentUser: "undefined",
            username: null,
            password: null,
            loggedIn: false
        }
        //this.submitHandler = this.submitHandler.bind(this)

    }

    submitHandler = () => {
        this.props.dispatch(userActions.login(this.state.username, this.state.password));
        this.props.history.push("/main");
    }

    changeHandler = ((event) => {
        this.setState({ [event.target.name]: event.target.value });
    })

    componentDidMount(){
        this.setState({
            currentUser: this.props.user,
            loggedIn: this.props.loggedIn
        })
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <Redirect to = '/main'></Redirect>
            )
        } else {
            var username = this.state.username;
            var password = this.state.password;

        
            return (
                <div>
                    <Form onSubmit={this.submitHandler}>
                        <Form.Field>
                            <p>Username</p>
                            <Input
                                name="username"
                                value={username}
                                onChange={this.changeHandler}
                                type="text"
                                placeholder="admin"
                            />
                        </Form.Field>
                        <Form.Field>
                            <p>Password</p>
                            <Input
                                name="password"
                                value={password}
                                onChange={this.changeHandler}
                                type="password"
                            />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox label='I agree to the Terms and Conditions' />
                        </Form.Field>
                        <div className = "buttonContainer">
                            <Button type='submit'>Submit</Button>

                        </div>
                    </Form >
                </div>


            )
        }


    }
}




function mapStateToProps(state) {
    const { user, loggedIn } = state.auth;
    return {
        user, loggedIn
    };
};


const LoginPage = (props) => {
    return(
        <div className="signInContainer">
            <Login {...props}></Login>
        </div>
    )
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);




export default connectedLoginPage;