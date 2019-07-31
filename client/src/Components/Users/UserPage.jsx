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
        marginTop: "100px",
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
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
        //height: "180px",

    },
    image: {
        height: "50%",
        width: '50%',
        marginBottom: "5%"
    },
    vertical: {
        display: "flex",
        flexWrap: "wrap"
    },
    comment: {
        cursor: "pointer",

    },
    
});


class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null, // netid of the current user
            loggedIn: false,
            /**
             * basic info of this user
             */
            netId: null,
            firstName: null,
            lastName: null,
            major: null,
            gpa: null,
            registered: false,
            comments: [],
            /**
             * for uploading images
             */
            image: require('../../Common/images/user_images/default.jpg'),
            file: null,
            /**
             * checking if every async stuff have been loaded
             */
            loaded: false,
            /**
             * comment section
             */
            commentsLoaded: false,
            commenting: null, //contents to comment
            efficiency: null,
            communication: null,
            responsiveness: null,

            /**
             * skills section
             */
            skillsLoaded: false,
            skills: [],

            /**
             * queue & groups section
             */

            queueLoaded: false,
            queues: [],
            groupLoaded: false,
            groups: []
        }
    }
    fileInputRef = React.createRef();

    componentDidMount() {
        var comments = []

        let now = new Date();
        var day = String(now.getDate()).padStart(2, '0');
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var year = now.getFullYear();
        var time = now.toTimeString();
        var currentDate = month + '/' + day + '/' + year + " at " + time;

        var netId = this.props.match.params.id

        this.setState({
            username: this.props.user,
            loggedIn: this.props.loggedIn
        })
        //Checking if the user has an image, will be implemented later in the backend

        const tryRequire = (path) => {
            try {
                return require(`${path}`);
            } catch (err) {
                return require('../../Common/images/user_images/default.jpg');
            }
        };
        const imageAddress = tryRequire('../../Common/images/user_images/' + netId + '.jpg')

        //requests to get the user's detail
        axios.get('api/user/' + netId)
            .then(result => {
                //console.log(result.data.data);
                console.log(result.data.data[0].internal_point)
                this.setState({
                    netId: this.props.match.params.id,
                    firstName: result.data.data[0].first_name,
                    lastName: result.data.data[0].last_name,
                    major: result.data.data[0].major,
                    description: result.data.data[0].description,
                    //gpa: result.data.,
                    registered: false,
                    image: imageAddress,
                    loaded: true
                })


            })
            .catch(error => {
                console.log(error);
            })

        axios.get('api/user/' + netId + '/comment')
            .then(result => {
                this.setState({
                    comments: result.data.data,
                    commentsLoaded: true,

                })
            })
            .catch(error => {
                console.log(error);
            })

        axios.get('api/skill/user/' + netId)
            .then(result => {

                var skills = [];
                for (var i = 0; i < result.data.data.length; i++) {
                    skills.push(result.data.data[i].skill);
                }
                this.setState({
                    skills: skills,
                    skillsLoaded: true,

                })
            })
            .catch(error => {
                console.log(error);
            })
        //get all groups of this user
        axios.get('api/user/' + netId + '/group')
            .then((response) => {
                var results = response.data.data;
                var groups = []
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        var group = {
                            group_name: results[i].name,
                            students_current: results[i].students_current,
                            students_limit: results[i].students_limit,
                            description: results[i].description,
                            /**
                             * course information of this group
                             */
                            course_CRN: results[i].course_CRN,
                            course_dept: results[i].dept,
                            course_idx: results[i].idx,
                            course_title: results[i].title,
                            course_session: results[i].session
                        }
                        groups.push(group);
                    }

                }

                this.setState({
                    groups: groups,
                    groupLoaded: true
                })
            })
            .catch(error => {
                console.log(error)
            })

        //get all queues of this user
        axios.get('api/user/' + netId + '/queue')
            .then((response) => {
                var results = response.data.data;
                var queues = []
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        var queue = {
                            /**
                             * course information of this queue
                             */
                            course_CRN: results[i].CRN,
                            course_dept: results[i].dept,
                            course_idx: results[i].idx,
                            course_title: results[i].title,
                            course_session: results[i].session
                        }
                        queues.push(queue);
                    }

                }

                this.setState({
                    queues: queues,
                    queueLoaded: true
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

    /**
     * changing profile pic hasn't been finished yet
     */
    fileChange = e => {
        this.setState({ file: e.target.files[0] }, () => {
            console.log("File chosen --->", this.state.file);
        });
    };

    submitHandler = (event) => {
        axios.post('api/comment', {
            user_id: this.state.username,
            efficiency: this.state.efficiency,
            responsiveness: this.state.responsiveness,
            communication: this.state.communication,
            content: this.state.commenting,
            course_CRN: 30109,
            receiver: this.state.netId
        })
            .then((response) => {
                var comments = this.state.comments
                comments.push(response.data.data)


                axios.put('api/comment/' + this.state.netId, {
                    comment_id: response.data.data.comment_id
                })
                .then(response => {
                    this.setState({
                        comments: comments
                    })
                })
                .catch(error => {
                    console.log(error)
                })

                
            })
            .catch((error) => {
                console.log("error")
            })
    }

    /**
     * Getting the values from the rating sections
     */
    changeHandler = ((event) => {
        this.setState({ [event.target.name]: event.target.value });
    })

    efficiencyHandler = (event, data) => {
        this.setState({
            efficiency: data.rating
        })
    }

    communicationHandler = (event, data) => {
        this.setState({
            communication: data.rating
        })
    }

    responsivenessHandler = (event, data) => {
        this.setState({
            responsiveness: data.rating
        })
    }
    login = (() => {
        this.props.history.push('/login')
    })

    deleteCommentHandler = (event, data) => {
        var comment_id = event.target.value;
        axios.delete('api/comment/' + comment_id)
            .then(result => {
                //console.log("hi")
                var comments = this.state.comments;
                for (var i = 0; i < comments.length; i++) {
                    if (comments[i].comment_id == comment_id) {
                        comments.splice(i, 1)
                        break;
                    }
                }
                this.setState({
                    comments: comments
                })
            })
            .catch(error => {
                console.log(error)
            })
    }
    render() {
        var {
            netId, username, loggedIn, firstName, lastName, major, groups, comments, description, loaded, image, commenting, commentsLoaded, efficiency, responsiveness, communication, skills, skillsLoaded, groupLoaded, queues, queueLoaded
        } = this.state

        if (loaded) {
            var classes = this.props.classes

            //console.log(loggedIn)
            //console.log(username)

            const getSkillList = () => {
                if (skillsLoaded) {
                    return (
                        skills.map((skill, index) => {
                            return (
                                <Label>
                                    {skill}
                                </Label>
                            )
                        })
                    )

                } else {
                    return (
                        <p>Loading skills...</p>
                    )
                }
            }



            /**
             * mapping groups
             */
            const getGroupsList = () => {
                if (groupLoaded) {
                    return (
                        groups.map((group, index) => {
                            //console.log(course)
                            return (
                                <List.Item className={classes.course}onClick={() => {this.props.history.push('/course/' + group.course_CRN
                                )}}>
                                    <Card className={classes.courseCard}>
                                        <Card.Content>
                                            <Typography variant='h5' color='primary'>{group.group_name}</Typography>
                                            <Typography color='primary'>{group.course_dept + group.course_idx + ' - ' + group.course_title 
                                            //+ ' ' 
                                            //+ queue.course_session
                                            }</Typography>
                                            <Label color='blue'>Group</Label>
                                            <Label color='red'>{
                                                group.students_current + '/' + group.students_limit
                                            }</Label>
                                        </Card.Content>
                                        <Card.Content description={group.description} />
                                    </Card>
                                </List.Item>

                            )
                        }
                        )
                    )
                } else {
                    return (
                        <p>Loading the groups that this user has joined</p>
                    )
                }
            }


            /**
             * mapping queues
             */
            const getQueuesList = () => {
                if (queueLoaded) {
                    return (
                        queues.map((queue, index) => {
                            //console.log(course)
                            return (
                                <List.Item className={classes.course} onClick={() => {this.props.history.push('/course/' + queue.course_CRN
                                )}}>
                                    <Card className={classes.courseCard}>
                                        <Card.Content>
                                            
                                            <Typography variant='h5' color='primary'>{queue.course_dept + queue.course_idx + ' - ' + queue.course_title 
                                            //+ ' ' 
                                            //+ queue.course_session
                                        }</Typography>
                                            <Label color='orange'>Matching queue</Label>
                                        </Card.Content>
                                        {/* <Card.Content description={group.description} /> */}
                                    </Card>
                                </List.Item>

                            )
                        }
                        )
                    )
                } else {
                    return (
                        <p>Loading the groups that this user has joined</p>
                    )
                }
            }



            const showComments = () => {
                if (commentsLoaded) {
                    if(this.state.comments.length > 0){
                        return (
                            <List animated>
                                {getCommentList}
                            </List>
                        )
                    } else{
                        return (
                            <p>{firstName + ' has no previous comment'}</p>
                        )
                    }
                    

                } else {
                    return (
                        <p>Loading comments</p>
                    )
                }
            }

            const getCommentList = comments.map((comment, index) => {
                const disabled = comment.user_id != username
                return (
                    <List.Item className={classes.comment}>
                        <div className={classes.vertical}>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                            <Typography> Efficiency: </Typography>
                            <Rating icon="star" defaultRating={comment.efficiency} maxRating={5} disabled />
                            <Typography> Communication: </Typography>
                            <Rating icon="star" defaultRating={comment.communication} maxRating={5} disabled />
                            <Typography> Responsiveness: </Typography>
                            <Rating icon="star" defaultRating={comment.responsiveness} maxRating={5} disabled />

                        </div>
                        <List.Content>
                            <List.Header>{comment.user_id}</List.Header>
                            <p>{" on course with CRN: " + comment.course_CRN}</p>
                            {/* <p>{" Commented on " + comment.date}</p> */}
                            <Button color="red" floated='right' disabled={disabled} value={comment.comment_id} onClick={this.deleteCommentHandler}>Delete</Button>

                            <List.Description>
                                {comment.content}
                            </List.Description>
                        </List.Content>

                    </List.Item>
                )
            })

            const commentDisabled = commenting == null || commenting.length == 0 || efficiency == null || responsiveness == null || communication == null;

            /**
             * make descriptions to correspond the \n
             * @param {*} description input description
             */
            const formatDescription = ((description) => {
                if(description){
                    var array = description.split("\n");
                    return array.map((each, index) => {
                        return (
                            <p>{each}</p>
                        )
                    })
                } else{
                    return (<p>This user has nothing to say</p>)
                }
                
            })
            const isSelf = username == netId;

            const notLoggedInOrSelf = (() => {
                if (!loggedIn) {
                    return (
                        <div>
                            <Header as='h2' icon inverted>
                                Please log in to comment!
                            </Header>
                            <br></br>
                            <Button onClick={this.login}>Login</Button>

                        </div>

                    )
                } else if (isSelf) {
                    return (

                        <Header as='h2' icon inverted>
                            You can't comment on your own page!
                            </Header>

                    )
                }

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
                                                <p>{netId}</p>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper className={classes.paper}>
                                                <Typography variant='h4' color='primary'>Major</Typography>
                                                {/* <List selection> */}

                                                <List.Item select>
                                                    <Label color='red' horizontal>
                                                        {major.substring(major.indexOf('-') + 1)}
                                                    </Label>
                                                    <Typography color="primary">
                                                        {major}

                                                    </Typography>
                                                </List.Item>
                                                {/* </List> */}
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Paper className={classes.paper}>
                                                <Typography variant='h4' color='primary'>Skills</Typography>
                                                {getSkillList()}
                                            </Paper>
                                        </Grid>


                                        <Grid item xs={12}>
                                            <Paper className={classes.paper}>
                                                <Typography variant='h4' color='primary'>Groups / Matching queue</Typography>
                                                {/* <ul horizontal selection className={classes.list}> */}
                                                {getGroupsList()}
                                                <br></br>
                                                {getQueuesList()}
                                                {/* </ul> */}
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item xs={4}>
                                    <Grid container spacing={2} direction="column">
                                        <Grid item xs={12}>
                                            <Paper className={classes.paper_image}>

                                                <img className={classes.image} src={image} onDragStart={this.preventDragHandler} />
                                                <Button
                                                    content="Change Profile Picture"
                                                    icon="file"
                                                    onClick={() => this.fileInputRef.current.click()}
                                                />
                                                <input
                                                    ref={this.fileInputRef}
                                                    type="file"
                                                    hidden
                                                    onChange={this.fileChange}
                                                />
                                            </Paper>
                                        </Grid>



                                        {/* <Grid item xs={12}>
                                            <Paper className={classes.paper_image}>

                                            </Paper>
                                        </Grid> */}

                                        <Grid item xs={12}>
                                            <Paper className={classes.paper}>
                                                <Typography variant='h4' color='primary'>About me</Typography>
                                                <Typography variant='p' color='primary'>{formatDescription(description)}</Typography>
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
                                        <Dimmer.Dimmable active={!loggedIn || isSelf}>
                                            <Form onSubmit={this.submitHandler}>
                                                <Form.Field>
                                                    <TextArea
                                                        placeholder='Please comment on your teammate!'
                                                        name='commenting'
                                                        onChange={this.changeHandler}
                                                        type="text"
                                                        value={commenting} />
                                                </Form.Field>
                                                <Form.Field>
                                                    <Typography variant='p' color='primary'>Efficiency: </Typography>

                                                    <Rating icon="star" defaultRating={0} maxRating={5} onRate={this.efficiencyHandler} />
                                                    <Typography variant='p' color='primary'>Communication: </Typography>

                                                    <Rating icon="star" defaultRating={0} maxRating={5} onRate={this.communicationHandler} />
                                                    <Typography variant='p' color='primary'>Responsiveness: </Typography>

                                                    <Rating icon="star" defaultRating={0} maxRating={5} onRate={this.responsivenessHandler} />
                                                </Form.Field>

                                                <Button
                                                    type='submit'
                                                    disabled={commentDisabled}
                                                >Comment</Button>
                                            </Form>

                                            <Dimmer active={!loggedIn || isSelf}>
                                                {notLoggedInOrSelf()}
                                            </Dimmer>

                                        </Dimmer.Dimmable>

                                        <br></br>
                                        <Typography variant='h5' color='primary'>Previous comments</Typography>
                                        {showComments()}

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

export default withRouter(withStyles(styles)(connectedUserPage));

