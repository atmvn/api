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
var db;

require('mongodb').connect(mongourl, function(err, conn){
	db = conn;
	AM.accounts = db.collection('accounts');
});

//module.exports = AM;

// logging in //

AM.autoLogin = function(user, pass, callback)
{
	AM.accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

AM.manualLogin = function(user, pass, callback)
{
	AM.accounts.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			bcrypt.compare(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

// record insertion, update & deletion methods //

AM.signup = function(newData, callback)
{
	AM.accounts.findOne({user:newData.user}, function(e, o) {
		console.log('user: ' + newData);
		if (o){
			console.log('username-taken: ' + o);
			callback('username-taken');
		}	else{
			AM.accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					AM.saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						AM.accounts.insert(newData, callback(null));
					});
				}
			});
		}
	});
}

AM.update = function(newData, callback)
{
	AM.accounts.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		o.usertype  = newData.usertype;
		if (newData.pass == ''){
			AM.accounts.save(o); callback(o);
		}	else{
			AM.saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				AM.accounts.save(o); callback(o);
			});
		}
	});
}

AM.setPassword = function(email, newPass, callback)
{
	AM.accounts.findOne({email:email}, function(e, o){
		AM.saltAndHash(newPass, function(hash){
			o.pass = hash;
			AM.accounts.save(o); callback(o);
		});
	});
}

AM.validateLink = function(email, passHash, callback)
{
	AM.accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

AM.saltAndHash = function(pass, callback)
{
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(pass, salt, function(err, hash) {
			callback(hash);
		});
	});
}

AM.delete = function(id, callback)
{
	AM.accounts.remove({_id: this.getObjectId(id)}, callback);
}

// auxiliary methods //

AM.getEmail = function(email, callback)
{
	AM.accounts.findOne({email:email}, function(e, o){ callback(o); });
}

AM.getObjectId = function(id)
{
	return AM.accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

AM.getAllRecords = function(callback)
{
	AM.accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

AM.delAllRecords = function(id, callback)
{
	AM.accounts.remove(); // reset accounts collection for testing //
}

// just for testing - these are not actually being used //

AM.findById = function(id, callback)
{
	AM.accounts.findOne({_id: this.getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


AM.findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	AM.accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
};


exports.signUp = function(req, res) 
{
	var retdata = {};
	AM.signup(req.body, function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = req.body;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};

exports.login = function(req, res) 
{
	var retdata = {};
	AM.manualLogin(req.body.user, req.body.pass,function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			retdata = req.body;
			retdata.msg = 'ok';
			res.send(retdata, 200);
		}
	});	
};

// Find all user
exports.findAll = function(req, res)
{
	db.collection('accounts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });	
    });
    
};

// Find a user by id
// Input:
//     	- id: User ID
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving account: ' + id);
    db.collection('accounts', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

// Find user by type
// Input:
//     	- type: Drive or User
exports.findByType = function(req, res) {
    var id = req.params.type;
    console.log('Retrieving account: ' + id);
    db.collection('accounts', function(err, collection) {
        collection.find({'usertype':id}).toArray(function(err, items) {
            res.send(items);
        });
    });
}

// Update user location
// Input:
//     	- id: user ID (in URL)
//     	- location: {[lon,lat]}
exports.updateLocation = function(req, res) {
    var id = req.params.id;
    var Location = req.body;
    console.log('Updating Location for userID: ' + id); 
    console.log(JSON.stringify(Location));
    
    //http://stackoverflow.com/questions/5892569/responding-a-json-object-in-nodejs
    
    var now = new Date();
	var jsonDate = now.toJSON();

	var info =  { 
      "loc": Location.loc, 
      "uptime": jsonDate, 
    };
  
  	 console.log('current time: ' + jsonDate); 
  	console.log(JSON.stringify(info));
  	
    db.collection('accounts', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, {$set: info}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating Location: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(info);
            }
        });
    });
}

// Update user status
// Input:
//     	- id: user ID (in URL)
//     	- status: 1-online, 2-busy, 3-serving.
exports.updateStatus = function(req, res) {
    var id = req.params.id;
    var Status = req.body;
    console.log('Updating Location: ' + id); 
    console.log(JSON.stringify(Status));
    
    var now = new Date();
	var jsonDate = now.toJSON();
	
    var info =  { 
      "status": Status.status, 
      "uptime": jsonDate, 
    };
    
    db.collection('accounts', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, {$set: info}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating status: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(info);
            }
        });
    });
}

// Find the closed Users: return without distance
// Input:
//     	- location: {[lon,lat]}
exports.findByDistance = function(req, res) {
    var Location = req.body;
    //var obj = JSON.parse(Location);
    console.log('Retrieving accounts by distance: ' + req.body);
    var point = [];
    point = req.body.loc
    console.log('Retrieving accounts by distance: ' + req.body.loc);
    db.collection('accounts', function(err, collection) {
        collection.find({'loc': {$near: point}}).toArray(function(err, items) {
            res.send(items);
        });
    });
}

