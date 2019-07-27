import React, { Component } from 'react'
import { Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating, Modal, Header, Tab, Segment, Menu } from 'semantic-ui-react';
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
        marginTop: "100px",
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
        width: "50%"
    },

    buttonContainer: {
        display: "flex"
    },
    tab: {
        width: "50%"
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
             * logged in user's status
             */

            isInGroup: false,
            isInMatchingQueue: false,
            //isFounder: false,

            /**
             * viewing options
             */
            viewMyProfile: true,
            viewMyGroup: true,
            myGroup: null,
            myProfile: null,
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

                //load the cuurent user's status
                axios.get('api/course/' + crn + '/user/' + this.props.user)
                    .then(response => {
                        var status = response.data.data;
                        this.setState({
                            isInGroup: status.isInGroup,
                            isInMatchingQueue: status.isInMatchingQueue,
                            crn: crn,
                            courseCode: course.dept + course.idx,
                            courseName: course.title,
                            loaded: true,
                            myGroup: status.group
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
                                            var myGroup = this.state.myGroup
                                            var mygroup_id = null
                                            if (myGroup) {
                                                mygroup_id = myGroup.group_id
                                            }
                                            for (var i = 0; i < response.length; i++) {
                                                var currentSkill = response[i].data.data;
                                                groups[i].skills = currentSkill
                                                if (mygroup_id) {
                                                    if (mygroup_id == groups[i].group_id) {
                                                        myGroup.skills = currentSkill
                                                    }
                                                }
                                            }
                                            this.setState({
                                                myGroup: myGroup,
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
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })


        //get queue
        axios.get('api/course/' + crn + '/queue')
            .then(response => {
                var queue = response.data.data;


                //get profile for current user (incase he didn't join the matching queue)

                axios.get('api/user/' + this.props.user + '/skill')
                    .then(response => {
                        var myProfile = response.data.data;
                        if (queue.length > 0) {
                            var promises = []
                            for (var i = 0; i < queue.length; i++) {
                                promises.push(axios.get('api/skill/user/' + queue[i].net_id))
                            }
                            Promise.all(promises)
                                .then(response => {
                                    //add the array of skills to each queue

                                    for (var i = 0; i < response.length; i++) {
                                        var currentSkill = response[i].data.data;
                                        queue[i].skills = currentSkill
                                    }

                                    this.setState({
                                        queue: queue,
                                        queueLoaded: true,
                                        myProfile: myProfile
                                    })
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        } else {

                            this.setState({
                                queue: queue,
                                queueLoaded: true,
                                myProfile: myProfile
                            })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })


            })
            .catch(error => {
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
                var myGroup = newGroup;

                this.setState({
                    myGroup: myGroup,
                    groups: tempGroups,
                    isInGroup: true
                })
            })
            .catch(error => {
                console.log(error)
            })
    })

    joinQueue = (() => {
        axios.post('api/queue/' + this.state.crn, {
            'net_id': this.props.user
        })
            .then((response) => {
                console.log(response.data)
                axios.get('api/user/' + this.props.user + '/skill')
                    .then(response => {
                        var addedUser = response.data.data;
                        var queue = this.state.queue;
                        queue.push(addedUser);
                        this.setState({
                            queue: queue,
                            isInMatchingQueue: true
                        })
                    })
                    .catch(error => {
                        console.log(error)
                    })


            })
            .catch((error) => {
                console.log(error)
            })
    })

    removeFromQueue = (() => {
        axios.delete('api/queue/' + this.state.crn + "/user/" + this.props.user)
            .then((response) => {
                var queue = this.state.queue;
                for (var i = 0; i < queue.length; i++) {
                    if (queue[i].net_id == this.props.user) {
                        queue.splice(i, 1);

                    }
                }
                this.setState({
                    queue: queue,
                    isInMatchingQueue: false
                })

            })
            .catch((error) => {
                console.log(error)
            })
    })

    handleProfileClick = ((e, { name }) => {
        if (name == 'My profile') {
            this.setState({
                viewMyProfile: true
            })
        } else {
            this.setState({
                viewMyProfile: false
            })
        }
    })

    handleGroupClick = ((e, { name }) => {
        if (name == 'My group') {
            this.setState({
                viewMyGroup: true
            })
        } else {
            this.setState({
                viewMyGroup: false
            })
        }
    })

    joinGroup = ((group) => {
        var group_id = group.group_id
        axios.post('api/group/' + group_id + '/add', {
            net_id: this.state.username
        })
            .then((response) => {
                var groups = this.state.groups
                var myGroup = group
                for (var i = 0; i < groups.length; i++) {
                    if (groups[i].group_id == group_id) {
                        groups[i].students_current++;
                        myGroup = group
                        break;
                    }
                }
                this.setState({
                    myGroup: myGroup,
                    groups: groups,
                    isInGroup: true
                })

            })
            .catch((error) => {
                console.log(error)
            })
    })

    //leave group
    leaveGroup = ((group) => {
        var group_id = group.group_id
        axios.post('api/group/' + group_id + '/remove', {
            net_id: this.state.username
        })
            .then((response) => {
                var groups = this.state.groups
                var myGroup = null
                var result = response.data.data;

                if (result == "removed") {
                    //remove the group from local
                    for (var i = 0; i < groups.length; i++) {
                        if (groups[i].group_id == group_id) {
                            groups.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    //modify the students_current
                    for (var i = 0; i < groups.length; i++) {
                        if (groups[i].group_id == group_id) {
                            groups[i].students_current--;
                            break;
                        }
                    }
                }

                this.setState({
                    myGroup: myGroup,
                    groups: groups,
                    isInGroup: false
                })
            })
            .catch((error) => {
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
            queueLoaded,
            isInMatchingQueue,
            isInGroup,
            viewMyProfile,
            viewMyGroup,
            myGroup,
            myProfile
        } = this.state

        //overflow-y: scroll;

        const getQueue = () => {
            if (queueLoaded) {
                //console.log(queue)
                return (
                    queue.map((student, index) => {
                        return (
                            <List.Item className={classes.card}>
                                <Card fluid className={classes.courseCard}>
                                    <Card.Content>
                                        <Typography color='primary'>{student.first_name + " " + student.last_name}</Typography>
                                        <Typography>{student.net_id}</Typography>
                                    </Card.Content>
                                    <Card.Content>
                                        <p>Skills:</p>
                                        {student.skills.map((skill, index) => {
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
                    <p>Loading queue...</p>
                )
            }
        }





        const getGroup = () => {
            const typoLabelStyle = {
                display: "flex"
            }
            //dealing if the groups are loaded from axios
            if (groupLoaded) {
                //dealing with courses that have no group 
                if (groups.length > 0) {
                    return (groups.map((group, index) => {
                        //console.log(group.skills)
                        return (
                            <List.Item className={classes.card}>
                                <Card fluid className={classes.courseCard}>
                                    <Card.Content>
                                        <div style={typoLabelStyle}>
                                            <Typography color='primary'>{group.name}</Typography>
                                            <Label color="red">{group.students_current + "/" + group.students_limit}</Label>
                                        </div>

                                        <Typography>{'Founder: ' + group.founder}</Typography>

                                        <Typography color='primary'>{group.description}</Typography>


                                    </Card.Content>
                                    <Card.Content>
                                        <p>Needed skills: </p>
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
                                        <br></br>
                                        <Button primary floated='right' disabled={isInGroup} onClick={() => { this.joinGroup(group) }}>Join</Button>
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


        const whichProfileSegment = () => {
            if (viewMyProfile) {
                if (myProfile && queueLoaded) {
                    return (
                        <Segment attached="bottom" className={classes.paperGroups}>
                            <List.Item className={classes.card}>
                                <Card fluid className={classes.courseCard}>
                                    <Card.Content>
                                        <Typography color='primary'>{myProfile.first_name + " " + myProfile.last_name}</Typography>
                                        <Typography>{myProfile.net_id}</Typography>
                                    </Card.Content>
                                    <Card.Content>
                                        <p>Skills:</p>
                                        {myProfile.skills.map((skill, index) => {
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
                        </Segment>

                    )
                } else {
                    return (
                        <Segment attached="bottom" className={classes.paperGroups}>
                            <p>Loading your profile...</p>
                        </Segment>
                    )

                }
            } else {
                return (
                    <Segment attached="bottom" className={classes.paperGroups}>

                        {getQueue()}
                    </Segment>
                )
            }
        }


        const whichGroupSegment = () => {
            if (viewMyGroup) {
                const typoLabelStyle = {
                    display: "flex"
                }

                if (myGroup && groupLoaded && myGroup.skills) {

                    //since the group_name is differrent from name. Please dont make such errors again....
                    const group_name = (() => {
                        if (!myGroup.group_name) {
                            return myGroup.name
                        } else {
                            return myGroup.group_name
                        }
                    })

                    return (
                        <Segment attached="bottom" className={classes.paperGroups}>
                            <List.Item className={classes.card}>

                                <Card fluid className={classes.courseCard}>
                                    <Card.Content>
                                        <div style={typoLabelStyle}>
                                            <Typography color='primary'>{group_name()}</Typography>
                                            <Label color="red">{myGroup.students_current + "/" + myGroup.students_limit}</Label>
                                        </div>

                                        <Typography>{'Founder: ' + myGroup.founder}</Typography>

                                        <Typography color='primary'>{myGroup.description}</Typography>


                                    </Card.Content>
                                    <Card.Content>
                                        <p>Needed skills: </p>
                                        {myGroup.skills.map((skill, index) => {
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
                                        <br></br>
                                        <Button negative floated='right' onClick={() => { this.leaveGroup(myGroup) }}>Leave</Button>
                                    </Card.Content>
                                </Card>
                            </List.Item>


                        </Segment>
                    )


                } else if (groupLoaded && !myGroup) {
                    return (
                        <Segment attached="bottom" className={classes.paperGroups}>
                            <p>You are not in any group yet! Create a group or join a group!</p>
                        </Segment>
                    )

                } else {
                    return (
                        <Segment attached="bottom" className={classes.paperGroups}>
                            <p>Loading your group...</p>
                        </Segment>

                    )
                }

            } else {
                return (
                    <Segment attached="bottom" className={classes.paperGroups}>

                        {getGroup()}
                    </Segment>
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


                                    <Button.Group attached='bottom'>
                                        <Button className={classes.button} color="green" onClick={this.joinQueue} disabled={isInMatchingQueue || isInGroup}>Click to join the queue!</Button>
                                        <Button className={classes.button} color="red" onClick={this.removeFromQueue} disabled={!isInMatchingQueue || isInGroup}>Click to leave the queue!</Button>
                                    </Button.Group>
                                    {/* tabs */}
                                    <div>
                                        <Menu attached="top" tabular >
                                            <Menu.Item
                                                name="My profile"
                                                active={viewMyProfile}
                                                onClick={this.handleProfileClick}
                                                className={classes.tab}

                                            />
                                            <Menu.Item
                                                name="Others"
                                                active={!viewMyProfile}
                                                onClick={this.handleProfileClick}
                                                className={classes.tab}

                                            />
                                        </Menu>
                                        {whichProfileSegment()}
                                    </div>

                                    {/* Put conditional segments here */}


                                </Grid>
                                <Grid item xs={6}>

                                    <Paper className={classes.paper}>
                                        <Typography variant='h4' color='primary'>Groups</Typography>
                                    </Paper>


                                    <Button.Group attached='top'>
                                        <GroupModal isFounder={this.setState.isFounder} isInGroup={this.state.isInGroup} isInMatchingQueue={this.state.isInMatchingQueue} classes={classes} createGroup={this.createGroup} courseName={courseNameForModal} username={username} crn={this.state.crn}></GroupModal>
                                        <Button inline className={classes.button} color="orange">Click to find matched groups</Button>
                                    </Button.Group>
                                    <div>
                                        <Menu attached="top" tabular>
                                            <Menu.Item
                                                name="My group"
                                                active={viewMyGroup}
                                                onClick={this.handleGroupClick}
                                                className={classes.tab}
                                            />
                                            <Menu.Item
                                                name="All groups"
                                                active={!viewMyGroup}
                                                onClick={this.handleGroupClick}
                                                className={classes.tab}

                                            />
                                        </Menu>
                                        {whichGroupSegment()}
                                    </div>


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