import React, { Component } from 'react'
import { Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating, SearchResults, TextArea, Dimmer, Segment, Header } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import axios from 'axios';


const styles = theme => ({
    root: {
        flexGrow: 1,
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
        marginTop: "100px",
        paddingTop: '10px',
        marginLeft: '10%',
        marginRight: '10%',
        padding: theme.spacing(2),
        //textAlign: 'center',
        color: theme.palette.text.secondary,
        // backgroundImage: `url(${Background})`,
        // backgroundSize: '100%, 100%',
        // backgroundRepeat: 'no-repeat',

    }
});

class Invitation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //current user's info
            username: null,
            loggedIn: false,


            invitations: [],
            loaded: false
        }



    }

    componentDidMount() {

        this.setState(
            {
                username: this.props.user,
                loggedIn: this.props.loggedIn
            });

        var net_id = this.props.user;
        console.log(net_id)
        axios('api/invitation/receiver/' + net_id)
            .then(response => {
                var invitations = response.data.data;
                this.setState({
                    invitations: invitations,
                    loaded: true
                })
            })
            .catch(error => {
                console.log(error)
            })
    }


    //acceptHandler

    acceptHandler = (invitation) => {
        var invitation_id = invitation.invitation_id;
        var group_id = invitation.group_id
        var invitation_type = invitation.invitation_type
        var invitations = this.state.invitations
        var crn = invitation.course_CRN
        var net_id;
        if (invitation_type == 0) {
            //sender asks to join
            net_id = invitation.sender

        } else {
            //receiver invited to be joined
            net_id = this.state.username
        }

        //delete the invitation, as it is invalid anymore
        axios.delete('/api/invitation/' + invitation_id)
            .then(response => {
                //add the target user to group
                axios.post('api/group/' + group_id + '/add', {
                    net_id: net_id
                })
                    .then((response) => {
                        //if the user is in the queue, remove the user from the queue
                        axios.delete('api/queue/' + crn + "/user/" + net_id)
                            .then((response) => {
                                for (var i = 0; i < invitations.length; i++) {
                                    if (invitations[i].invitation_id == invitation_id) {
                                        invitations.splice(i, 1)
                                    }
                                }
                                this.setState({
                                    invitations: invitations
                                })
                                alert('added ' + net_id + ' to group ' + group_id)
                            })
                            .catch((error) => {
                                console.log(error)
                            })

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch(error => {
                console.log(error)
            })

    }

    //rejectHandler

    rejectHandler = (invitation) => {
        var invitation_id = invitation.invitation_id;
        var group_id = invitation.group_id
        var invitations = this.state.invitations
        axios.delete('/api/invitation/' + invitation_id)
            .then(response => {
                for (var i = 0; i < invitations.length; i++) {
                    if (invitations[i].invitation_id == invitation_id) {
                        invitations.splice(i, 1)
                    }
                }
                this.setState({
                    invitations: invitations
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        var { invitations, loaded } = this.state;
        var classes = this.props.classes;



        if (loaded) {

            const getInvitations = () => {
                if (invitations.length > 0) {
                    return (invitations.map((invitation, index) => {
                        var type = () => {
                            if (invitation.invitation_type == 0) {
                                return ("Joining request from: ")
                            } else {
                                return ("Group invitation from: ")
                            }

                        }
                        return (
                            <List.Item className={classes.comment} key={invitation.invitation_id}>
                                <List.Content>
                                    <List.Header>{type() + invitation.sender}</List.Header>
                                    <p>{" on group of: " + invitation.name}</p>
                                    <Button positive floated='right' onClick={() => { this.acceptHandler(invitation) }}>Accept</Button>

                                    <Button color="red" floated='right' onClick={() => { this.rejectHandler(invitation) }}>Reject</Button>

                                </List.Content>

                            </List.Item>)
                    }))
                } else{
                    return(
                        <p>You currently don't have any invitation</p>
                    )
                }
            }




                return (
                    <div className={classes.root}>
                        <Grid container spacing={1} direction="column">=
                    <Grid item xs={12}>
                                <Paper className={classes.outGrid}>
                                    <Typography variant='h4' color='primary'>Invitations</Typography>
                                    <List selection>
                                        {getInvitations()}
                                    </List>

                                </Paper>
                            </Grid>
                        </Grid>


                    </div>
                )
            } else {
                return (
                    <div className={classes.root}>
                        <Grid container spacing={1} direction="column">=
                    <Grid item xs={12}>
                                <Paper className={classes.outGrid}>
                                    <Typography variant='h4' color='primary'>Invitations</Typography>
                                    <p>Loading invitations</p>
                                </Paper>
                            </Grid>
                        </Grid>


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
const connectedInvitationPage = connect(mapStateToProps)(Invitation);
export default withStyles(styles)(connectedInvitationPage);