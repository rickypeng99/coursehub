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
                        res.status(200).send({ data: results, message: "Successfully updated user with id " + net_id })

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
                res.status(500).send({ data: [], message: "500: Server error in user comments " + error})
            } else if(results.length < 1){
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
            "internal_point": 500 + 200 * req.body.gpa,
            "password": hash
        }
        pool.query('INSERT into users SET ?', users, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: [], message: error })
            }
            else {
                res.status(200).send({ data: req.body.net_id, message: "user registered" })
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






    return router;
}
