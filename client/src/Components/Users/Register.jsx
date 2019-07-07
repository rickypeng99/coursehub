import React, { Component } from 'react';
import { Form, Button, Input, Checkbox, Label, Dropdown } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

import file from '../../Common/data/majors'
import courseFile from '../../Common/data/courses'

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

require('./Login.css');


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
        margin: "20%",
        padding: theme.spacing(2),
        //textAlign: 'center',
        color: theme.palette.text.secondary,
    }
});



class Register extends Component {


    // User(Skills, NetId, InternalPoints, major, username, password, firstName, lastName)


    constructor(props) {
        super(props)
        this.state = {
            //currentUser: null,
            username: null,
            password: null,
            firstName: null,
            lastName: null,
            major: null,
            netId: null,
            classTaking: [],
            gpa: null,
            registered: false,
            majors: [],
            courses: []
        }
        //this.submitHandler = this.submitHandler.bind(this)

    }

    submitHandler = () => {
        this.props.dispatch(userActions.login(this.state.username, this.state.password));
        this.props.history.push("/main");
    }


    changeHandler = ((event) => {
        this.setState({ [event.target.name]: event.target.value });
    })

    dropDownMajorHandler = ((event, data) => {
        this.setState({major: data.value})
    })

    dropDownCourseHandler = ((event, data) => {
        this.setState({classTaking: data.value})
    })

    componentDidUpdate (){
        console.log(this.state.courses)
    }

    componentDidMount() {
        var read = file['data']
        var majors = []
        for (var i = 0; i < read.length; i++) {
            majors.push({
                key: read[i]['major'],
                value: read[i]['major'],
                text: read[i]['major']
            })
        }
        var read = courseFile['data']
        var courses = []
        for (var i = 0; i < read.length; i++) {
            courses.push({
                key: read[i]['name'],
                value: read[i]['crn'],
                text: read[i]['name']
            })
        }


        //console.log(courses)

        this.setState({
            majors: majors,
            courses: courses,
            currentUser: this.props.user,
            loggedIn: this.props.loggedIn
        })
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <Redirect to='/main'></Redirect>
            )
        } else {
            return (
                <div>
                    <RegisterForm classes={this.props.classes}
                        username={this.state.username}
                        password={this.state.password}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        major={this.state.major}
                        netId={this.state.netId}
                        classTaking={this.state.classTaking}
                        changeHandler={this.changeHandler}
                        submitHandler={this.submitHandler}
                        gpa={this.state.gpa}
                        majors={this.state.majors}
                        dropDownMajorHandler={this.dropDownMajorHandler}
                        dropDownCourseHandler={this.dropDownCourseHandler}
                        courses={this.state.courses}
                    />
                </div>


            )
        }


    }
}

function RegisterForm(props) {
    const classes = props.classes;
    var username = props.username
    var password = props.password
    var firstName = props.firstName
    var lastName = props.lastName
    var major = props.major
    var netId = props.netId
    var classTaking = props.classTaking
    var gpa = props.gpa
    var changeHandler = props.changeHandler
    var submitHandler = props.submitHandler
    var majors = props.majors
    var dropDownMajorHandler = props.dropDownMajorHandler
    var dropDownCourseHandler = props.dropDownCourseHandler
    var courses = props.courses

    var error = (name) => {
        if(name == null || name == ""){
            return(
                <Label pointing>That name is taken!</Label>

            )
        } else{
            return(
                <Label pointing>That name is taken!</Label>

            )
        }
    }
   

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} className={classes.outGrid}>

                <Form onSubmit={submitHandler}>

                    <Grid container spacing={3} >
                        {/* <Grid item xs={12}>
                        <Paper className={classes.paper}>xs=12</Paper>
                    </Grid> */}
                    <Grid item xs={12} sm={6} className={classes.grid} >
                            <Form.Field className={classes.input}>
                                <p>First name</p>
                                <Input
                                    name="firstName"
                                    value={firstName}
                                    onChange={changeHandler}
                                    type="text"
                                    placeholder="James"
                                />

                            </Form.Field>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.grid} >
                            <Form.Field className={classes.input}>
                                <p>Last name</p>
                                <Input
                                    name="lastName"
                                    value={lastName}
                                    onChange={changeHandler}
                                    type="text"
                                    placeholder="Smith"
                                />

                            </Form.Field>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} className={classes.grid} >
                            <Form.Field className={classes.input}>
                                <p>Username</p>
                                <Input
                                    name="username"
                                    value={username}
                                    onChange={changeHandler}
                                    type="text"
                                    placeholder="admin"
                                />

                            </Form.Field>
                            {/* {
                                error(username)
                            } */}

                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <Form.Field className={classes.input}>
                                <p>Illinois Netid</p>
                                <Input
                                    name="netId"
                                    value={netId}
                                    onChange={changeHandler}
                                    type="text"
                                />
                            </Form.Field>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <Form.Field className={classes.input}>
                                <p>Password</p>
                                <Input
                                    name="password"
                                    value={password}
                                    onChange={changeHandler}
                                    type="password"
                                />
                            </Form.Field>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <Form.Field className={classes.input}>
                                <p>Major</p>
                                <Dropdown
                                    placeholder="Select Major"
                                    search
                                    selection
                                    onChange={dropDownMajorHandler}
                                    options={majors}
                                    multiple
                                />
                            </Form.Field>
                        </Grid>

                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <Form.Field className={classes.input}>
                                <p>GPA(Grade point Average)</p>
                                <Input
                                    name="gpa"
                                    value={gpa}
                                    onChange={changeHandler}
                                    type="number"
                                    step = '0.01'
                                    placeholder = 'This is only for calculation of the internal point'
                                />
                            </Form.Field>
                        </Grid>

                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <Form.Field className={classes.input}>
                                <p>Classes taking</p>
                                <Dropdown
                                    placeholder="Select Courses"
                                    search
                                    selection
                                    onChange={dropDownCourseHandler}
                                    options={courses}
                                    multiple
                                />
                            </Form.Field>
                        </Grid>

                        {/* <Grid item xs={6} sm={3}>
                            <Form.Field>
                                <Checkbox label='I agree to the Terms and Conditions' />
                            </Form.Field>
                        </Grid>
                        <Grid item xs={6} sm={3}>

                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper className={classes.paper}>xs=6 sm=3</Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper className={classes.paper}>xs=6 sm=3</Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper className={classes.paper}>xs=6 sm=3</Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper className={classes.paper}>xs=6 sm=3</Paper>
                        </Grid> */}
                    </Grid>
                    <div className="buttonContainer">
                        <Button type='submit'>Submit</Button>

                    </div>




                </Form >
            </Paper>
        </div>
    )
}



function mapStateToProps(state) {
    const { user, loggedIn } = state.auth;
    return {
        user, loggedIn
    };
};


const RegisterPage = (props) => {
    return (
        <div>

            <div className="signInContainer">
                {/* <img src={require('../../Common/images/logo.png')} /> */}

                <Register {...props}></Register>
            </div>
        </div>

    )
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);




export default withStyles(styles)(connectedRegisterPage);