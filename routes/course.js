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

        pool.query('SELECT * FROM groups WHERE course_CRN = ? ORDER BY group_id', crn, function (error, results, fields) {
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

        // pool.query('SELECT * FROM users_matching_queue WHERE course_CRN = ?', crn, function (error, results, fields) {
        //     if (error) {
        //         res.status(404).send({ data: [], message: "404: Couldn't find course with crn " + crn })
        //     } else if(results.length < 1) {
        //         res.status(200).send({ data: [], message: "No students founded in queue in course " + crn})
        //     } else {
        //         var users = []
        //         for(var i = 0; i < results.length; i++){
        //             users.push(results[i].user_id);
        //         }
                //returning the user objects, will also detect redundancy
                pool.query('SELECT * FROM users JOIN users_matching_queue ON (net_id = user_id) WHERE course_CRN = ? ORDER BY queue_id', crn, function (error, results, fields){
                    if(error){
                        res.status(404).send({ data: error, message: "404: Couldn't find course with crn " + crn })
                    } else{
                        res.status(200).send({ data: results, message: "Matching queue of Course with CRN " + crn + " returned" })
                    }
                })

               

            }

    )

    /**
     * get the current logged in user status for a specific class (isInGroup? isInMatchingqueue? Neither?) and get the group if the user is currently in a group
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
        pool.query('SELECT * FROM groups_users natural JOIN groups WHERE net_id = ? and course_CRN = ?', [net_id, crn], function (error, results, fields){
            if(error){
                res.status(404).send({ data: error, message: error})
            } else{
                if(results.length > 0){
                    status.isInGroup = true
                    var group = {
                        group_id: results[0].group_id,
                        group_name: results[0].name,
                        founder: results[0].founder,
                        students_current: results[0].students_current,
                        students_limit: results[0].students_limit,
                        description: results[0].description,
                    }
                    status.group = group
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


    //get average internal_point for each group_id


    groupAverageRoute = router.route('/course/:id/group/average')
    groupAverageRoute.get((req, res) => {
        var course_CRN = req.params.id

        pool.query('SELECT AVG(U.internal_point) FROM Groups_Users GU, Users U where GU.net_id = U.net_id and GU.group_id IN (select group_id from groups where course_CRN = ?) group by gu.group_id', course_CRN , function (error, results, fields){
            if(error){
                res.status(500).send({ data: error, message: error})
            } else{
                res.status(200).send({ data: results, message: error})
            }
        })
        
    })

    return router;


}