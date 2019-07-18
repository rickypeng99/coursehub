module.exports = function (router, connection) {

    commentRoute = router.route('/comment')

    commentRoute.get((req, res) => {
        connection.query('SELECT * FROM comments', function (error, results, fields) {
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

        connection.query('INSERT into comments SET ?', comment, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: [], message: error })
            }
            else {
                var commentRelation = {
                    "net_id": receiver,
                    "comment_id": results.insertId
                }
                connection.query('INSERT into users_comments SET ?', commentRelation, function (error, results, fields) {
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
        connection.query('DELETE FROM users_comments WHERE comment_id = ?', comment_id, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: error, message: "deleting comments outside" + error });

            } else {
                connection.query('DELETE FROM comments WHERE comment_id = ?', comment_id, function (error, results, fields) {
                    if (error) {
                        res.status(500).send({ data: error, message: "deleting comments inside" + error });
                    } else {
                        res.status(200).send({ data: results, message: "successfully deleted comments with id " + comment_id })
                    }
                })
            }
        })
    })
    return router;
}