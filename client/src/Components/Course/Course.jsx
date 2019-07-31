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
import GroupSettingModal from '../Course/GroupSettingModal'
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
    buttonQueue: {
        width: "33%"
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
            viewMyProfile: false,
            viewMyGroup: false,
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
                        var myGroup = status.group;

                        //get teammates of my group
                        if (myGroup) {
                            axios.get('api/group/' + myGroup.group_id + '/teammate')
                                .then(response => {
                                    myGroup.teammate = response.data.data;

                                    this.setState({
                                        isInGroup: status.isInGroup,
                                        isInMatchingQueue: status.isInMatchingQueue,
                                        crn: crn,
                                        courseCode: course.dept + course.idx,
                                        courseName: course.title,
                                        loaded: true,
                                        myGroup: status.group
                                    })
                                })

                        } else {
                            this.setState({
                                isInGroup: status.isInGroup,
                                isInMatchingQueue: status.isInMatchingQueue,
                                crn: crn,
                                courseCode: course.dept + course.idx,
                                courseName: course.title,
                                loaded: true,
                                myGroup: status.group
                            })
                        }



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


    updateGroup = ((props) => {
        axios.put('api/group/' + props.group_id, props)
            .then(response => {
                var group_id = response.data.data;
                axios.get('api/group/' + group_id + '/skill')
                    .then(response => {
                        var myGroup = response.data.data
                        this.setState({
                            myGroup: myGroup
                        })
                    })
                    .catch(error => {
                        console.log(error)
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

    invite = ((student) => {
        var receiver = student.net_id;
        var sender = this.state.username;
        var group_id = this.state.myGroup.group_id;
        var invitation_type = 1;


        axios.post('api/invitation', {
            sender: sender,
            receiver: receiver,
            group_id: group_id,
            invitation_type: invitation_type
        })
            .then(response => {
                alert("Successfully sent request to " + receiver)
            })
            .catch((error) => {
                console.log(error)
            })
    })

    //join group, will be changed to using invitations later
    joinGroup = ((group) => {
        var group_id = group.group_id
        axios.post('api/invitation', {
            sender: this.state.username,
            receiver: group.founder,
            group_id: group_id,
            invitation_type: 0
        })
            .then((response) => {
                alert("Successfully sent request to " + group.founder)
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

    /**
     * recommend groups
     */
    recommendGroups = (() => {
        const skill_ratio = ((userSkills, groupSkills) => {
            let intersection = userSkills.filter(x => groupSkills.includes(x));
            //console.log(userSkills)
            //console.log(groupSkills)
            return (intersection.length / groupSkills.length)
        })
        var crn = this.state.crn;
        var skills = this.state.myProfile.skills;

        var internal_point = this.state.myProfile.internal_point;
        //update current groups
        // axios.get('api/course/'+ crn  +'/group')
        // .then(response => {

        // })
        // .catch((error) => {
        //     console.log(error)
        // })

        axios.get('api/course/' + crn + '/group/average')
            .then((response) => {
                var returnGroups = response.data.data;
                var groups = this.state.groups;
                groups.sort(function (a, b) { return parseInt(a.group_id - b.group_id) });
                returnGroups.sort(function (a, b) { return parseInt(a.group_id - b.group_id) });
                for (var i = 0; i < groups.length; i++) {
                    groups[i].average = returnGroups[i]['AVG(U.internal_point)']
                    var currentSkill = [];
                    for (var j = 0; j < groups[i].skills.length; j++) {
                        currentSkill.push(groups[i].skills[j].skill)
                    }
                    console.log(internal_point)
                    groups[i].skill_ratio = skill_ratio(skills, currentSkill)
                    groups[i].actualPoint = Math.max(500 - Math.abs(internal_point - groups[i].average), 0) * 0.08 + 2 * groups[i].skill_ratio;
                }


                groups.sort(function (a, b) { return parseFloat(b.actualPoint - a.actualPoint) })

                console.log(groups)

                this.setState({
                    groups: groups
                })

            })

    })


    /**
     * recommend student for your group
     */
    recommendStudents = (() => {
        const skill_ratio = ((userSkills, groupSkills) => {
            let intersection = userSkills.filter(x => groupSkills.includes(x));
            return (intersection.length / groupSkills.length)
        })
        //get skills of my current group
        var group_id = this.state.myGroup.group_id;
        //get average internal point of my current group
        axios.get('api/group/' + group_id + '/average')
            .then(response => {
                var myAverage = response.data.data[0]["AVG(U.internal_point)"]
                var students = this.state.queue;

                for (var i = 0; i < students.length; i++) {
                    var internal_point = students[i].internal_point;
                    var studentsSkills = students[i].skills.map((skill, index) => {
                        return skill.skill;
                    })
                    var myGroupSkill = this.state.myGroup.skills.map((skill, index) => {
                        return skill.skill;
                    })
                    students[i].skill_ratio = skill_ratio(studentsSkills, myGroupSkill);
                    students[i].actualPoint = Math.max(500 - Math.abs(internal_point - myAverage), 0) * 0.08 + 2 * students[i].skill_ratio;
                }
                students.sort(function (a, b) { return parseFloat(b.actualPoint - a.actualPoint) })

                console.log(students)

                this.setState({
                    queues: students
                })

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
                if (queue.length > 0) {
                    return (
                        queue.map((student, index) => {
                            return (
                                <List.Item className={classes.card}>
                                    <Card fluid>
                                        <Card.Content onClick={() => {
                                            this.props.history.push('/user/' + student.net_id
                                            )
                                        }} className={classes.courseCard}>
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
                                            <Button primary floated='right' disabled={!isInGroup} onClick={() => { this.invite(student) }}>Invite</Button>
                                        </Card.Content>
                                    </Card>
                                </List.Item>
                            )
                        })
                    )
                } else {
                    return (
                        <p>This course curretly has no one in its matching queue</p>
                    )
                }

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
                                        <Button primary floated='right' disabled={isInGroup} onClick={() => { this.joinGroup(group) }}>Ask to join</Button>
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

                    const teammates = myGroup.teammate.map((student, index) => {
                        return (
                            <List.Item className={classes.card}>

                                <Card fluid className={classes.courseCard}>
                                    <Card.Content onClick={() => {
                                        this.props.history.push('/user/' + student.net_id
                                        )
                                    }}>
                                        {student.net_id}
                                    </Card.Content>
                                </Card>
                            </List.Item>

                        )
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
                                        <GroupSettingModal
                                            group_id={myGroup.group_id}
                                            isFounder={this.setState.isFounder} isInGroup={this.state.isInGroup} classes={classes} updateGroup={this.updateGroup} courseName={courseNameForModal} username={username} crn={this.state.crn}></GroupSettingModal>
                                        <Button negative floated='right' onClick={() => { this.leaveGroup(myGroup) }}>Leave</Button>

                                    </Card.Content>
                                </Card>
                                <Typography>Teammates:</Typography>

                            </List.Item>
                            {teammates}

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
                                        <Button className={classes.buttonQueue} color="green" onClick={this.joinQueue} disabled={isInMatchingQueue || isInGroup}>Click to join the queue!</Button>
                                        <Button className={classes.buttonQueue} color="red" onClick={this.removeFromQueue} disabled={!isInMatchingQueue || isInGroup}>Leave the queue!</Button>
                                        <Button className={classes.buttonQueue} color="orange" onClick={this.recommendStudents} disabled={!isInGroup}>Find matched students!</Button>
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
                                                name="Matching queue"
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
                                        <Button inline className={classes.button} onClick={this.recommendGroups} color="orange">Click to find matched groups</Button>
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