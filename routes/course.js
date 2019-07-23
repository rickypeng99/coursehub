module.exports = function (router, pool) {


    /**
     * get information of all courses
     */

    courseRoute = router.route('/course');


    courseRoute.get((req, res) => {
        pool.query('SELECT * FROM courses WHERE type  LIKE "%Lecture%"  ORDER BY dept, idx', function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "Error in returning all courses"})
            }
            else {
                res.status(200).send({ data: results, message: "All courses returned" })
            }
        })

    })
    /**
    * get information of a specific course
    */
    courseIdRoute = router.route('/course/:id');

    courseIdRoute.get((req, res) => {

        var crn = req.params.id;

        pool.query('SELECT * FROM courses WHERE CRN = ?', crn, function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find course with crn " + crn })
            }
            else {
                res.status(200).send({ data: results, message: "Course with CRN " + crn + " returned" })

            }
        })

    })


    /**
     * Retrieved all groups belonging to this class
     */
    courseIdGroupRoute = router.route('/course/:id/group');
    
    courseIdGroupRoute.get((req, res) => {

        var crn = req.params.id;

        pool.query('SELECT * FROM groups WHERE course_CRN = ?', crn, function (error, results, fields) {
            if (error || results.length < 1) {
                res.status(404).send({ data: [], message: "404: Couldn't find course with crn " + crn })
            }
            else {
                res.status(200).send({ data: results, message: "All groups of Course with CRN " + crn + " returned" })

            }
        })

    })

    courseIdQueueRoute = router.route('/course/:id/queue');
    courseIdQueueRoute.get((req, res) => {

        var crn = req.params.id;

        pool.query('SELECT * FROM matching_queue WHERE course_CRN = ?', crn, function (error, results, fields) {
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