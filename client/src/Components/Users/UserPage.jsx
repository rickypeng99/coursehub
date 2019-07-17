import React, { Component } from 'react'
import { Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating, SearchResults } from 'semantic-ui-react';
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
        width: '50%',
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


class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null, // netid of the curren user
            netId: null,
            firstName: null,
            lastName: null,
            major: null,
            classTaking: [],
            gpa: null,
            registered: false,
            comments: [],
            image: require('../../Common/images/user_images/default.jpg'),
            file: null,
            loaded: false,
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

        //Checking if the user has an image

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
                console.log(result.data.data);
                this.setState({
                    netId: this.props.match.params.id,
                    firstName: result.data.data[0].first_name,
                    lastName: result.data.data[0].last_name,
                    major: result.data.data[0].major,
                    description: result.data.data[0].description,
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
                    //gpa: result.data.,
                    registered: false,
                    comments: comments,
                    image: imageAddress,
                    loaded: true
                })
            })
            .catch(error => {
                console.log(error);
            })




        // this.setState({
        //     netId: this.props.match.params.id,

        // })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            window.location.reload();

        }
    }

    fileChange = e => {
        this.setState({ file: e.target.files[0] }, () => {
          console.log("File chosen --->", this.state.file);
        });
    };

    render() {
        var {
            netId, username, firstName, lastName, major, classTaking, comments, description, loaded, image
        } = this.state

        if (loaded) {
            var classes = this.props.classes

            console.log("hahahahaha" + firstName)


            // const getMajorList = major.map((single, index) => {
            //     return (
            //         <List.Item key={single}>
            //             <Label color='red' horizontal>
            //                 {single.substring(single.indexOf('-') + 1)}
            //             </Label>
            //             <Typography color="primary">
            //                 {single}

            //             </Typography>
            //         </List.Item>
            //     )
            // })

            const getCoursesList = classTaking.map((course, index) => {
                //console.log(course)
                return (
                    <List.Item className={classes.course}>
                        <Card className={classes.courseCard}>
                            <Card.Content header={course.name} color='red' />
                            <Card.Content description={course.crn} />
                        </Card>
                    </List.Item>

                )
            })

            const getCommentList = comments.map((comment, index) => {
                return (
                    <List.Item className={classes.comment}>
                        <div className={classes.vertical}>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                            <Typography> Efficiency: </Typography>
                            <Rating icon="star" defaultRating={comment.efficiency} maxRating={5} disabled />
                            <Typography> Communication: </Typography>
                            <Rating icon="star" defaultRating={comment.communication} maxRating={5} disabled />
                            <Typography> Handsomeness: </Typography>
                            <Rating icon="star" defaultRating={comment.handsome} maxRating={5} disabled />
                            <Typography> Responsiveness: </Typography>
                            <Rating icon="star" defaultRating={comment.responsiveness} maxRating={5} disabled />
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
                                                <p>{netId}</p>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Paper className={classes.paper}>
                                                <Typography variant='h4' color='primary'>Major</Typography>
                                                {/* <List selection> */}

                                                    <List.Item>
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
                                                <Typography variant='h4' color='primary'>Groups / Matching queue</Typography>
                                                {/* <ul horizontal selection className={classes.list}> */}
                                                    {getCoursesList}
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
                                        </Grid> */}

                                        <Grid item xs={12}>
                                            <Paper className={classes.paper}>
                                                <Typography variant='h4' color='primary'>About me</Typography>
                                                <Typography variant='p' color='primary'>{description}</Typography>
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

export default withRouter(withStyles(styles)(connectedUserPage));

