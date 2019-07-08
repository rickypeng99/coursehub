// import React, {Component} from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import { connect } from 'react-redux';

// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import Button from '@material-ui/core/Button';

// const styles = theme => ({    
//     root: {
//         flexGrow: 1,
//     },
//     menuButton: {
//         marginRight: theme.spacing(2),
//     },
//     title: {
//         flexGrow: 1,
//     },
// });



// class MenuAppBar extends Component{
//     // const classes = useStyles();
//     // var loggedIn = props.loggedIn;
//     // var username = props.username;
//     //console.log(props.username)

//     constructor(props){
//         super(props);
//         this.state = {
//             loggedIn: this.props.loggedIn,
//             username: this.props.username
//         }
//     }


//     //console.log(username)
//     render(){


//         const imgStyle = {
//             //width: "50%",
//             height: "50px",
//             margin: "10px"
//         }

//         const showUsername = () => {
//             if(loggedIn){
//                 return(
//                     <p>{username}</p>
//                 )
//             }
//         }


//         return (
//             <div className={classes.root} >
//                 <AppBar position="fixed">
//                     <Toolbar >
//                         {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" >
//                             <MenuIcon />
//                         </IconButton> */}
//                         <img style={imgStyle} src={require('../../Common/images/logo.png')} />
//                         <Typography variant="h6" className={classes.title}>
//                             Classes
//                         </Typography>
//                         {/* <div>
//                             <Button color="inherit" onClick>Login</Button>
//                         </div> */}
//                         {
//                             <div>
//                                 {showUsername}
//                             </div>
//                         }
//                     </Toolbar>
//                 </AppBar>
//             </div>
//         );
//     }


// }


// function mapStateToProps(state) {
//     const { user, loggedIn } = state.auth;
//     return {
//         user, loggedIn
//     };
// };

// const ConnectedMenuAppBar = connect(mapStateToProps)(MenuAppBar);




// export default withStyles(styles)(ConnectedMenuAppBar);


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
    state = {
        auth: false,
        anchorEl: false,
        username: "",
    };

    handleMenu = event => {
        console.log("fuck")
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    logout = () => {
        this.props.dispatch(userActions.logout());
        this.setState({
            username: this.props.username,
            anchorEl: null,
            auth: false
        })
    }


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
                            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                            <MenuItem onClick={this.handleClose}>My account</MenuItem>
                            <MenuItem onClick={this.logout}>Log out</MenuItem>
                        </Menu>
                    </div>

                )
            }
        }
        const imgStyle = {
            //width: "50%",
            height: "50px",
            margin: "10px",
            userDrag: "none",
            userSelect: "none"
        }

        
    return(

            <div className = { classes.root } >
            {/* <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={auth} onChange={this.handleChange} aria-label="LoginSwitch" />
            }
            label={auth ? 'Logout' : 'Login'}
          />
        </FormGroup> */}
            < AppBar position = "fixed" >
                <Toolbar className={classes.toolBar}>
                    <div className={classes.toolBar2}>
                        <img style={imgStyle} src={require('../../Common/images/logo.png') } onDragStart={this.preventDragHandler}/>
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




export default withStyles(styles)(ConnectedMenuAppBar);
