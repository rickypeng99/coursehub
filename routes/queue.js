
/**
 * dealing with operations regarding matching queues
 */
module.exports = function (router, pool) {

    /**
     * adding a user to a mataching queue
     */

    queueUserRoute = router.route('/queue/:id')
    queueUserRoute.post((req, res) => {
        var crn = req.params.id;
        var net_id = req.body.net_id;

        var add = {
            course_CRN: crn,
            user_id: net_id
        }
        pool.query('INSERT into users_matching_queue SET ?', add, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: error, message: error })
            } else {
                res.status(200).send({ data: net_id, message: "Successfully adding the user " + net_id + " into the mataching queue with course_CRN " + crn })
            }
        })

    })

    /**
     *  removing an user from a mataching queue
     */

    queueUserIdRoute = router.route('/queue/:id/user/:net_id')
    queueUserIdRoute.delete((req, res) => {
        var crn = req.params.id;
        var net_id = req.params.net_id;
        
        pool.query('DELETE FROM users_matching_queue WHERE course_CRN = ? AND user_id = ?', [crn, net_id], function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: error, message: error })
            } else {
                res.status(200).send({ data: net_id, message: "Successfully removing the user " + net_id + " from the mataching queue with course_CRN " + crn })
            }
        })

    })


    return router;
}