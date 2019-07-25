
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { connect } from 'react-redux';
//import { getCookie, setCookie } from '../../Common/cookie';
import { userActions } from '../../Store/actions/userActions';
import {withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';

const styles = {
    root: {
        flexGrow: 1,
        //marginBottom: "80px",

    },
    grow: {
        //flexGrow: 1,
        cursor: "pointer"
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },

    toolBar: {
        display: "flex",
        justifyContent: "space-between"
    },
    toolBar2: {
        display: "flex",
        //justifyContent: "space-between"
        alignItems: "center"
    }
};

class MenuAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            anchorEl: false,
            username: "",

        }
    }

    redirect = (() => {
        this.props.history.push('/')
    })

    handleMenu = event => {
        //console.log("fuck")
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleMyProfile = () => {
        this.setState({ anchorEl: null });
        this.props.history.push('/user/' + this.state.username)
    }

    handleMyAccount = () => {
        this.setState({ anchorEl: null });
        this.props.history.push('/user/' + this.state.username + '/settings')
    }

    logout = () => {
        this.props.dispatch(userActions.logout());
        this.setState({
            username: this.props.username,
            anchorEl: null,
            auth: false
        })
    }

    login = (() => {
        this.props.history.push('/login')
    })

    register = (() => {
        this.props.history.push('/register')
    })


    componentWillReceiveProps(nextProps) {
        if (nextProps.loggedIn !== this.state.auth) {
            this.setState({
                username: nextProps.user,
                auth: nextProps.loggedIn
            });
        }
    }

    componentDidMount() {
        this.setState({
            username: this.props.user,
            auth: this.props.loggedIn
        })


    }
    preventDragHandler = (e) => {
        e.preventDefault();
    }
    
    render() {
        const { classes } = this.props;
        const { auth, anchorEl } = this.state;
        const open = Boolean(anchorEl);


        const showUserOrLogin = () => {
            if (auth) {
                return (
                    <div>
                        <IconButton
                            aria-owns={open ? 'menu-appbar' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            {/* <AccountCircle /> */}
                            Hi, {this.state.username}
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.handleMyProfile}>Profile</MenuItem>
                            <MenuItem onClick={this.handleMyAccount}>Account settings</MenuItem>
                            <MenuItem onClick={this.logout}>Log out</MenuItem>
                        </Menu>
                    </div>

                )
            } else{
                return(
                    <div>
                        <Button color="inherit" onClick = {this.login}>Login</Button>
                        <Button color="inherit" onClick = {this.register}>Register</Button>
                    </div>
                )
            }
        }
        const imgStyle = {
            //width: "50%",
            height: "50px",
            margin: "10px",
            userDrag: "none",
            userSelect: "none",
            cursor: "pointer"
        }


        return (

            <div className={classes.root} >
                {/* <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={auth} onChange={this.handleChange} aria-label="LoginSwitch" />
            }
            label={auth ? 'Logout' : 'Login'}
          />
        </FormGroup> */}
                < AppBar position="fixed" >
                    <Toolbar className={classes.toolBar}>
                        <div className={classes.toolBar2}>
                            <img style={imgStyle} src={require('../../Common/images/logo.png')} onDragStart={this.preventDragHandler} onClick={this.redirect} />
                        </div>

                        {showUserOrLogin()}
                    </Toolbar>
                </AppBar>
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user, loggedIn } = state.auth;
    return {
        user, loggedIn
    };
};

const ConnectedMenuAppBar = connect(mapStateToProps)(MenuAppBar);




export default withRouter(withStyles(styles)(ConnectedMenuAppBar));
