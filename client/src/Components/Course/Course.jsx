import React, { Component } from 'react'
import { Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { get } from 'http';
import axios from 'axios';


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
        color: theme.palette.text.secondary
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
    card: {
        margin: "5%"
    },
    course: {
        display: "inline-block",
        margin: "10px",
        cursor: "pointer",

    },
    courseCard: {
        cursor: "pointer",
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
    },
    image: {
        height: "50%",
        width: '100%',
        marginBottom: "5%"
    },
    vertical: {
        display: "flex",
        flexWrap: "wrap"
    },
    comment: {
        cursor: "pointer",

    }
});


class Course extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: [],
            groups: [],
            crn: this.props.match.params.id,
            courseCode: undefined,
            courseName: undefined,
            loaded: false,
            groupLoaded: false,
            queueLoaded: false
        }
    }

    componentDidMount() {
        //get course data
        var crn = this.props.match.params.id
        axios.get('api/course/' + crn)
        .then((response) => {
            var course = response.data.data[0];
            this.setState({
                crn: crn,
                courseCode: course.dept + course.idx,
                courseName: course.title,
                queue: [
                    {
                        firstName: "Ruiqi",
                        lastName: "Peng",
                        skills: ['Full stack'],
                        major: "Statistics & Computer Science"
                    },
                    {
                        firstName: "Yipeng",
                        lastName: "Han",
                        skills: ['Web Scraping']
                    },
                    {       
                        firstName: "Weiman",
                        lastName: "Yan",
                        skills: ["Electric engineering"]
                    }
                ],
    
                groups: [
                    {
                        groupId: 1,
                        groupName: "The Four",
                        projectName: "Coursehub",
                        founder: "Zhicong Fan",
                        student_current: 1,
                        student_limit: 4,
                        needed_skills: ["Full stack"]
                    },
                    {
                        groupId: 2,
                        groupName: "Abdu",
                        projectName: "Abdu",
                        founder: "Abdu",
                        student_current: 2,
                        student_limit: 4,
                        needed_skills: ["C++", "Java"]
                    }
    
                ],
                loaded: true
            })

        })
        .catch((error) => {
            console.log(error)
        })

        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loggedIn !== this.state.loggedIn) {
            this.setState(
                {
                    username: nextProps.user,
                    loggedIn: nextProps.loggedIn
                });
        }
    }
    

    render() {
        var classes = this.props.classes;
        var {
            queue,
            groups,
            crn,
            courseCode,
            courseName,
            loaded
        } = this.state



        const getQueue = queue.map((student, index) => {
            return (
                <List.Item className={classes.card}>
                    <Card className={classes.courseCard}>
                        <Card.Content>
                            <Typography variant='p' color='primary'>{student.firstName + " " + student.lastName}</Typography>
                        </Card.Content>
                        <Card.Content>
                            {student.skills.map((skill, index) => {
                                return (
                                    <Label>{skill}</Label>
                                )
                            })}
                        </Card.Content>
                    </Card>
                </List.Item>
            )
        })

        const getGroup = groups.map((group, index) => {
            return (
                <List.Item className={classes.card}>
                    <Card className={classes.courseCard}>
                        <Card.Content>
                            <Typography variant='p' color='primary'>{group.groupName}
                            </Typography>
                            <Label color = "red">{group.student_current + "/" + group.student_limit}</Label>
                            <br></br>
                            {group.founder}
                        </Card.Content>
                        <Card.Content>
                            {group.needed_skills.map((skill, index) => {
                                return (
                                    <Label>{skill}</Label>
                                )
                            })}
                        </Card.Content>
                    </Card>
                </List.Item>
            )
        })

        if (loaded) {
            return (
                <div className={classes.root}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant='h2' color='primary'>{courseCode + " - " + courseName}
                                </Typography>
                                {crn}
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography variant='h4' color='primary'>Matching queue</Typography>
                                        {getQueue}
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper className={classes.paper}>
                                        <Typography variant='h4' color='primary'>Groups</Typography>
                                        {getGroup}
                                    </Paper>


                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </div>
            )
        } else {
            return (
                <p>loading</p>
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
const connectedCoursePage = connect(mapStateToProps)(Course);
export default withStyles(styles)(connectedCoursePage);