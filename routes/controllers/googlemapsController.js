var gm = require('googlemaps');
var AM = require('../modules/accountModule');
var util = require('util');
var sleep = require('sleep');




util.puts("geocode started.");

var checkedIndex = [];
// exports.geocoder = function(req, res) {

// 	checkedIndex = [];
// 	var retdata = {};

// 	util.puts("geocoding......");

// 	var tableDB = 1;
// 	AM.getAllRecords(tableDB,function(e, o) {
// 		if (!o) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			// retdata = o;
// 			// retdata.msg = 'ok';
// 			// res.send(retdata, 200);
// 			for(var placeIndex = 1; placeIndex < 200 ; ++placeIndex) {
// 				sleep.sleep(0.5)//sleep for 5 seconds
// 				console.log(" - index:" + placeIndex + " --- "+ o[placeIndex].address );
				
// 				var address = o[placeIndex].address + "," + o[placeIndex].city;

// 				dbPlaceGeocoder(o[placeIndex],function(e, placeObject){
// 					if (e) {
// 						//console.log('Geocoder - error:' + e + '---address' + address);
// 						retdata.msg = e;
// 						//res.send(retdata, 400);
// 					} else {
// 						AM.saveData(tableDB,placeObject);	
// 					}
// 				});
// 			}
// 		}
// 	});	
// }

exports.geocoderSeq = function(req, res) {

	var retdata = {};

	checkedIndex = [];

	util.puts("geocoding...... start index = " + req.params.startIndex + " --- end index = " + req.params.endIndex );

	var tableDB = 1;
	AM.getAllRecords(tableDB,function(e, o) {
		if (!o) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			geocoderSequence(o,Number(req.params.startIndex),Number(req.params.endIndex),function(e, res) {
				if (e) {
					retdata.msg = e;
					//res.send(retdata, 400);
				} else {
					console.log(" - geocoderSeqMain - " + res);
					retdata.msg = "OK";
					//res.send(retdata, 200);
				}

			});			
		}
	});	
}

geocoderSequence = function(places,placeIndex,maxIndex,callback) {

	var retdata = {};

	var placeObject = places[placeIndex];
	
	var address = placeObject.address + "," + placeObject.city;

	var tableDB = 1;

	console.log(" - geocoderSequence - placeIndex: " + placeIndex + " -- address:" + address);

	// check the plase is already has googlemap info
	if (placeObject.gmchecked == "1" || placeObject.gmchecked == "-1") {
		console.log('geocoderSequence - googlemaped: ' + placeIndex);
		checkedIndex.push(placeIndex);		
	}

	var boolCheck = checkedIndex.indexOf(placeIndex);

	// ------------ TRongv- temporary udpate for loc is null
	maxIndex = 14056;
	if (placeObject.loc != null) {
		// go to next object
		placeIndex = placeIndex + 1;
		if (placeIndex < maxIndex) {
			//sleep.sleep(1)//sleep for 5 seconds
			console.log(" - geocoderSequence - placeIndex: " + placeIndex + "--- maxIndex: " + maxIndex + "----- [NEXT]");
			geocoderSequence(places,placeIndex,maxIndex,function(e, Res_placeObject) {

			});
		}	
	} else {

		if (boolCheck == -1) {
			decodeLoop(placeObject,1,function(e, Res_placeObject){
				if (e) {
					//console.log('Geocoder - error:' + e + '---address' + address);
					retdata.msg = e;
					console.log(" - geocoderSequence - placeIndex - error: " + placeIndex + "----- [ERROR] -> [NEXT]" + e);

					// save and check unknow from google code
					if (placeObject.gmchecked == "-1") {
						console.log(" - geocoderSequence - placeIndex - error: " + placeIndex + "----- [SAVE-UNKNOWN-ADDRESS] -> [NEXT]" + e);
						AM.saveData(tableDB,Res_placeObject,function(e, res) {
						});
					}

					placeIndex = placeIndex + 1;
					if (placeIndex < maxIndex && checkedIndex.indexOf(placeIndex) == -1) {
						sleep.sleep(1)//sleep for 5 seconds
						console.log(" - geocoderSequence - placeIndex - error: " + placeIndex + "--- maxIndex: " + maxIndex + "----- [NEXT]");
						geocoderSequence(places,placeIndex,maxIndex,function(e, Res_placeObject) {

						});;
					}
					else {
						console.log(" - geocoderSequence - placeIndex:- error" + placeIndex + "--- maxIndex: " + maxIndex + " --checkedIndex=" + checkedIndex +"----- [DONE]");
						retdata.msg = "done";
						callback(null, retdata);	
					}
				} else {
					//var boolCheck = checkedIndex.indexOf(placeIndex);
					console.log(" - geocoderSequence - placeIndex: " + placeIndex + "--- maxIndex: " + maxIndex + "----- [OK]");
					checkedIndex.push(placeIndex);
					Res_placeObject.gmchecked = "1";
					AM.saveData(tableDB,Res_placeObject,function(e, res) {
						if (e) {
				                retdata.msg = e;
								console.log(" - geocoderSequence - placeIndex: " + placeIndex + "--- maxIndex: " + maxIndex + "-----Save error" + e);
						} else {
							placeIndex = placeIndex + 1;
							var boolCheck = checkedIndex.indexOf(placeIndex);
							console.log(" - geocoderSequence - checkedIndex: " + boolCheck + "[NEXT]");
							if (placeIndex < maxIndex && boolCheck == -1) {
								sleep.sleep(1)//sleep for 5 seconds
								console.log(" - geocoderSequence - placeIndex: " + placeIndex + "--- maxIndex: " + maxIndex + "----- [NEXT]");
								geocoderSequence(places,placeIndex,maxIndex,function(e, Res_placeObject) {

								});
							}
							else {
								console.log(" - geocoderSequence - placeIndex: " + placeIndex + "--- maxIndex: " + maxIndex + " --checkedIndex=" + checkedIndex + "----- [DONE]");
								retdata.msg = "done";
								callback(null, retdata);	
							}
						}
					});
					
					
				}
			});
		} else {
			// go to next object
			placeIndex = placeIndex + 1;
			if (placeIndex < maxIndex) {
				sleep.sleep(1)//sleep for 5 seconds
				console.log(" - geocoderSequence - placeIndex: " + placeIndex + "--- maxIndex: " + maxIndex + "----- [NEXT]");
				geocoderSequence(places,placeIndex,maxIndex,function(e, Res_placeObject) {

				});
			}

		}
	}
}

