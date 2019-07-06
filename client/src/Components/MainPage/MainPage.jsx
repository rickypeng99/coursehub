import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';

class MainPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: null
        }

    }

    componentDidMount() {
        this.setState({
            username: localStorage.getItem('user')
        })

    }


    login = ((event) => {
        this.props.history.push('/')
    })

    logout = ((event) => {
        localStorage.removeItem('user');
        this.setState({
            username: localStorage.getItem('user')
        })
    })

    render() {

        if (this.state.username != null) {
            console.log(this.state.username)
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
                    <p>Fuck</p>
                    <Button onClick={this.login}>Login</Button>
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
