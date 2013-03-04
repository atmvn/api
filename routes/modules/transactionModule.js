var mongo = require('mongodb');

var bcrypt = require('bcrypt')
// use moment.js for pretty date-stamping //
var moment = require('moment');

var AM = require('../modules/accountModule');;

var Server = mongo.Server,
    BSON = mongo.BSONPure;

//var server = new Server('localhost', 27017, {auto_reconnect: true});
//db = new Db('login-testing', server);


var express = require("express");
var app = express.createServer();
//var app = express();

var TM = {}; 

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
var db;

require('mongodb').connect(mongourl, function(err, conn){
	db = conn;
	TM.transactions = db.collection('transactions');
});


//////////////////--Helper--//////////////////
var replaceItemInArray = function(array,oldItem,newItem) {
	//console.log('-array' + array + '-old:' + oldItem + "new:" + newItem) ;

	var index = array.indexOf(oldItem);

	console.log('-check' + index);
	if ( oldItem == null || newItem == null) {
		return array;
	} else if (typeof(oldItem) == undefined || typeof(newItem) == undefined) {
		return array;
	} else if (index >= 0) {
		array.splice(index,1,newItem);
	} 
	//console.log('-arrayafter:' + array);
	return array;
}

var insertItemInArray = function(array,item) {
	//console.log('-array' + array + '-item' + item);

	//console.log('-check' + array.indexOf(item));
	if ( item == null ) {
		return array;
	} else if (typeof(item) == undefined) {
		return array;
	} else if (array.indexOf(item) < 0) {
		array.push(item);
	} 
	return array;
}

var deleteItemInArray = function(array,item) {
	//console.log('-array' + array + '-item' + item);

	//console.log('-check:' + array.indexOf(item));
	var index = array.indexOf(item);
	if (index < 0) {
		//array.push(item);
	} else {
		array.splice(index,1);
	}
	//console.log('-arrayafter:' + array);

	return array;
}

//var DB = require('./dbModule');

// constructor call
//var object = new DB("accounts");

//AM.accounts = DB.AM; 

module.exports = TM;

TM.requestTransaction = function(data, callback)
{
};

TM.createTransaction = function(id, callback)
{
};

TM.confirmTransaction = function(id, callback)
{
};

TM.cancelTransaction = function(id, callback)
{
};