// Find the closed Users: return with distance
// Input:
//     	- location: {[lon,lat]}
// 		- type: user type (Driver or User)
// 		- number: number of record return
// 		- status: status of user
exports.findByDistance2 = function(req, res) {
    var Location = req.body;
    var type = req.body.type;
    var number = req.body.number;
    var status = req.body.status;
    //var obj = JSON.parse(Location);
    console.log('Retrieving accounts by distance: ' + req.body);
    var point = [];
    point = req.body.loc
    console.log('Retrieving accounts by distance: ' + req.body.loc);

    db.command({geoNear: 'accounts', near: req.body.loc, distanceMultiplier: 3963, spherical: true, num: number,
    	query:{
			$and:[
					{"usertype":type},
					{"status":status}
				]
			}
		}, function(e, reply) {
		if (e) { 
			res.send("" + e); 
		}
		else {
			//console.log('Retrieving accounts by distance: ' + reply);
			res.send(reply);
		}
    });
}

// Find the closed Users: return with distance
// Input:
//     	- location: {[lon,lat]}
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.findByDistance3 = function(req, res) {
    var Location = req.body;
    var number = req.body.number;
    var conditions = req.body.conditions;
    
    //var obj = JSON.parse(Location);
    //console.log('Retrieving accounts by distance: ' + req.body);
    console.log('Retrieving accounts by distance: ' + req.body.loc);

    db.command({geoNear: 'accounts', near: req.body.loc, distanceMultiplier: 3963, spherical: true, num: number,
    	query:{
			$and:[
					conditions
				]
			}
		}, function(e, reply) {
		if (e) { 
			res.send("" + e); 
		}
		else {
			//console.log('Retrieving accounts by distance: ' + reply);
			res.send(reply);
		}
    });
}

// Find the closed Users: return with distance
// Input:
//     	- location: {[lon,lat]}
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.findByDistance4 = function(req, res) {
//     var Location = req.body;
//     var number = req.body.number;
//     var conditions = req.body.conditions;
//     console.log(JSON.stringify(req.body));
//     //var point = parseString(req.body.loc);
//     var lat = parseFloat(req.body.lat,10);
//     var lon = parseFloat(req.body.lon,10);
//     var temp = {"loc" : [ parseFloat(req.body.lon),parseFloat(req.body.lat) ]};
//     
//     //conditions = JSON.parse(JSON.stringify(req.body.conditions));
//     if (typeof req.body.conditions !== 'object') {
//     	//conditions = JSON.parse(req.body.conditions);
//     }
    
    // in requires
	var url = require('url');
	var qs = require('querystring');

	// later
	var parts = url.parse(req.url, true);

    // build condition 
    conditions = {};
    for(var attributename in parts.query){
    	console.log(attributename+": "+parts.query[attributename]);
    	if (attributename !== 'number' && attributename !== 'lat' && attributename !== 'lon') {
    		console.log(attributename+": "+parts.query[attributename]);
    		conditions[attributename] = parts.query[attributename];
    	}
	}
	
	var number = parts.query['number'];
	var lat = parseFloat(parts.query['lat'],10);
    var lon = parseFloat(parts.query['lon'],10);
    var temp = {"loc" : [ lon,lat ]};
    
    //var obj = JSON.parse(Location);
    console.log('- condition: ' + JSON.stringify(conditions));
    console.log('- loc: ' + JSON.stringify(temp.loc) + parts.query['lat']);
	console.log('- number: ' + number);
	
    db.command({geoNear: 'accounts', near: temp.loc, distanceMultiplier: 3963, spherical: true, num: number,
    	query:{
			$and:[
					conditions
				]
			}
		}, function(e, reply) {
		if (e) { 
			res.send("" + e); 
		}
		else {
			//console.log('Retrieving accounts by distance: ' + reply);
			res.send(reply);
		}
    });
}


// Find the closed Users:
// Input:
//     	- id: user ID (in URL)
// 		- type: user type (Driver or User)
// 		- number: number of record return
exports.findByDistanceWithAccountID = function(req, res) {
    var id = req.params.id;
	var type = req.body.type;
    var number = req.body.number;
    console.log('Retrieving accounts by distance: ' + id);
    db.collection('accounts', function(err, collection) {
    	collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
    		var point = user.loc;
    		console.log('Retrieving accounts by distance: ' + point);
    		db.command({geoNear: 'accounts', near: user.loc, distanceMultiplier: 3963, spherical: true, num: 10,
    			query:{
							$and:[
								{"usertype":type}
							]
						}
				}, function(e, reply) {
				if (e) { 
					res.send("" + e); 
				}
				else {
					//console.log('Retrieving accounts by distance: ' + reply);
					res.send(reply);
				}
			});
            // collection.find({'loc': {$near: point}}).toArray(function(err, items) {
//             	res.send(items);
//         	});
        });
    });
}


