module.exports = function (router, pool) {

    commentRoute = router.route('/comment')

    commentRoute.get((req, res) => {
        pool.query('SELECT * FROM comments', function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "No comments returned!" })
            } else {
                res.status(200).send({ data: results, message: "All comments returned" })
            }
        })


    })

    commentRoute.post((req, res) => {

        var comment = {
            "user_id": req.body.user_id,
            "efficiency": req.body.efficiency,
            "responsiveness": req.body.responsiveness,
            "communication": req.body.communication,
            "content": req.body.content,
            "course_CRN": req.body.course_CRN,
        }

        var receiver = req.body.receiver

        pool.query('INSERT into comments SET ?', comment, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: [], message: error })
            }
            else {
                var commentRelation = {
                    "net_id": receiver,
                    "comment_id": results.insertId
                }
                pool.query('INSERT into users_comments SET ?', commentRelation, function (error, results, fields) {
                    if (error) {

                    } else {
                        comment["comment_id"] = commentRelation.comment_id
                        res.status(200).send({ data: comment, message: "Added comments to user with netId " + receiver })
                    }
                })

            }
        })
    })

    commentIdRoute = router.route('/comment/:id')
    commentIdRoute.delete((req, res) => {
        var comment_id = req.params.id;
        pool.query('DELETE FROM users_comments WHERE comment_id = ?', comment_id, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: error, message: "deleting comments outside" + error });

            } else {
                pool.query('DELETE FROM comments WHERE comment_id = ?', comment_id, function (error, results, fields) {
                    if (error) {
                        res.status(500).send({ data: error, message: "deleting comments inside" + error });
                    } else {
                        res.status(200).send({ data: results, message: "successfully deleted comments with id " + comment_id })
                    }
                })
            }
        })
    })


    //put - update specific user's internal points
    commentIdRoute.put((req, res) => {


        //GET the user that we are trying to update
        var net_id = req.params.id;
        var comment_id = req.body.comment_id
        pool.query('SELECT * FROM (SELECT * FROM users_comments NATURAL JOIN comments NATURAL JOIN users WHERE net_id = ? and comment_id = ?) temp1 JOIN (SELECT u.net_id,u.internal_point AS binternal FROM users u WHERE u.net_id IN (SELECT DISTINCT c.user_id FROM comments c WHERE user_id <> ? )) temp2', [net_id, comment_id, net_id], function (error, results, fields) {
            //couldn't find the user, thus couldn't update
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find comment with netId " + net_id })
            }
            else {
                //a is sender, b is receiver
                var ainternal = results[0].binternal;
                var binternal = results[0].internal_point;
                var base = ((results[0].efficiency + results[0].responsiveness + results[0].communication) / 3 - 3) * 25 * (1 - (binternal - ainternal) / 1000);
                if (base > 0) {
                    var newinternal = (1000 - binternal) * 0.002 * base + binternal;
                    //newinternal = newinternal + ainternal;
                    pool.query('UPDATE users SET internal_point = ? WHERE net_id = ?', [newinternal, net_id], function (error, results, fields) {
                        if (error || results.length < 1) {
                            res.status(404).send({ data: [], message: "404: Couldn't find user's internal points with netId " + net_id })
                        }
                        else {
                            res.status(200).send({ data: results, message: "successfully updated user's internal points with id " + net_id })
                        }
                    })
                } else {
                    var newinternal = (binternal - 200) * 0.004 * base + binternal;
                    //newinternal = newinternal + ainternal;
                    pool.query('UPDATE users SET internal_point = ? WHERE net_id = ?', [newinternal, net_id], function (error, results, fields) {
                        if (error || results.length < 1) {
                            res.status(404).send({ data: [], message: "404: Couldn't find user's internal points with netId " + net_id })
                        }
                        else {
                            res.status(200).send({ data: results, message: "successfully updated user's internal points with id " + net_id })
                        }
                    })
                }

            }
        })
    })
    return router;
}