/**
 * Dealing with joining or managing groups and maching queue
 * 
 */


 

module.exports = function (router, connection) {


    /**
     * get information of all groups
     */

    groupRoute = router.route('/group');


    groupRoute.get((req, res) => {
        connection.query('SELECT * FROM groups', function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "Error in returning all groups"})
            }
            else {
                res.status(200).send({ data: results, message: "All groups returned" })
            }
        })

    })
    /**
    * get information of a specific group
    */
    groupIdRoute = router.route('/group/:id');

    groupIdRoute.get((req, res) => {

        var id = req.params.id;

        connection.query('SELECT * FROM groups WHERE CRN = ?', crn, function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find group with id " + id })
            }
            else {
                res.status(200).send({ data: results, message: "group with id " + id + " returned" })

            }
        })

    })

    /**
     * 
     * 这里还没有改完
     */

    queueUpdateRoute = router.route('/queue/:id');
    queueUpdateRoute.get((req, res) => {

        var crn = req.params.id;

        connection.query('SELECT * FROM matching_queue WHERE  = ?', crn, function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find course with crn " + crn })
            }
            else {
                res.status(200).send({ data: results, message: "Matching queue of Course with CRN " + crn + " returned" })

            }
        })

    })



    return router;


}