module.exports = function (router, connection) {

    var bcrypt = require('bcryptjs');


    var userIdRoute = router.route('/user/:id');

    userIdRoute.get((req, res) => {
        var net_id = req.params.id;
        connection.query('SELECT * FROM users WHERE net_id = ?' ,net_id, function (error, results, fields) {
            if (error) {
                res.status(404).send({ data: [], message: "404: userRouteGet" })
            }
            else {
                res.status(200).send({ data: results, message: "user with specific id returned" })
            }
        })
    })

    //put - update user's detail
    userIdRoute.put((req, res) => {
        var password = req.body.password;
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        connection.query('UPDATE users SET password = ?, major = ?, first_name = ?, last_name = ? WHERE net_id = ?', [hash, req.body.major, req.body.first_name, req.body.last_name, req.params.id], function (error, results, fields) {
            if (error) {
                res.status(404).send({ data: [], message: "404: userRoutePut" })
            }
            else {
                res.status(200).send({ data: results, message: "user's information updated successfully" })

            }
        })
    })
    var userRoute = router.route('/user');

    //get users' detail
    userRoute.get((req, res) => {
        connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error) {
                res.status(404).send({ data: [], message: "404: userRouteGet" })
            }
            else {
                res.status(200).send({ data: results, message: "user with specific id returned" })
            }
        })
    })

    


    var registerRoute = router.route('/register')

    //register

    registerRoute.post((req, res) => {
        var password = req.body.password
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        var users = {
            // "netid": req.body.netid,
            "net_id": req.body.net_id,
            "major": req.body.major,
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "description": req.body.description,
            "internal_point": 500,
            "password": hash
        }
        connection.query('INSERT into users SET ?', users, function (error, results, fields) {
            if (error) {
                res.status(500).send({ data: [], message: error })
            }
            else {
                res.status(200).send({ data: req.body.net_id, message: "user registered" })
            }
        })
    })





    var loginRoute = router.route('/login')

    //login
    loginRoute.post((req, res) => {
        var net_id = req.body.net_id;
        var password = req.body.password;
        connection.query('SELECT * FROM users WHERE net_id = ?', net_id, (error, results, fields) => {
            if (error) {
                res.status(404).send({ data: [], message: error })
            }
            else {
                if (results.length > 0) {
                    //var salt = bcrypt.genSaltSync(10);
                    //var hash = bcrypt.hashSync(password, salt);
                    if (bcrypt.compareSync(password, results[0].password)) {
                        res.status(200).send({ data: net_id, message: "successfully log in" })
                    } else {
                        res.status(500).send({ data: net_id, message: "password not correct" })
                    }
                } else {
                    res.status(404).send({ data: [], message: "net_id not exists" })
                }
                // var userPassword = results[0].password;

                // if (userPassword == password) {
                //     res.status(200).send({ data: net_id, message: "login succeeded" })
                // } else {
                //     res.status(500).send({ data: results.password, message: results })
                // }
                // if(bcrypt.compareSync(password, userPassword)){
                //     res.status(200).send({data: net_id, message: "login succeeded"})
                // } else{
                //     res.status(500).send({data: [], message: "login failed"})
                // }
            }
        })

    })


    // var bcrypt = require('bcryptjs');

    // //执行登陆业务
    // app.post("/doLogin", router.doLogin);
    // app.post("/doCinemaSubmit", router.doCinemaSubmit);
    // //个人中心页

    // // app.get("/usercenter",router.showUserCenter);

    // app.get("/cinema/:targetId", router.showSelectPage);

    // app.post('/seatHandle', router.seatHandle)
    // //退出
    // app.get("/user_exit", router.logout);

    // //提交修改密码
    // app.post("/reviseMyMsg", router.reviseMyMsg);

    // app.listen(config.port, function () {
    //     console.log("项目启动成功: " + config.port);
    // });

    // var mongoose = require('mongoose');
    // // 引入bcrypt模块
    // var bcrypt = require('bcrypt');
    // // 定义加密密码计算强度
    // var SALT_WORK_FACTOR = 10;

    // // 连接数据库
    // mongoose.connect('mongodb://localhost:27017/test')

    // // 定义用户模式
    // var UserSchema = new mongoose.Schema({
    //     name: {
    //         unique: true,
    //         type: String
    //     },
    //     password: {
    //         unique: true,
    //         type: String
    //     }
    // }, { collection: "user" });

    // // 使用pre中间件在用户信息存储前进行密码加密
    // UserSchema.pre('save', function (next) {
    //     var user = this;

    //     // 进行加密（加盐）
    //     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    //         if (err) {
    //             return next(err);
    //         }
    //         bcrypt.hash(user.password, salt, function (err, hash) {
    //             if (err) {
    //                 return next(err);
    //             }
    //             user.password = hash;
    //             next();
    //         })
    //     });
    // });

    // // 编译模型
    // var UserBox = mongoose.model('UserBox', UserSchema);

    // // 创建文档对象实例
    // var user = new UserBox({
    //     name: "Jack",
    //     password: "123456"
    // });

    // // 保存用户信息
    // user.save(function (err, user) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         // 如果保存成功，打印用户密码
    //         console.log("password: " + user.password);
    //     }
    // })



    return router;
}
