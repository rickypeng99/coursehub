module.exports = function (router, connection) {


    var userRoute = router.route('/user');
    userRoute.get((req, res) => {
        connection.query('SELECT * FROM hero_stat', function(error, results, fields){
            if (error) throw error;
            else{
                res.status(200).send({data: results, message: "Fragment with specific id returned"})
            }
        })
    })
    

    return router;
}
