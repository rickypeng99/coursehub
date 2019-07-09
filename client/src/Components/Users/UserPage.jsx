import React, { Component } from 'react'
import { Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';


const styles = theme => ({
    root: {
        margin: "100px",
        paddingTop: '10px',
        paddingLeft: '10%',
        paddingRight: '10%',
    },
    paper: {
        padding: theme.spacing(2),
        //textAlign: 'center',
        color: theme.palette.text.secondary,
    },

    paper_image: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    grid: {
        //display: "flex",
        // justifyContent: "center",
        // alignItems: "center"
    },
    list: {
        listStyle: "none"
    },
    course: {
        display: "inline-block",
        margin: "10px",
        cursor: "pointer",

    },
    courseCard: {
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
    },
    image: {
        height: "50%",
        width: '100%',
        marginBottom: "5%"
    },
    vertical:{
        display: "flex",
        flexWrap: "wrap"
    },
    comment: {
        cursor: "pointer",

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
            loaded: false,
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
            efficiency: 5,
            communication: 5,
            handsome: 5,
            text: "Ruiqi is an awesome dude!",
            date: currentDate,
            givenby: "Bill Gates"
        }

        var comment2 = {
            responsiveness: 5,
            efficiency: 5,
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
            major: ['Statistics & Computer Science - LAS', 'Linguistics - LAS'],
            classTaking: [
                {
                    name: "CS411 Q3",
                    crn: "30109"
                },
                {
                    name: "STAT420 1UG",
                    crn: "63856"
                },
                {
                    name: "STAT410 1GR",
                    crn: "65078"
                }],
            gpa: null,
            registered: false,
            comments: comments,
            loaded: true
        })
    }

    render() {
        var {
            netId, username, firstName, lastName, major, classTaking, comments, loaded
        } = this.state
        if (loaded) {
            var classes = this.props.classes




            const getMajorList = major.map((single, index) => {
                return (
                    <List.Item key={single}>
                        <Label color='red' horizontal>
                            {single.substring(single.indexOf('-') + 1)}
                        </Label>
                        <Typography color="primary">
                            {single}

                        </Typography>
                    </List.Item>
                )
            })

            const getCoursesList = classTaking.map((course, index) => {
                console.log(course)
                return (
                    <li className={classes.course}>
                        <Card className={classes.courseCard}>
                            <Card.Content header={course.name} color='red' />
                            <Card.Content description={course.crn} />
                        </Card>
                    </li>

                )
            })

            const getCommentList = comments.map((comment, index) => {
                return (
                    <List.Item className = {classes.comment}>
                        <div className = {classes.vertical}> 
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                            <Typography> Efficiency: </Typography>
                            <Rating icon="star" defaultRating = {comment.efficiency} maxRating = {5} disabled/>
                            <Typography> Communication: </Typography>
                            <Rating icon="star" defaultRating = {comment.communication} maxRating = {5} disabled/>
                            <Typography> Handsomeness: </Typography>
                            <Rating icon="star" defaultRating = {comment.handsome} maxRating = {5} disabled/>
                            <Typography> Responsiveness: </Typography>
                            <Rating icon="star" defaultRating = {comment.responsiveness} maxRating = {5} disabled/>
                        </div>
                        <List.Content>
                            <List.Header>{comment.givenby}</List.Header>
                            <p>{" Commented on " + comment.date}</p>
                            <List.Description>
                                {comment.text}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                )
            })


            return (
                <div className={classes.root}>
                    <Grid container spacing={2} direction="column">

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {/* Basic Profile */}
                                <Grid item xs={8}>
                                    <Grid container spacing={2} direction="column">
                                        <Grid item xs={12}>

                                            <Paper className={classes.paper}>
                                                <Typography variant='h2' color='primary'>{firstName + " " + lastName}</Typography>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper className={classes.paper}>
                                                <Typography variant='h4' color='primary'>Major</Typography>
                                                <List selection>

                                                    {getMajorList}
                                                </List>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper className={classes.paper}>
                                                <Typography variant='h4' color='primary'>Classes taking (Fall 2019)</Typography>
                                                <ul horizontal selection className={classes.list}>
                                                    {getCoursesList}
                                                </ul>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item xs={4}>
                                    <Grid container spacing={2} direction="column">


                                        <Grid item xs={12}>
                                            <Paper className={classes.paper_image}>

                                                <img className={classes.image} src={require('../Users/Ricky.jpg')} onDragStart={this.preventDragHandler} />
                                                <Button>Change profile photo</Button>
                                            </Paper>
                                        </Grid>



                                        <Grid item xs={12}>
                                            <Paper className={classes.paper_image}>
                                                <List horizontal>
                                                    <List.Item>
                                                        <Button>Follow</Button>

                                                    </List.Item>
                                                    <List.Item>
                                                    <Button>Follow</Button>

                                                    </List.Item>
                                                    <List.Item>
                                                    <Button>Follow</Button>

                                                    </List.Item>
                                                </List>

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
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} direction="column">
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <Typography variant='h4' color='primary'>Comments</Typography>
                                        <List relaxed='very' animated>
                                            {getCommentList}
                                        </List>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </div>

            )
        } else {
            return (
                <p>Loading</p>
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
const connectedUserPage = connect(mapStateToProps)(User);

export default withStyles(styles)(connectedUserPage);