decodeLoop = function(placeObject,loopTime,callback)
{
	var retdata = {};
	console.log(" - decodeLoop - loopTime:" + loopTime + " --- "+ placeObject.address );
	
	var address = placeObject.address + "," + placeObject.city + ", Vietnam" ;

	dbPlaceGeocoder(placeObject,function(e, Res_placeObject){
		if (e) {
			console.log(" - decodeLoop - loopTime:" + loopTime + " ---ERROR"+ e.status);
			if (e.status == "OVER_QUERY_LIMIT" && loopTime < 4) {

				sleep.sleep(5)//sleep for 5 seconds
				decodeLoop(Res_placeObject,loopTime+1,function(e, Res_placeObject1) {

				});
			} 

			if (e.status == "ZERO_RESULTS") {
				Res_placeObject.gmchecked = "-1";
				retdata.msg = e;
				callback(e,Res_placeObject);
			} else {
				//console.log('Geocoder - error:' + e + '---address' + address);
				retdata.msg = e;
				callback(e,Res_placeObject);
				//res.send(retdata, 400);
			}
		} else {
			console.log(" - decodeLoop - loopTime:" + loopTime + "---address" + Res_placeObject.address + " -- [OK] ");
			Res_placeObject.gmchecked = "1";
			callback(null, Res_placeObject);
			//AM.saveData(tableDB,Res_placeObject);	
		}
	});
	
};


dbPlaceGeocoder = function(placeObject,callback)
{
	var address = placeObject.address;
	//address = "747, Hồng Bàng, P.6, Q. 6";
	address = placeObject.address + ", " + placeObject.city;
	gm.geocode(address, function(e, data){
		if (e) {
			console.log('dbPlaceGeocoder - error 1:' + e + '---address' + address);
			callback(e);
		}
		else  {
			config = data;
			var index = 0;
			
			if (data.status != "OK") {
				console.log('dbPlaceGeocoder - error 2:' +  data.status + '---address' + address);
				callback(data,placeObject);
			} else {
				if (data.results.length > 1) {
					console.log('dbPlaceGeocoder - data > 1:' + '---address' + address);
					//console.log(JSON.stringify(data));
				}

				console.log('dbPlaceGeocoder - ok:' +  '---address' + address + JSON.stringify(config.results[index].geometry));
				placeObject.loc = [Number(config.results[index].geometry.location.lng),Number(config.results[index].geometry.location.lat)];
				console.log(address + "---" + config.results[index].geometry.location.lng + "," + config.results[index].geometry.location.lat);
				placeObject.googlemaps = data.results;
				callback(null, placeObject);
			}
		}
	});
};

