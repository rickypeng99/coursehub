import React, { Component } from 'react';
import { Form, Button, Input, Checkbox, Label, Dropdown, TextArea } from 'semantic-ui-react';
import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import file from '../../Common/data/majors'
//import courseFile from '../../Common/data/courses'
import Background from '../../Common/images/illinois.webp'
import { language_list, topic_list } from '../../Common/data/availableSkills';
import { Typography } from '@material-ui/core';

require('./User.css');

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



class Register extends Component {


    // User(Skills, NetId, InternalPoints, major, username, password, firstName, lastName)

    // CREATE TABLE IF NOT EXISTS CourseHub.Users (
    //     net_id VARCHAR(8) NOT NULL,
    //     internal_point INT NOT NULL,
    //     major VARCHAR(31) NOT NULL,
    //     user_name VARCHAR(31) NOT NULL,
    //     password VARCHAR(31) NOT NULL,
    //     first_name VARCHAR(31) NOT NULL,
    //     middle_name VARCHAR(31),
    //     last_name VARCHAR(31) NOT NULL,
    //     description TEXT,
    //     PRIMARY KEY (net_id)
    // )  ENGINE=INNODB;

    constructor(props) {
        super(props)
        this.state = {
            //currentUser: null,
            username: undefined,
            password: undefined,
            firstName: undefined,
            middleName: undefined,
            lastName: undefined,
            description: undefined,
            netId: undefined,
            major: undefined,
            //classTaking: [],
            gpa: null,
            registered: false,
            //thsese two states are options
            majors: [],
            courses: [],
            skills: []
        }

        this.availableSkills = []
    }

    submitHandler = () => {
        // this.props.dispatch(userActions.login(this.state.username, this.state.password));
        // this.props.history.push("/main");

        //
        // console.log(this.state.firstName)
        // console.log(this.state.description)
        axios.post('api/register', {
            net_id: this.state.netId,
            password: this.state.password,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            gpa: this.state.gpa,
            description: this.state.description,
            major: this.state.major,
            skills: this.state.skills
        })
            .then(result => {
                //console.log(result.data.data)
                this.props.history.push('/login')
            })
            .catch(error => {
                alert(error.message)
            })
    }


    changeHandler = ((event) => {
        this.setState({ [event.target.name]: event.target.value });
    })

    dropDownMajorHandler = ((event, data) => {
        this.setState({ major: data.value })
        console.log(data.value)

    })

    dropDownCourseHandler = ((event, data) => {
        this.setState({ classTaking: data.value })
    })

    skillsChangeHandler = ((e, data) => {

        this.setState({ skills: data.value })
        console.log(data.value)
    })

