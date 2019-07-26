import React, { Component } from 'react';
import { Form, Button, Input, Checkbox, Label, Dropdown, TextArea } from 'semantic-ui-react';
//import { userActions } from '../../Store/actions/userActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import file from '../../Common/data/majors'
import { Typography } from '@material-ui/core';
import { language_list, topic_list } from '../../Common/data/availableSkills';

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



class UserSetting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            //currentUser: null,
            /**
             * check if logged in
             */
            username: undefined,
            loggedIn: undefined,
            /**
             * changable attributes
             */
            //password: undefined,
            netId: this.props.match.params.id,
            firstName: undefined,
            middleName: undefined,
            lastName: undefined,
            description: undefined,
            //netId: undefined,
            major: undefined,
            //classTaking: [],
            //gpa: null,
            //thsese two states are options
            majors: [],
            //courses: []
            skills: [],

            /**
             * loaded form GET
             */
            loaded: false,
        }
        this.availableSkills = []

    }

    submitHandler = () => {
        var netId = this.state.netId
        axios.put('api/user/' + netId, {
            net_id: this.state.netId,
            password: this.state.password,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            description: this.state.description,
            major: this.state.major,
            skills: this.state.skills

        })
            .then(result => {
                console.log(result.data.data)
                this.props.history.push('/user/' + netId)
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
    })

    skillsChangeHandler = ((e, data) => {

        this.setState({ skills: data.value })
        //console.log(data.value)
    })

    /**
     * For printing updated states
     */
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
        //added skills
        var skillsTemp = language_list.concat(topic_list).sort()

        for (var i = 0; i < skillsTemp.length; i++) {
            this.availableSkills.push({
                key: skillsTemp[i],
                value: skillsTemp[i],
                text: skillsTemp[i]
            })
        }  

        var netId = this.props.match.params.id

        this.setState({
            username: this.props.user,
            loggedIn: this.props.loggedIn,

        })

        axios.get('api/user/' + netId)
            .then((response) => {

                var user = response.data.data[0];

                axios.get('api/skill/user/' + netId)
                .then(response => {
                    var skills = []
                    for(var i = 0; i < response.data.data.length; i++){
                        skills.push(response.data.data[i].skill);
                    }
                    this.setState({
                        netId: this.props.match.params.id,
                        firstName: user.first_name,
                        middleName: user.middle_name,
                        lastName: user.last_name,
                        description: user.description,
                        major: user.major,
                        majors: majors,
                        //courses: courses,
                        skills: skills,
                        loaded: true
                    })
                })
                .catch(error => {

                })

                
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        var loaded = this.state.loaded
        if (loaded) {
            //console.log("des: " + this.state.description)
            return (
                <div>
                    <SettingForm classes={this.props.classes}
                        username={this.state.username}
                        loggedIn={this.state.loggedIn}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        middleName={this.state.middleName}
                        major={this.state.major}
                        changeHandler={this.changeHandler}
                        submitHandler={this.submitHandler}
                        description={this.state.description}
                        majors={this.state.majors}
                        dropDownMajorHandler={this.dropDownMajorHandler}
                        availableSkills={this.availableSkills}
                        skillsChangeHandler={this.skillsChangeHandler}
                        skills = {this.state.skills}
                    />
                </div>


            )
        } else {
            return (
                <p>Loading</p>
            )
        }

    }



}

function SettingForm(props) {
    const classes = props.classes;
    var username = props.username
    var firstName = props.firstName
    var middleName = props.middleName
    var lastName = props.lastName
    var description = props.description
    var major = props.major
    var changeHandler = props.changeHandler
    var submitHandler = props.submitHandler
    var majors = props.majors
    var dropDownMajorHandler = props.dropDownMajorHandler
    var availableSkills = props.availableSkills
    var skillsChangeHandler = props.skillsChangeHandler
    var skills = props.skills
    return (
        <div className={classes.root}>
            <Grid container spacing={1} direction="column">

                {/* <Grid item xs={12}>
                    <Paper className={classes.outGrid}>
                    </Paper>
                </Grid> */}

                <Grid item xs={12}>
                    <Paper className={classes.outGrid}>
                        <Typography variant='h4' color='primary'>Settings</Typography>

                        <Form onSubmit={submitHandler}>



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


                            <Form.Field className={classes.input}>
                                <p>Major</p>
                                <Dropdown
                                    placeholder="Select Major"
                                    defaultValue={major}
                                    search
                                    selection
                                    onChange={dropDownMajorHandler}
                                    options={majors}
                                //value={major}
                                />
                            </Form.Field>

                            <Grid item xs={12} sm={12} className={classes.grid}>
                                <Form.Field className={classes.input} error={skills.length < 1}>
                                    <p>Skills</p>

                                    <Dropdown
                                        placeholder='skills'
                                        multiple
                                        search
                                        selection
                                        options={availableSkills}
                                        onChange={skillsChangeHandler}
                                        defaultValue={skills}
                                    />
                                </Form.Field>
                            </Grid>
                            <Form.Field className={classes.input}>
                                <p>About me</p>
                                <TextArea
                                    placeholder='Tell us more'
                                    name='description'
                                    onChange={changeHandler}
                                    type="text"
                                    value={description} />
                            </Form.Field>


                            <div className="buttonContainer">
                                <Button type='submit'>Submit</Button>

                            </div>




                        </Form >
                    </Paper>
                </Grid>
            </Grid>


        </div>
    )
}



function mapStateToProps(state) {
    const { user, loggedIn } = state.auth;
    return {
        user, loggedIn
    };
};


const SettingPage = (props) => {
    return (
        <div>

            <div>
                {/* <img src={require('../../Common/images/logo.png')} /> */}

                <UserSetting {...props}></UserSetting>
            </div>
        </div>

    )
}

const connectedSettingPage = connect(mapStateToProps)(SettingPage);




export default withStyles(styles)(connectedSettingPage);