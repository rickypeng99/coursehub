/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router, pool) {
    app.use('/api', require('./user.js')(router, pool));
    app.use('/api', require('./course.js')(router, pool));
    app.use('/api', require('./comments.js')(router, pool));

};