// Find the closed Users:
// Input:
//     	- id: user ID (in URL)
// 		- type: user type (Driver or User)
// 		- number: number of record return
// 		- status: status of user
exports.findByDistanceWithAccountID2 = function(req, res) {
    var id = req.params.id;
    var type = req.body.type;
    var number = req.body.number;
    var status = req.body.status;
    
//  //console.log('Retrieving accounts by distance: ' + number);
//     console.log('Retrieving accounts by distance - req.body1: ' + req.body);
//     //console.log('Retrieving accounts by distance - params: ' + JSON.stringify(req.params));
//     //console.log('Retrieving accounts by distance - req.body: ' + req.body['number']);
//     
//     //console.log('Retrieving accounts by distance - req.rawBody: ' + req.rawBody);
//     
//     
//     
//     for(var attributename in req.rawBody){
//     	console.log(attributename+": "+req.rawBody[attributename]);
//     	//conditions = 
// 	}
// 	
// 	for(var attributename in req.params){
//     	console.log(attributename+": "+req.params[attributename]);
//     	//conditions = 
// 	}
	
    db.collection('accounts', function(err, collection) {
    	collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
    		var point = user.loc;
    		console.log('Retrieving accounts by distance: ' + point);
    		db.command({geoNear: 'accounts', near: user.loc, distanceMultiplier: 3963, spherical: true, num: number, 
    					query:{
							$and:[
								{"usertype":type},
								{"status":status}
							]
						}
				}, function(e, reply) {
				if (e) { 
					res.send("" + e); 
				}
				else {
					//console.log('Retrieving accounts by distance: ' + reply);
					res.send(reply);
				}
			});
            // collection.find({'loc': {$near: point}}).toArray(function(err, items) {
//             	res.send(items);
//         	});
        });
    });
}

// Find the closed Users:
// Input:
//     	- id: user ID (in URL)
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.findByDistanceWithAccountID3 = function(req, res) {
    var id = req.params.id;
    var conditions = req.body.conditions;
    var number = req.body.number;
    
// 	console.log('Retrieving accounts by distance - conditions: ' + JSON.stringify(req.body));
//  console.log('Retrieving accounts by distance - req.body.: ' + req.body);
    
    for(var attributename in req.body.conditions){
    	console.log(attributename+": "+req.body.conditions[attributename]);
    	//conditions = 
	}
	
	
    console.log('Retrieving accounts by distance: ' + id);
    db.collection('accounts', function(err, collection) {
    	collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
    		var point = user.loc;
    		console.log('Retrieving accounts by distance: ' + point);
    		db.command({geoNear: 'accounts', near: user.loc, distanceMultiplier: 3963, spherical: true, num: number, 
    					query:{
    						$and:[ 
    							conditions
    						]
						}	
								
				}, function(e, reply) {
				if (e) { 
					res.send("" + e); 
				}
				else {
					//console.log('Retrieving accounts by distance: ' + reply);
					res.send(reply);
				}
			});
            // collection.find({'loc': {$near: point}}).toArray(function(err, items) {
//             	res.send(items);
//         	});
        });
    });
}

// Find the closed Users:
// Input:
//     	- id: user ID (in URL)
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
exports.findByDistanceWithAccountID4 = function(req, res) {
	var id = req.params.id;
	
	// in requires
	var url = require('url');
	var qs = require('querystring');

	// later
	var parts = url.parse(req.url, true);

    // build condition 
    conditions = {};
    for(var attributename in parts.query){
    	console.log(attributename+": "+parts.query[attributename]);
    	if (attributename !== 'number' && attributename !== 'lat' && attributename !== 'lon') {
    		console.log(attributename+": "+parts.query[attributename]);
    		conditions[attributename] = parts.query[attributename];
    	}
	}
	
	var number = parts.query['number'];
    
    console.log('- condition: ' + JSON.stringify(conditions));
    console.log('- number: ' + number);
   	
    console.log('Retrieving accounts by distance: ' + id);
    db.collection('accounts', function(err, collection) {
    	collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
    		var point = user.loc;
    		console.log('Retrieving accounts by distance: ' + point);
    		db.command({geoNear: 'accounts', near: user.loc, distanceMultiplier: 3963, spherical: true, num: number, 
    					query:{
    						$and:[ 
    							conditions
    						]
						}	
								
				}, function(e, reply) {
				if (e) { 
					res.send("" + e); 
				}
				else {
					//console.log('Retrieving accounts by distance: ' + reply);
					res.send(reply);
				}
			});
            // collection.find({'loc': {$near: point}}).toArray(function(err, items) {
//             	res.send(items);
//         	});
        });
    });
}