
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
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import axios from 'axios';

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
            invitations: 0,
            invitationsLoaded: false

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
        this.setState({ anchorEl: false });
    };

    handleMyProfile = () => {
        this.setState({ anchorEl: false });
        this.props.history.push('/user/' + this.state.username)
    }

    handleMyAccount = () => {
        this.setState({ anchorEl: false });
        this.props.history.push('/user/' + this.state.username + '/settings')
    }

    logout = () => {
        this.props.dispatch(userActions.logout());
        this.setState({
            username: this.props.username,
            anchorEl: false,
            auth: false
        })
        this.props.history.push('/login')
    }

    login = (() => {
        this.props.history.push('/login')
    })

    register = (() => {
        this.props.history.push('/register')
    })

    viewInvitations = (() => {
        this.props.history.push('/invitation')
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
        axios.get('api/invitation/num/' + this.props.user)
            .then(response => {
                var num = response.data.data;
                this.setState({
                    invitations: num,
                    invitationsLoaded: true
                })
            })
            .catch(error => {
                console.log(error)
            })
    }


    componentDidUpdate() {
        axios.get('api/invitation/num/' + this.props.user)
            .then(response => {
                var num = response.data.data;
                if(num != this.state.invitations){
                    this.setState({
                        invitations: num,
                        invitationsLoaded: true
                    })
                }
                
            })
            .catch(error => {
                console.log(error)
            })
    }

    preventDragHandler = (e) => {
        e.preventDefault();
    }

    render() {
        const { classes } = this.props;
        const { auth, anchorEl } = this.state;
        const open = anchorEl;


        const showInvitationNum = () => {
            if (this.state.invitationsLoaded) {
                return (
                    <IconButton aria-label="show 17 new notifications" color="inherit" onClick = {this.viewInvitations}>
                        <Badge badgeContent={this.state.invitations} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                )
            } else{
                return(
                    <IconButton aria-label="show 17 new notifications" color="inherit" onClick = {this.viewInvitations}>
                        <Badge badgeContent={0} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                )
            }
        }

        const showUserOrLogin = () => {
            if (auth) {
                return (
                    <div>
                        {showInvitationNum()}
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
            } else {
                return (
                    <div>
                        <Button color="inherit" onClick={this.login}>Login</Button>
                        <Button color="inherit" onClick={this.register}>Register</Button>
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
