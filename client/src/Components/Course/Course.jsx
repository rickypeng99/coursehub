import React, { Component } from 'react'
import { Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating, Modal, Header } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { get } from 'http';
import axios from 'axios';
import GroupModal from '../Course/Modal'

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
        //overflowY: "scroll" 
    },

    paperGroups: {
        padding: theme.spacing(2),
        //textAlign: 'center',
        color: theme.palette.text.secondary,
        overflowY: "scroll",
        height: "500px"
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

    },

    button: {
        width: "100%"
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
            queueLoaded: false,

            username: null,
            loggedIn: false,

            /**
             * user specific
             */

            isInGroup: false,
            isInMatchingQueue: false,
            isFounder: false,

        }
    }

    componentDidMount() {

        this.setState(
            {
                username: this.props.user,
                loggedIn: this.props.loggedIn
            });

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
                    loaded: true
                })

            })
            .catch((error) => {
                console.log(error)
            })
        //get groups
        axios.get('api/course/' + crn + '/group')
            .then(response => {
                var groups = response.data.data;
                //console.log(groups[0].group_id)
                if (groups.length > 0) {
                    var promises = []
                    for (var i = 0; i < groups.length; i++) {
                        promises.push(axios.get('api/skill/group/' + groups[i].group_id))
                    }
                    Promise.all(promises)
                        .then(response => {
                            //add the array of skills to each group
                            for (var i = 0; i < response.length; i++) {
                                var currentSkill = response[i].data.data;
                                groups[i].skills = currentSkill
                            }
                            console.log(groups)
                            this.setState({
                                groups: groups,
                                groupLoaded: true
                            })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                } else {
                    this.setState({
                        groups: groups,
                        groupLoaded: true
                    })
                }

                //get all promises to get skills for each group

            })
            .catch(error => {
                console.log(error)
            })

        // //get queue
        // axios.get('api/course/' + crn + 'queue')
        //     .then(response => {
        //         var queue = response.data.data;
        //         if (queue.length > 0) {
        //             var promises = []
        //             for (var i = 0; i < groups.length; i++) {
        //                 promises.push(axios.get('api/skill/group/' + groups[i].group_id))
        //             }
        //             Promise.all(promises)
        //                 .then(response => {
        //                     //add the array of skills to each group
        //                     for (var i = 0; i < response.length; i++) {
        //                         var currentSkill = response[i].data.data;
        //                         groups[i].skills = currentSkill
        //                     }
        //                     console.log(groups)
        //                     this.setState({
        //                         groups: groups,
        //                         groupLoaded: true
        //                     })
        //                 })
        //                 .catch(error => {
        //                     console.log(error)
        //                 })
        //         }


        //         this.setState({
        //             queue
        //         })
        //     })

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loggedIn !== this.state.loggedIn) {
            this.setState(
                {
                    username: nextProps.user,
                    loggedIn: nextProps.loggedIn
                });
        }
        if (nextProps.location !== this.props.location) {
            window.location.reload();

        }
    }



    createGroup = ((props) => {
        console.log(props)

        axios.post('api/group', props)
            .then(response => {
                var newGroup = response.data.data;
                var tempGroups = this.state.groups;
                tempGroups.push(newGroup);
                console.log(tempGroups)
                this.setState({
                    groups: tempGroups
                })
            })
            .catch(error => {
                console.log(error)
            })
    })

    render() {
        var classes = this.props.classes;
        var {
            queue,
            groups,
            crn,
            courseCode,
            courseName,
            username,
            loggedIn,
            loaded,
            groupLoaded,
            queueLoaded
        } = this.state

        //overflow-y: scroll;

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

        const getGroup = () => {
            //dealing if the groups are loaded from axios
            if (groupLoaded) {
                //dealing with courses that have no group 
                if (groups.length > 0) {
                    return (groups.map((group, index) => {
                        //console.log(group.skills)
                        return (
                            <List.Item className={classes.card}>
                                <Card className={classes.courseCard}>
                                    <Card.Content>
                                        <Typography variant='p' color='primary'>{group.name}</Typography>
                                        <Label color="red">{group.students_current + "/" + group.students_limit}</Label>
                                        <br></br>
                                        <Typography variant='p'>{group.founder}</Typography>
                                        <br></br>

                                        <Typography variant='p' color='primary'>{group.description}</Typography>


                                    </Card.Content>
                                    <Card.Content>
                                        <p>Neede skills: </p>
                                        {group.skills.map((skill, index) => {
                                            //this is for groups that are newly created, such that we can perform state change instaead of reloading the website
                                            if (skill.skill == undefined) {
                                                return (
                                                    <Label>{skill}</Label>
                                                )
                                            }
                                            return (
                                                <Label>{skill.skill}</Label>
                                            )
                                        })}
                                    </Card.Content>
                                </Card>
                            </List.Item>
                        )
                    })
                    )
                } else {
                    return (
                        <p>This course currently doesn't have any group</p>
                    )
                }

            } else {
                return (
                    <p>Loading groups...</p>
                )
            }
        }





        if (loaded) {
            //console.log("fuckscscsac" + username)
            var courseNameForModal = courseCode + " - " + courseName + " " + crn
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
                                    </Paper>
                                    <div>
                                        <Button className={classes.button} color="green">Click to join the queue!</Button>
                                    </div>
                                    <Paper className={classes.paperGroups}>
                                        {getQueue}
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>

                                    <Paper className={classes.paper}>
                                        <Typography variant='h4' color='primary'>Groups</Typography>
                                    </Paper>
                                    <div>
                                        {/* <Button className={classes.button} primary>Click to create a new group</Button> */}
                                        {/* {ModalModalExample()} */}
                                        <GroupModal isFounder={this.setState.isFounder} isInGroup={this.state.isInGroup} isInMatchingQueue={this.state.isInMatchingQueue} classes={classes} createGroup={this.createGroup} courseName={courseNameForModal} username={username} crn={this.state.crn}></GroupModal>
                                    </div>
                                    <Paper className={classes.paperGroups}>
                                        {getGroup()}
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