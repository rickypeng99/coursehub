/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router, connection) {
    app.use('/api', require('./user.js')(router, connection));
    app.use('/api', require('./group.js')(router, connection));
};