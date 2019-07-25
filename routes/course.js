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
            if (error) {
                res.status(404).send({ data: [], message: "404: Couldn't find course with crn " + crn })
            } else if(results.length < 1){
                res.status(200).send({ data: [], message: "No groups retutned for course with " + crn })
            }
            else {
                res.status(200).send({ data: results, message: "All groups of Course with CRN " + crn + " returned" })

            }
        })

    })

    //return the user objects instead of just netIds from the matching queue of the given class

    courseIdQueueRoute = router.route('/course/:id/queue');
    courseIdQueueRoute.get((req, res) => {

        var crn = req.params.id;

        pool.query('SELECT * FROM users_matching_queue WHERE course_CRN = ?', crn, function (error, results, fields) {
            if (error) {
                res.status(404).send({ data: [], message: "404: Couldn't find course with crn " + crn })
            } else if(results.length < 1) {
                res.status(200).send({ data: [], message: "No students founded in queue in course " + crn})
            } else {
                var users = []
                for(var i = 0; i < results.length; i++){
                    users.push(results[i].user_id);
                }
                //returning the user objects, will also detect redundancy
                pool.query('SELECT * FROM users WHERE net_id IN(?)', [users], function (error, results, fields){
                    if(error){
                        res.status(404).send({ data: error, message: "404: Couldn't find course with crn " + crn })
                    } else{
                        res.status(200).send({ data: results, message: "Matching queue of Course with CRN " + crn + " returned" })
                    }
                })

               

            }
        })

    })

    /**
     * get the current logged in user status for a specific class (isInGroup? isInMatchingqueue? Neither?)
     */

    courseUserStatusRoute = router.route('/course/:id/user/:net_id')
    courseUserStatusRoute.get((req, res) => {
        var crn = req.params.id;
        var net_id = req.params.net_id;

        var status = {
            isInGroup: false,
            isInMatchingQueue: false
        }

        //see if the user is inside of a group
        pool.query('SELECT count(*) FROM groups_users WHERE net_id = ? AND group_id IN (SELECT group_id FROM groups WHERE course_CRN = ?)', [net_id, crn], function (error, results, fields){
            if(error){
                res.status(404).send({ data: error, message: error})
            } else{
                var count = results[0]['count(*)']
                if(count > 0){
                    status.isInGroup = true
                }
                pool.query('SELECT count(*) FROM users_matching_queue WHERE user_id = ? AND course_CRN = ?', [net_id, crn], function (error, results, fields){
                    if(error){
                        res.status(404).send({ data: error, message: error})
                    } else{
                        var count =  results[0]['count(*)']
                        if(count > 0){
                            status.isInMatchingQueue = true
                        }
                        res.status(200).send({ data: status, message: "Successfully returned user " + net_id + "'s status from course " + crn})
                    }
                })
                
            }
        })


    })


    return router;


}