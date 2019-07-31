import React, { Component } from 'react'
import { TextArea, Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating, Modal, Header } from 'semantic-ui-react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import { language_list, topic_list } from '../../Common/data/availableSkills';

class GroupSettingModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            groupName: "",
            founder: this.props.username,
            course_CRN: this.props.crn,
            students_limit: null,
            students_current: null,
            status: 1,
            description: null,
            skills: [],
            modalOpen: false,
            loaded: false
        }
        this.availableSkills = []
    }


    componentDidMount() {
        //get current group_id
        var group_id = this.props.group_id

        var skillsTemp = language_list.concat(topic_list).sort()

        for (var i = 0; i < skillsTemp.length; i++) {
            this.availableSkills.push({
                key: skillsTemp[i],
                value: skillsTemp[i],
                text: skillsTemp[i]
            })
        }

        axios.get('api/group/' + group_id + '/skill')
            .then((response) => {
                var group = response.data.data;
                this.setState({
                    group_id: group_id,
                    groupName: group.name,
                    founder: group.founder,
                    course_CRN: group.course_CRN,
                    students_limit: group.students_limit,
                    students_current: group.students_current,
                    status: 1,
                    description: group.description,
                    skills: group.skills,
                    loaded: true
                })
            })
            .catch(error => {
                console.log(error)
            })


    }


    /**
     * group updating related funcitons
     */
    updateGroup = (() => {
        //closing the modal
        this.setState({ modalOpen: false })

        var updatedGroup = {
            group_id: this.state.group_id,
            name: this.state.groupName,
            founder: this.props.username,
            students_limit: this.state.students_limit,
            course_CRN: this.props.crn,
            skills: this.state.skills,
            description: this.state.description
        }

        //passing to the newly updated group to the course page
        this.props.updateGroup(updatedGroup)

    })

    updateGroupChangeHandler = ((event) => {
        this.setState({ [event.target.name]: event.target.value });
        //console.log(this.state.groupName)


    })

    skillsChangeHandler = ((e, data) => {

        this.setState({ skills: data.value })
        //console.log(data.value)

    })

    handleOpen = (() => {
        this.setState({ modalOpen: true })
    })

    cancel = (() => {
        this.setState({ modalOpen: false })

    })




    render() {
        /**
     * Creating group modals 
     */


        /**
             * group_id
             * founder
             * name 
             * course_CRN
             * students_limit
             * students_current
             * status (1/0)
             * description
             * 
             * group_id
             * skill
             * must (1/0)
             */

        var {
            groupName,
            students_limit,
            skills,
            description,
            loaded, 

        } = this.state
        var classes = this.props.classes;
        var courseName = this.props.courseName;
        var username = this.props.username;

        const inputStyle = {
            //flexShrink: 0,
            width: "100%"

        }

        if(loaded){
            return (
                <Modal
                    trigger={
                        <Button className={classes.button} color = 'orange' onClick={this.handleOpen}>Update my group</Button>
                    }
                    open={this.state.modalOpen}
                >
                    <Modal.Header>{"Updating group " + groupName}</Modal.Header>
                    <Modal.Content>
                        <Typography variant={"h5"}>Group settings</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} className={classes.grid}>
                                <p>Group name</p>
                                <Input
                                    name="groupName"
                                    style={inputStyle}
                                    value={groupName}
                                    onChange={this.updateGroupChangeHandler}
                                    type="text"
                                    placeholder="Your group name"
                                />
                            </Grid>
    
                            <Grid item xs={12} sm={6} className={classes.grid}>
                                <p>Group size</p>
                                <Input
                                    name="students_limit"
                                    style={inputStyle}
                                    value={students_limit}
                                    onChange={this.updateGroupChangeHandler}
                                    type="number"
                                    step='1'
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} className={classes.grid}>
                                <p>Needed skills</p>
                                <Dropdown
                                    style={inputStyle}
                                    placeholder='skills'
                                    multiple
                                    search
                                    selection
                                    options={this.availableSkills}
                                    onChange={this.skillsChangeHandler}
                                    defaultValue={skills}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} className={classes.grid}>
                                <p>Group description</p>
                                <TextArea
                                    style={inputStyle}
                                    placeholder='Describe what your group does'
                                    name='description'
                                    onChange={this.updateGroupChangeHandler}
                                    type="text"
                                    value={description} />
                            </Grid>
    
                        </Grid>
    
    
    
                    </Modal.Content>
                    <Modal.Actions>
                        <Button negative onClick={this.cancel}>Cancel</Button>
                        <Button positive onClick={this.updateGroup}>Confirm</Button>
                    </Modal.Actions>
                </Modal>
            )
        } else{
            return(
                <p>Loading your group's information...</p>
            )
        }
        

    }
}

export default GroupSettingModal;