import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function MenuAppBar() {
    const classes = useStyles();


    const imgStyle = {
        //width: "50%",
        height: "50px",
        margin: "10px"
    }
    return (
        <div className={classes.root} >
            <AppBar position="fixed">
                <Toolbar >
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" >
                        <MenuIcon />
                    </IconButton> */}
                    <img style={imgStyle} src={require('../../Common/images/logo.png')} />
                    <Typography variant="h6" className={classes.title}>
                        Classes
                    </Typography>
                    <div>
                        <Button color="inherit" onClick>Login</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}
