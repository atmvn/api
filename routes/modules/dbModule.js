// var mongo = require('mongodb');

// var bcrypt = require('bcrypt')
// // use moment.js for pretty date-stamping //
// var moment = require('moment');

// var Server = mongo.Server,
//     BSON = mongo.BSONPure;

// //var server = new Server('localhost', 27017, {auto_reconnect: true});
// //db = new Db('login-testing', server);


// var express = require("express");
// var app = express.createServer();
// //var app = express();
// var AM = {}; 
// //var mongo;

// /*
// app.configure('development', function(){
//     mongo = {
//         "hostname":"localhost",
//         "port":27017,
//         "username":"trong",
//         "password":"123456",
//         "name":"",
//         "db":"taxi"
//     }
// });

// // default database of appfog
// app.configure('production', function(){
//     var env = JSON.parse(process.env.VCAP_SERVICES);
//     mongo = env['mongodb-1.8'][0]['credentials'];
// });
// */
// //mongodb://<dbuser>:<dbpassword>@ds037827.mongolab.com:37827/taxivn
// //https://mongolab.com/databases/taxivn#users
// app.configure('production', function(){
//     mongo = {
//         "hostname":"ds037827.mongolab.com",
//         "port":37827,
//         "username":"trong",
//         "password":"123456",
//         "name":"",
//         "db":"taxivn"
//     }
// });
// app.configure('development', function(){
//     mongo = {
//         "hostname":"ds037827.mongolab.com",
//         "port":37827,
//         "username":"trong",
//         "password":"123456",
//         "name":"",
//         "db":"taxivn"
//     }
// });
// var generate_mongo_url = function(obj){
//     obj.hostname = (obj.hostname || 'localhost');
//     obj.port = (obj.port || 27017);
//     obj.db = (obj.db || 'test');
//     if(obj.username && obj.password){
//     	console.log("mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db);
//         return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
//     }else{
//     	console.log("mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db);
//         return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
//     }
// }
// var mongourl = generate_mongo_url(mongo);
// DB = {};
// //var collection = {};

// //var collection = DB.collection('accounts');

// require('mongodb').connect(mongourl, function(err, conn) {
//     DB = module.exports = conn;
// });

// module.exports = DB;

// // module.exports = function(params)
// // {
// //     return require('controllers/index')(params);
// // }

module.exports = function Database() {
    var mongo = require('mongodb');

    var bcrypt = require('bcrypt')
    // use moment.js for pretty date-stamping //
    var moment = require('moment');

    var Server = mongo.Server,
        BSON = mongo.BSONPure;

    //var server = new Server('localhost', 27017, {auto_reconnect: true});
    //db = new Db('login-testing', server);


    var express = require("express");
    var app = express.createServer();
    //var app = express();
    var AM = {}; 
    //var mongo;

    /*
    app.configure('development', function(){
        mongo = {
            "hostname":"localhost",
            "port":27017,
            "username":"trong",
            "password":"123456",
            "name":"",
            "db":"taxi"
        }
    });

    // default database of appfog
    app.configure('production', function(){
        var env = JSON.parse(process.env.VCAP_SERVICES);
        mongo = env['mongodb-1.8'][0]['credentials'];
    });
    */
    //mongodb://<dbuser>:<dbpassword>@ds037827.mongolab.com:37827/taxivn
    //https://mongolab.com/databases/taxivn#users
    app.configure('production', function(){
        mongo = {
            "hostname":"ds037827.mongolab.com",
            "port":37827,
            "username":"trong",
            "password":"123456",
            "name":"",
            "db":"taxivn"
        }
    });
    app.configure('development', function(){
        mongo = {
            "hostname":"ds037827.mongolab.com",
            "port":37827,
            "username":"trong",
            "password":"123456",
            "name":"",
            "db":"taxivn"
        }
    });
    var generate_mongo_url = function(obj){
        obj.hostname = (obj.hostname || 'localhost');
        obj.port = (obj.port || 27017);
        obj.db = (obj.db || 'test');
        if(obj.username && obj.password){
            console.log("mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db);
            return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }else{
            console.log("mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db);
            return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
    }
    var mongourl = generate_mongo_url(mongo);
    DB = {};
    //var collection = {};

    //var collection = DB.collection('accounts');

    // require('mongodb').connect(mongourl, function(err, conn) {
    //     DB = conn;
    //     console.log(DB);
    // });

    this.getCollection = function(name,callback) 
    {
        require('mongodb').connect(mongourl, function(err, conn){
            db = conn;
            console.log(db);
            callback(db);
            //console.log(JSON.stringify(db));
        });
        //collection = DB.collection('accounts');
        //AM.accounts = DB.collection('accounts');
    };

};


//var collection = DB.collection('accounts');

// DB.getCollection = function(name,callback)
// {
//     //var collection = DB.collection('accounts');
//     callback(collection);
// };

