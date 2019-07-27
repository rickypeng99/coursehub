import React, { Component } from 'react'
import { TextArea, Form, Button, Input, Checkbox, Dropdown, Label, List, Card, Image, Rating, Modal, Header } from 'semantic-ui-react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import { language_list, topic_list } from '../../Common/data/availableSkills';

class GroupModal extends Component {

    constructor(props) {
        super(props)
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
        }
        this.availableSkills = []
    }


    componentDidMount() {

        var skillsTemp = language_list.concat(topic_list).sort()

        for (var i = 0; i < skillsTemp.length; i++) {
            this.availableSkills.push({
                key: skillsTemp[i],
                value: skillsTemp[i],
                text: skillsTemp[i]
            })
        }


    }


    /**
     * group creating related funcitons
     */
    createGroup = (() => {
        //closing the modal
        this.setState({ modalOpen: false })

        var createdGroup = {
            name: this.state.groupName,
            founder: this.props.username,
            students_limit: this.state.students_limit,
            course_CRN: this.props.crn,
            skills: this.state.skills,
            description: this.state.description
        }

        //passing to the newly created group to the course page
        this.props.createGroup(createdGroup)

    })

    createGroupChangeHandler = ((event) => {
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
            description
        } = this.state
        var classes = this.props.classes;
        var courseName = this.props.courseName;
        var username = this.props.username;
        var isInGroup = this.props.isInGroup;

        const inputStyle = {
            //flexShrink: 0,
            width: "100%"

        }

        // const mustAvailableSkills = []
        // if (skills.length > 1) {
        //     mustAvailableSkills = skills.map((skill, index) => {
        //         return ({
        //             key: skill,
        //             valus: skill,
        //             text: skill
        //         })
        //     })

        // }


        return (
            <Modal
                trigger={
                    <Button className={classes.button} primary onClick={this.handleOpen} disabled = {isInGroup}>Click to create a new group</Button>
                }
                open={this.state.modalOpen}
            >
                <Modal.Header>{"Creating a group for " + courseName}</Modal.Header>
                <Modal.Content>
                    <Typography variant={"h5"}>{"You, " + username + ", will be the founder"}</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} className={classes.grid}>
                            <p>Group name</p>
                            <Input
                                name="groupName"
                                style={inputStyle}
                                value={groupName}
                                onChange={this.createGroupChangeHandler}
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
                                onChange={this.createGroupChangeHandler}
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} className={classes.grid}>
                            <p>Group description</p>
                            <TextArea
                                style={inputStyle}
                                placeholder='Describe what your group does'
                                name='description'
                                onChange={this.createGroupChangeHandler}
                                type="text"
                                value={description} />
                        </Grid>



                        {/* <Grid item xs={12} sm={12} className={classes.grid}>
                            <p>Must have skills</p>
                            <Dropdown
                                placeholder='State'
                                multiple
                                search
                                selection
                                options={mustAvailableSkills}
                            />
                        </Grid> */}

                    </Grid>



                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.cancel}>Cancel</Button>
                    <Button positive onClick={this.createGroup}>Confirm</Button>
                </Modal.Actions>
            </Modal>
        )

    }
}

export default GroupModal;