/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router, pool) {
    app.use('/api', require('./user.js')(router, pool));
    app.use('/api', require('./course.js')(router, pool));
    app.use('/api', require('./comments.js')(router, pool));
    app.use('/api', require('./group.js')(router, pool));
    app.use('/api', require('./skill.js')(router, pool));
    app.use('/api', require('./queue.js')(router, pool));
    app.use('/api', require('./invitation.js')(router, pool));

};