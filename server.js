var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    //local mysql db connection
    connection = mysql.createConnection({
      host: 'coursehub.mysql.database.azure.com',
      user: 'coursehub@coursehub',
      password: '!Admin12345',
      database: 'coursehub',
      port: 3306,
      ssl: true
    
      });
    

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

process.on('uncaughtException', function(err) {
  // handle the error safely
  console.log(err)
})


// Connect to a Mysql
connection.connect();
// connection.query('SELECT * FROM hero_stat', function(error, results, fields){
//   if (error) throw error;
//   console.log(results)
// })

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")))


// Use routes as a module (see index.js)
require('./routes')(app, router, connection);

// Start the server
app.timeout = 0;

app.listen(port);
console.log('Server running on port ' + port);
