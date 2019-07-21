import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';

class MainPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: null,
            loggedIn: false
        }
    }

    componentDidMount() {
        this.setState({
            username: this.props.user,
            loggedIn: this.props.loggedIn
        })

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

    login = (() => {
        this.props.history.push('/login')
    })

    logout = (() => {
        this.props.dispatch(userActions.logout());
        this.setState({
            username: this.props.username,
            loggedIn: this.props.loggedIn
        })
    })

    register = (() => {
        this.props.history.push('/register')
    })

    render() {

        if (this.state.loggedIn) {
            //console.log(this.state.username)
            return (


                <div>
                    <p>
                        Hello, {this.state.username}
                    </p>
                    <Button onClick={this.logout}>Logout</Button>

                </div>

            )
        } else {
            return (
                <div>
                    <p>This is the test main page, please log in!</p>
                    <Button onClick={this.login}>Login</Button>
                    <Button onClick={this.register}>Register</Button>
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


const mainPage = (props) => {

    const mainStyle = {

        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

    }

    return (
        <div style={mainStyle}>
            <MainPage {...props}></MainPage>

        </div>
    )
}

const connectedMainPage = connect(mapStateToProps)(mainPage);




export default connectedMainPage;
