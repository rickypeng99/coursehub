import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom'

import Colors from '@material-ui/core/colors';

//import components

import connectedLoginPage from "../Users/Login"
//import  LoginPage  from "../Users/Login"
import connectedMainPage from "../MainPage/MainPage"
import connectedRegisterPage from "../Users/Register"

import MenuAppBar from "../AppBar/AppBar"

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
          <MenuAppBar />


        </ThemeProvider>
        <style>{'body { background-color: #f0f0f0; }'}</style>

        <Switch>
          <Route exact path="/" component={connectedLoginPage} />
          <Route exact path="/main" component={connectedMainPage} />
          <Route exact path="/register" component={connectedRegisterPage} />
        </Switch>

      </HashRouter>
    );
  }
}

export default App;