import React, { Component } from 'react'
import { Form, Button, Input, Checkbox, Label, Dropdown } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
    root: {
        margin: "100px",
        paddingTop: '10px',
        paddingLeft: '10%',
        paddingRight: '10%',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        //textAlign: 'center',
        color: theme.palette.text.secondary,
    },

    paper_image: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    grid: {
        //display: "flex",
        // justifyContent: "center",
        // alignItems: "center"
    }
});


class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //currentUser: null,
            netId: null,
            username: null,
            firstName: null,
            lastName: null,
            major: null,
            classTaking: [],
            gpa: null,
            registered: false,
            comments: [],
            //loaded: false,
        }
    }

    componentDidMount() {
        var comments = []

        let now = new Date();
        var day = String(now.getDate()).padStart(2, '0');
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var year = now.getFullYear();
        var time = now.toTimeString();
        var currentDate = month + '/' + day + '/' + year + " at " + time;

        //hardcoding comments
        var comment1 = {
            responsiveness: 5,
            efficienty: 5,
            communication: 5,
            handsome: 5,
            text: "Ruiqi is an awesome dude!",
            date: currentDate,
            givenby: "Bill Gates"
        }

        var comment2 = {
            responsiveness: 5,
            efficienty: 5,
            communication: 5,
            handsome: 5,
            text: "I love Ruiqi, he is so awesome!",
            date: currentDate,
            givenby: "Mark Zuckerburg"
        }

        comments.push(comment1)
        comments.push(comment2)

        this.setState({
            netId: this.props.match.params.id,
            username: "rickypeng99",
            firstName: "Ruiqi",
            lastName: "Peng",
            major: ['Statistics and Computer Science', 'Liguistics'],
            classTaking: ['CS411', 'Stat410', 'Stat420'],
            gpa: null,
            registered: false,
            comments: comments
        })
    }

    render() {
        var classes = this.props.classes
        return (
            <div className={classes.root}>
                <Grid container spacing={2}>
                    {/* Basic Profile */}
                    <Grid item xs={8}>
                        <Grid container spacing={2} direction="column">
                            <Grid item xs={12}>

                                <Paper className={classes.paper}>
                                    <p>1</p>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                <p>2</p>

                                </Paper>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={4}>
                        <Grid container spacing={2} direction="column">


                            <Grid item xs={12}>
                                <Paper className={classes.paper_image}>

                                <p>3</p>

                                </Paper>
                            </Grid>



                            <Grid item xs={12}>
                                <Paper className={classes.paper_image}>
                                <p>4</p>

                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                <p>5</p>

                                </Paper>

                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </div>

        )
    }

}


function mapStateToProps(state) {
    const { user, loggedIn } = state.auth;
    return {
        user, loggedIn
    };
};
const connectedUserPage = connect(mapStateToProps)(User);

export default withStyles(styles)(connectedUserPage);

