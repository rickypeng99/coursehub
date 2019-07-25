import React, { Component } from 'react';
import { Form, Button, Input, Checkbox } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

require('./User.css');

const styles = theme => ({
    root: {
        //flexGrow: 1,
        width: '30%',

    },

    paper: {
        padding: theme.spacing(2),
        //textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    input: {
        //flexShrink: 0,
        width: "100%"
    },
    grid: {
        //display: "flex",
        // justifyContent: "center",
        // alignItems: "center"
    },
    outGrid: {
        //margin: "10%",
        padding: theme.spacing(2),
        //textAlign: 'center',
        color: theme.palette.text.secondary,
        // backgroundImage: `url(${Background})`,
        // backgroundSize: '100%, 100%',
        // backgroundRepeat: 'no-repeat',

    }
});

class Login extends Component {


    constructor(props) {
        super(props)
        this.state = {
            currentUser: "undefined",
            username: null,
            password: null,
            loggedIn: false,
        }
        //this.submitHandler = this.submitHandler.bind(this)

    }

    submitHandler = () => {
        this.props.dispatch(userActions.login(this.state.username, this.state.password));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loggedIn !== this.state.loggedIn) {
            this.setState(
                {
                    username: nextProps.user,
                    loggedIn: nextProps.loggedIn
                });
        }
    }

    changeHandler = ((event) => {
        this.setState({ [event.target.name]: event.target.value });
    })

    componentDidMount() {
        this.setState({
            currentUser: this.props.user,
            loggedIn: this.props.loggedIn
        })
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <Redirect to='/'></Redirect>
            )
        } else {
            var username = this.state.username;
            var password = this.state.password;

            var classes = this.props.classes

            return (
                <div className={classes.root}>
                    <Paper className={classes.outGrid}>
                        <Typography variant='h4' color='primary'>Login</Typography>

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
                            <div className="buttonContainer">
                                <Button type='submit'>Submit</Button>

                            </div>
                        </Form >
                    </Paper>


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
    return (
        <div className="signInContainer">
            <Login {...props}></Login>
        </div>
    )
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);




export default withStyles(styles)(connectedLoginPage);