    /**
     * For printing updated states
     */
    componentDidUpdate() {
        //console.log(this.state.majorStudying)
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
        var skillsTemp = language_list.concat(topic_list).sort()

        for (var i = 0; i < skillsTemp.length; i++) {
            this.availableSkills.push({
                key: skillsTemp[i],
                value: skillsTemp[i],
                text: skillsTemp[i]
            })
        }        
        this.setState({
            majors: majors,
            //courses: courses,
            currentUser: this.props.user,
            loggedIn: this.props.loggedIn

        })
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <Redirect to='/'></Redirect>
            )
        } else {
            return (
                <div>
                    <RegisterForm classes={this.props.classes}
                        username={this.state.username}
                        password={this.state.password}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        middleName={this.state.middleName}
                        major={this.state.major}
                        netId={this.state.netId}
                        //classTaking={this.state.classTaking}
                        changeHandler={this.changeHandler}
                        submitHandler={this.submitHandler}
                        description={this.description}
                        gpa={this.state.gpa}
                        majors={this.state.majors}
                        dropDownMajorHandler={this.dropDownMajorHandler}
                        dropDownCourseHandler={this.dropDownCourseHandler}
                        courses={this.state.courses}
                        availableSkills={this.availableSkills}
                        skillsChangeHandler={this.skillsChangeHandler}
                        skills = {this.state.skills}
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
    var middleName = props.middleName
    var lastName = props.lastName
    var description = props.description
    var major = props.major
    var netId = props.netId
    var gpa = props.gpa
    var changeHandler = props.changeHandler
    var submitHandler = props.submitHandler
    var majors = props.majors
    var dropDownMajorHandler = props.dropDownMajorHandler
    var availableSkills = props.availableSkills
    var skillsChangeHandler = props.skillsChangeHandler
    var skills = props.skills
    //var dropDownCourseHandler = props.dropDownCourseHandler
    //var courses = props.courses

    // var error = (name) => {
    //     if (name == null || name == "") {
    //         return (
    //             <Label pointing>That name is taken!</Label>

    //         )
    //     } else {
    //         return (
    //             <Label pointing>That name is taken!</Label>

    //         )
    //     }
    // }

    const error = firstName == null || firstName == undefined || lastName == null || lastName == undefined || netId == null || netId == undefined || password == null || password == undefined || gpa == null || gpa == undefined || major == null || major == undefined || skills.length < 1;

    return (
        <div className={classes.root}>
            <Paper className={classes.outGrid}>
                <Typography variant='h4' color='primary'>Register</Typography>

                <Form onSubmit={submitHandler}>

                    <Grid container spacing={3} >
                        {/* <Grid item xs={12}>
                        <Paper className={classes.paper}>xs=12</Paper>
                    </Grid> */}

                        {/* <Grid item xs={12} sm={6} className={classes.grid} >
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
                        

                        </Grid> */}
                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <Form.Field className={classes.input} error={netId == null || netId == undefined}>
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
                            <Form.Field className={classes.input} error={password == null || password == undefined}>
                                <p>Password</p>
                                <Input
                                    name="password"
                                    value={password}
                                    onChange={changeHandler}
                                    type="password"
                                />
                            </Form.Field>
                        </Grid>


                        {/* <Grid item xs={12} sm={6} className={classes.grid}>
                        </Grid> */}

                        <Grid item xs={12} sm={4} className={classes.grid} >
                            <Form.Field className={classes.input} error={firstName == null || firstName == undefined}>
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
                        <Grid item xs={12} sm={4} className={classes.grid} >
                            <Form.Field className={classes.input}>
                                <p>Middle name</p>
                                <Input
                                    name="middleName"
                                    value={middleName}
                                    onChange={changeHandler}
                                    type="text"
                                    placeholder="D"
                                />

                            </Form.Field>
                        </Grid>
                        <Grid item xs={12} sm={4} className={classes.grid} >
                            <Form.Field className={classes.input} error={lastName == null || lastName == undefined}>
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


                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <Form.Field className={classes.input} error={major == null || major == undefined}>
                                <p>Major</p>
                                <Dropdown
                                    placeholder="Select Major"
                                    search
                                    selection
                                    onChange={dropDownMajorHandler}
                                    options={majors}
                                //value={major}
                                />
                            </Form.Field>
                        </Grid>

                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <Form.Field className={classes.input} error={gpa == null || gpa == undefined}>
                                <p>GPA(Grade point Average)</p>
                                <Input
                                    name="gpa"
                                    value={gpa}
                                    onChange={changeHandler}
                                    type="number"
                                    step='0.01'
                                    placeholder='This is only for calculation of the internal point'
                                />
                            </Form.Field>
                        </Grid>

                        <Grid item xs={12} sm={12} className={classes.grid}>
                            <Form.Field className={classes.input} error = {skills.length < 1}>
                                <p>Skills</p>

                                <Dropdown
                                    placeholder='skills'
                                    multiple
                                    search
                                    selection
                                    options={availableSkills}
                                    onChange={skillsChangeHandler}
                                />
                            </Form.Field>
                        </Grid>

                        <Grid item xs={12} sm={12} className={classes.grid}>
                            <Form.Field className={classes.input} >
                                <p>About me</p>
                                <TextArea
                                    placeholder='Tell us more'
                                    name='description'
                                    onChange={changeHandler}
                                    type="text"
                                    value={description} />
                            </Form.Field>
                        </Grid>


                    </Grid>
                    <div className="buttonContainer">
                        <Button type='submit' disabled={error} >Submit</Button>

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

            <div>
                {/* <img src={require('../../Common/images/logo.png')} /> */}

                <Register {...props}></Register>
            </div>
        </div>

    )
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);




export default withStyles(styles)(connectedRegisterPage);