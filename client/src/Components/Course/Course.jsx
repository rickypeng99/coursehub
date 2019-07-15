import React, { Component } from 'react'
import { Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { get } from 'http';


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
            crn: null,
            className: null,
            loaded: false
        }
    }

    componentDidMount() {
        this.setState({
            queue: [
                {
                    firstName: "Ruiqi",
                    lastName: "Peng",
                    skills: ['Fucking pussies', "being cool"],
                    major: "Statistics & Computer Science"
                },
                {
                    firstName: "Yipeng",
                    lastName: "Han",
                    skills: ['Knows nothing']
                },
                {       
                    firstName: "Weiman",
                    lastName: "Yan",
                    skills: ["Eating shit"]
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
                    needed_skills: ["Masturbate"]
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

            crn: "30109",
            className: "CS411 Q3",
            loaded: true
        })
    }

    render() {
        var classes = this.props.classes;

        var {
            queue,
            groups,
            crn,
            className,
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
                                <Typography variant='h2' color='primary'>{className}
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