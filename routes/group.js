/**
 * Dealing with joining or managing groups
 * 
 */
var replaced = ((original, change) => {
    if (change == undefined) {
        return original;
    } else {
        return change;
    }
})



module.exports = function (router, pool) {


    /**
     * get information of all groups
     */

    groupRoute = router.route('/group');


    groupRoute.get((req, res) => {
        pool.query('SELECT * FROM groups', function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "Error in returning all groups" })
            }
            else {
                res.status(200).send({ data: results, message: "All groups returned" })
            }
        })

    })


    /**
     * create a group
     */

    groupRoute.post((req, res) => {
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
        var group = {
            founder: req.body.founder,
            name: req.body.name,
            course_CRN: req.body.course_CRN,
            students_limit: req.body.students_limit,
            students_current: 1,
            status: 1,
            description: req.body.description
        }
        pool.query('INSERT into groups SET ?', group, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: [], message: error })
            }
            else {
                //insert into group skills
                var skills = req.body.skills;
                var group_id = results.insertId;
                var tuples = skills.map((skill, index) => {
                    return ([group_id, skill, 1])
                })

                pool.query('INSERT INTO groups_skills (group_id, skill, must) VALUES ?', [tuples], function (error, results, fields) {
                    if (error) {
                        res.status(500).send({ data: [], message: error })

                    } else {
                        //insert into groups_users
                        var firstUser = {
                            group_id: group_id,
                            net_id: req.body.founder
                        }
                        pool.query('INSERT INTO groups_users SET ?', firstUser, function (error, results, fields) {
                            if (error) {
                                res.status(500).send({ data: [], message: error })
                            } else {
                                group.skills = req.body.skills
                                res.status(200).send({ data: group, message: "Group created" })

                            }
                        })
                    }
                })
            }
        })
    })


    /**
     * delete all groups of a specific user
     */


    /**
    * get information of a specific group
    */
    groupIdRoute = router.route('/group/:id');

    groupIdRoute.get((req, res) => {

        var id = req.params.id;

        pool.query('SELECT * FROM groups WHERE group_id = ?', id, function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find group with id " + id })
            }
            else {
                res.status(200).send({ data: results, message: "group with id " + id + " returned" })

            }
        })

    })


    /**
    * get information of a specific group and its skills
    */
    groupIdSkillRoute = router.route('/group/:id/skill');

    groupIdSkillRoute.get((req, res) => {

        var id = req.params.id;

        pool.query('SELECT * FROM groups WHERE group_id = ?', id, function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find group with id " + id })
            }
            else {

                var group = results[0];
                pool.query('SELECT * FROM groups_skills where group_id = ?', id, function (error, results, fields) {
                    var skills = results.map((result, index) => {
                        return result.skill
                    })
                    group.skills = skills
                    res.status(200).send({ data: group, message: "group with id " + id + " returned with its skills" })
                })


            }
        })

    })

    /**
     * update a group's Information
     */

    groupIdRoute.put((req, res) => {


        //GET the group that we are trying to update
        var group_id = req.params.id;
        pool.query('SELECT * FROM groups WHERE group_id = ?', group_id, function (error, results, fields) {
            //couldn't find the group, thus couldn't update
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find group with groupId " + group_id })
            }
            else {
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
                var name = replaced(results[0].name, req.body.name);
                var students_limit = replaced(results[0].students_limit, req.body.students_limit);
                var description = replaced(results[0].description, req.body.description);


                pool.query('UPDATE groups SET name = ?, students_limit = ?, description =? WHERE group_id = ?', [name, students_limit, description, group_id], function (error, results, fields) {
                    if (error || results.length < 1) {
                        res.status(404).send({ data: [], message: "404: Couldn't find group with groupId " + group_id })
                    }
                    else {

                        /**
                         * dealing with skills
                        */

                        //delete all skills that this group currently has
                        if (req.body.skills) {
                            pool.query('DELETE FROM groups_skills WHERE group_id = ?', group_id, function (error, results, fields) {
                                if (error) {
                                    res.status(500).send({ data: error, message: error })
                                } else {
                                    var skills = replaced([], req.body.skills);
                                    if (skills.length > 0) {
                                        var tuples = skills.map((skill, index) => {
                                            return ([group_id, skill])
                                        })
                                        pool.query('INSERT INTO groups_skills (group_id, skill) VALUES ?', [tuples], function (error, results, fields) {
                                            if (error) {
                                                res.status(500).send({ data: [], message: error })
                                            } else {
                                                res.status(200).send({ data: group_id, message: "Successfully updated group with id " + group_id })
                                            }
                                        })

                                    }
                                }
                            })
                        } else {
                            res.status(200).send({ data: group_id, message: "Successfully updated group with id " + group_id })
                        }





                    }
                })
            }
        })
    })


    /**
     * add user into a group
     */
    groupAddRoute = router.route('/group/:id/add');

    groupAddRoute.post((req, res) => {
        var group_id = req.params.id;
        var net_id = req.body.net_id;
        var tuple = {
            group_id: group_id,
            net_id: net_id
        }

        pool.query('INSERT INTO groups_users SET ?', tuple, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: error, message: error })
            } else {
                //increase students_current by 1
                pool.query('update groups set students_current = (select count(*) from groups_users where group_id = ?) where group_id = ?', [group_id, group_id], function (error, results, fields) {
                    if (error) {
                        res.status(500).send({ data: error, message: error })
                    } else {
                        res.status(200).send({ data: group_id, message: "Successfully added user " + net_id + ' to group ' + group_id })
                    }
                })
            }
        })


    })

    /**
     * remove a user from a group; will delete the group if no one else is left in the group
     */

    groupRemoveRoute = router.route('/group/:id/remove')
    groupRemoveRoute.post((req, res) => {
        var group_id = req.params.id;
        var net_id = req.body.net_id;

        pool.query('delete from groups_users where group_id = ? and net_id = ?', [group_id, net_id], function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: error, message: error })
            } else {

                //check if current user is 0
                pool.query('select count(*) from groups_users where group_id = ?', group_id, function (error, results, fields) {
                    if (error) {
                        res.status(500).send({ data: error, message: error })

                    } else {
                        var students_current = results[0]['count(*)']
                        if (students_current > 0) {
                            //update students_current accordingly
                            pool.query('update groups set students_current = (select count(*) from groups_users where group_id = ?) where group_id = ?', [group_id, group_id], function (error, results, fields) {
                                if (error) {
                                    res.status(500).send({ data: error, message: error })
                                } else {
                                    res.status(200).send({ data: group_id, message: "Successfully removed user " + net_id + ' from group ' + group_id })
                                }
                            })
                        } else {
                            //delete the group
                            pool.query('DELETE FROM groups WHERE group_id = ?', group_id, function (error, results, fields) {
                                if (error) {
                                    res.status(500).send({ data: error, message: error })
                                } else {
                                    pool.query('DELETE FROM groups_skills where group_id = ?', group_id, function (error, results, fields) {
                                        if (error) {
                                            res.status(500).send({ data: error, message: error })
                                        } else {
                                            res.status(200).send({ data: "removed", message: "Successfully removed user, since the group is underflowed, we delete the entire group" })
                                        }
                                    })
                                }
                            }
                            )
                        }
                    }
                })
            }
        })


    })


    /** 
     * get average internal point of this group
     */
    groupIdAverageRoute = router.route('/group/:id/average')
    groupIdAverageRoute.get((req, res) => {
        var group_id = req.params.id

        pool.query('SELECT AVG(U.internal_point) FROM Groups_Users GU, Users U where GU.net_id = U.net_id and GU.group_id = ?', group_id, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: error, message: error })
            } else {
                res.status(200).send({ data: results, message: "returned group " + group_id + "'s average internal_point" })
            }
        })

    })


    groupIdTeammate = router.route('/group/:id/teammate')
    groupIdTeammate.get((req, res) => {
        var group_id = req.params.id
        
        pool.query('SELECT * FROM groups_users WHERE group_id = ?', group_id, function (error, results, fields){
            if (error) {
                res.status(500).send({ data: error, message: error })
            } else {
                res.status(200).send({ data: results, message: "returned group " + group_id + "'s users" })
            }
        })
    })

    return router;


}