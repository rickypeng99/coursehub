module.exports = function (router, connection) {

    commentRoute = router.route('/comment')

    commentRoute.get((req, res) => {
        connection.query('SELECT * FROM comments', function(error, results, fields) {
            if(error || results.length < 1){
                res.status(404).send({ data: [], message: "No comments returned!"})
            } else{
                res.status(200).send({ data: results, message: "All comments returned"})
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
                connection.query('INSERT into users_comments SET ?', commentRelation , function (error, results, fields) {
                    if (error) {

                    } else {
                        res.status(200).send({ data: comment, message: "Added comments to user with netId " + receiver })
                    }
                })

            }
        })
    })

    return router;
}