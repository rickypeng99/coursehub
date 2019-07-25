module.exports = function (router, pool) {

    var skillGorupRoute = router.route('/skill/group/:id');
    skillGorupRoute.get((req, res) => {
        var id = req.params.id;

        pool.query('SELECT skill FROM groups_skills WHERE group_id = ?', id, function (error, results, fields){
            if(error || results.length < 1){
                res.status(404).send({ data: [], message: "404: Couldn't find any skill listed for this group " + id})
            } else{
                res.status(200).send({ data: results, message: "returned skills for group "+ id})
            }
        })

    })

    var skillUserRoute = router.route('/skill/user/:id');
    skillUserRoute.get((req, res) => {
        var id = req.params.id;

        pool.query('SELECT * FROM users_skills WHERE net_id = ?', id, function (error, results, fields){
            if(error){
                res.status(404).send({ data: [], message: "404: Couldn't find any skill listed for this user " + id})
            } else if(results.length < 1){
                res.status(200).send({ data: [], message: "No skills founded for this user " + id})
            } else{
                res.status(200).send({ data: results, message: "returned skills for user "+ id})
            }
        })

    })



    return router;
}