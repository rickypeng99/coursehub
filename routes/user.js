/**
 * Handles everything about user
 */

var replaced = ((original, change) => {
    if (change == undefined) {
        return original;
    } else {
        return change;
    }
})


module.exports = function (router, pool) {

    var bcrypt = require('bcryptjs');


    /**
     * Operations about a specific user
     */
    var userIdRoute = router.route('/user/:id');

    userIdRoute.get((req, res) => {
        var net_id = req.params.id;
        pool.query('SELECT * FROM users WHERE net_id = ?', net_id, function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find user with netId " + net_id })
            }
            else {
                res.status(200).send({ data: results, message: "User with id " + net_id + " returned" })
            }
        })
    })


    //get a user with specific id alongside with its skills

    var userIdWithSkillRoute = router.route('/user/:id/skill');

    userIdWithSkillRoute.get((req, res) => {
        var net_id = req.params.id;
        pool.query('SELECT * FROM users WHERE net_id = ?', net_id, function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find user with netId " + net_id })
            }
            else {
                var user = results[0];
                pool.query('SELECT * FROM users_skills WHERE net_id = ?', net_id, function (error, results, fields) {
                    if (error) {
                        res.status(404).send({ data: [], message: "404: Couldn't find any skill listed for this user " + id })
                    } else {
                        var skills = []
                        for (var i = 0; i < results.length; i++) {
                            skills.push(results[i].skill)
                        }
                        user.skills = skills
                        res.status(200).send({ data: user, message: "User with id " + net_id + " and skills returned" })
                    }
                })

            }
        })
    })


    //put - update specific user's detail
    userIdRoute.put((req, res) => {


        //GET the user that we are trying to update
        var net_id = req.params.id;
        pool.query('SELECT * FROM users WHERE net_id = ?', net_id, function (error, results, fields) {
            //couldn't find the user, thus couldn't update
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find user with netId " + net_id })
            }
            else {
                // "net_id": req.body.net_id,
                // "major": req.body.major,
                // "first_name": req.body.first_name,
                // "last_name": req.body.last_name,
                // "description": req.body.description,
                // "internal_point": 500 + 200 * req.body.gpa,
                // "password": hash
                var first_name = replaced(results[0].first_name, req.body.first_name);
                var last_name = replaced(results[0].last_name, req.body.last_name);
                var middle_name = replaced(results[0].middle_name, req.body.middle_name);
                var description = replaced(results[0].description, req.body.description);
                var major = replaced(results[0].major, req.body.major);

                //update password
                var password = results[0].password;
                var salt = null
                var hash = null
                if (req.body.password != undefined) {
                    password = req.body.password;
                    salt = bcrypt.genSaltSync(10);
                    hash = bcrypt.hashSync(password, salt);
                    password = hash
                }
                //update others


                pool.query('UPDATE users SET password = ?, major = ?, first_name = ?, middle_name = ?, last_name = ?, description =? WHERE net_id = ?', [password, major, first_name, middle_name, last_name, description, net_id], function (error, results, fields) {
                    if (error || results.length < 1) {
                        res.status(404).send({ data: [], message: "404: Couldn't find user with netId " + net_id })
                    }
                    else {

                        /**
                         * dealing with skills
                        */

                        //delete all skills that this user currently has
                        if (req.body.skills) {
                            pool.query('DELETE FROM users_skills WHERE net_id = ?', net_id, function (error, results, fields) {
                                if (error) {
                                    res.status(500).send({ data: error, message: error })
                                } else {
                                    var skills = replaced([], req.body.skills);
                                    if (skills.length > 0) {
                                        var tuples = skills.map((skill, index) => {
                                            return ([net_id, skill])
                                        })
                                        pool.query('INSERT INTO users_skills (net_id, skill) VALUES ?', [tuples], function (error, results, fields) {
                                            if (error) {
                                                res.status(500).send({ data: [], message: error })
                                            } else {
                                                res.status(200).send({ data: net_id, message: "Successfully updated user with id " + net_id })
                                            }
                                        })

                                    }
                                }
                            })
                        } else {
                            res.status(200).send({ data: net_id, message: "Successfully updated user with id " + net_id })
                        }





                    }
                })
            }
        })
    })


    /**
     * get the comments of the user
     */
    var userCommentsRoute = router.route('/user/:id/comment')

    userCommentsRoute.get((req, res) => {
        var net_id = req.params.id;
        pool.query('SELECT * FROM comments WHERE comment_id IN (SELECT comment_id FROM users_comments WHERE net_id = ?)', net_id, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: [], message: "500: Server error in user comments " + error })
            } else if (results.length < 1) {
                res.status(200).send({ data: [], message: "no comment found from user with netId " + net_id })
            }
            else {
                res.status(200).send({ data: results, message: "User's comments with user's id " + net_id + " returned" })
            }
        })
    })

    /**
     * get groups of the user
     */

    // var userGroupsRoute = router.route('user/:id/group')

    // userGroupsRoute.get((req, res) => {
    //     var net_id = req.params.id;
    //     pool.query('SELECT * FROM users ')
    // })


    var userRoute = router.route('/user');
    //get users' detail
    userRoute.get((req, res) => {
        pool.query('SELECT * FROM users', function (error, results, fields) {
            if (error) {
                res.status(404).send({ data: [], message: "Error in getting users" })
            }
            else {
                res.status(200).send({ data: results, message: "Retrieved all users" })
            }
        })
    })


    var registerRoute = router.route('/register')
    //register
    registerRoute.post((req, res) => {
        var password = req.body.password
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        var users = {
            // "netid": req.body.netid,
            "net_id": req.body.net_id,
            "major": req.body.major,
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "description": req.body.description,
            "internal_point": 500 + 50 * req.body.gpa,
            "password": hash
        }
        pool.query('INSERT into users SET ?', users, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: [], message: error })
            }
            else {
                //insert skills
                var skills = req.body.skills;
                var net_id = req.body.net_id;
                var tuples = skills.map((skill, index) => {
                    return ([net_id, skill])
                })
                pool.query('INSERT INTO users_skills (net_id, skill) VALUES ?', [tuples], function (error, results, fields) {
                    if (error) {
                        res.status(500).send({ data: [], message: error })
                    } else {
                        res.status(200).send({ data: req.body.net_id, message: results })
                    }
                })
            }
        })
    })

    var loginRoute = router.route('/login')

    //login
    loginRoute.post((req, res) => {
        var net_id = req.body.net_id;
        var password = req.body.password;
        pool.query('SELECT * FROM users WHERE net_id = ?', net_id, (error, results, fields) => {
            if (error) {
                res.status(404).send({ data: [], message: error })
            }
            else {
                if (results.length > 0) {
                    if (bcrypt.compareSync(password, results[0].password)) {
                        res.status(200).send({ data: net_id, message: "successfully log in" })
                    } else {
                        res.status(500).send({ data: net_id, message: "password not correct" })
                    }
                } else {
                    res.status(404).send({ data: [], message: "net_id not exists" })
                }
            }
        })

    })


    /**
     * get all groups for a specific users
     */
    var userIdGroupRoute = router.route('/user/:id/group')

    userIdGroupRoute.get((req, res) => {
        var net_id = req.params.id;
        pool.query('select * from groups g JOIN courses c ON (g.course_CRN = c.CRN) WHERE g.group_id IN (SELECT group_id from groups_users where net_id = ?)', net_id, function (error, results, fields) {
            if (error) {
                res.status(404).send({ data: error, message: error })
            } else {

                res.status(200).send({ data: results, message: "Successfully returned all groups that this user is affiliated to" })
            }

        })
    })



    /**
     * get all queue for a specific user, returning courses that contains that matches the queue
     */

    var userIdQueueRoute = router.route('/user/:id/queue')

    userIdQueueRoute.get((req, res) => {
        var net_id = req.params.id;
        pool.query('SELECT * FROM courses WHERE crn IN (SELECT course_CRN from users_matching_queue WHERE user_id = ?)', net_id, function (error, results, fields) {
            if (error) {
                res.status(404).send({ data: error, message: error })
            } else {

                res.status(200).send({ data: results, message: "Successfully returned all queues that this user is affiliated to" })
            }

        })
    })




    return router;
}
