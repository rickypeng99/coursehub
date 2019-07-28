import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom'

import Colors from '@material-ui/core/colors';

//import components

import connectedLoginPage from "../Users/Login"
//import  LoginPage  from "../Users/Login"
import connectedMainPage from "../MainPage/MainPage"
import connectedRegisterPage from "../Users/Register"

import ConnectedMenuAppBar from "../AppBar/AppBar"
import connectedUserPage from "../Users/UserPage"
import connectedSettingPage from "../Users/UserSettings"
import connectedCoursePage from "../Course/Course"
import connectedInvitationPage from "../Invitation/Invitation"

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000000"
    },
    secondary: {
      main: '#f44336',
    },
  }
});

class App extends Component {
  render() {
    return (
      <HashRouter>
        <ThemeProvider theme={theme}>
          <ConnectedMenuAppBar />


        <style>{'body { background-color: #f0f0f0;}'}</style>

        <Switch>
          <Route exact path="/login" component={connectedLoginPage} />
          <Route exact path="/" component={connectedMainPage} />
          <Route exact path="/register" component={connectedRegisterPage} />
          <Route exact path="/user/:id" component={connectedUserPage}/>
          <Route exact path="/user/:id/settings" component = {connectedSettingPage}/>
          <Route exact path="/course/:id" component={connectedCoursePage}/>
          <Route exact path="/invitation" component={connectedInvitationPage}/>

        </Switch>
        </ThemeProvider>

      </HashRouter>
    );
  }
}

export default App;