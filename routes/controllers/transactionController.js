//var express = require('express'),
    //account = require('./routes/account');
var    AM = require('../modules/accountModule');
var    apns = require('../modules/apnModule');
var    aigoDefine = require('../configs/define');

// Find the closed Driver: return without distance
// Input:
//     	- location: {[lon,lat]}
// 		- number: number of record return
// 		- conditions: json condision - "conitions":{"usertype":"Driver","status":"1"}
// exports.listTokensbyFindByDistance = function(req, res) {

// 	var Location = req.body.loc;
//     var number = req.body.number;
//     var conditions = req.body.conditions;
    
//     console.log('- Location: ' + Location);
//     console.log('- number: ' + number);
//     console.log('- conditions: ' + conditions);
    
//     var retdata = {};
//     var usertype = 0;
// 	AM.listTokensbyFindByDistance(req.body.loc,number,conditions,usertype,function(e, o) {
// 		if (e) {
// 			retdata.msg = e;
// 			res.send(retdata, 400);
// 		}	else {
// 			retdata = o;
// 			retdata.msg = 'ok';
// 			res.send(retdata, 200);
// 		}
// 	});	
// }

// Client this Drivers
exports.requestThisDriver = function(req, res) {

	var clientID = req.params.id;
	var driverID = req.body.driverid;
	//var Location = req.body.loc;
    //var number = req.body.number;
    //var conditions = req.body.conditions;
    
    var number = 1;
    var objectid = AM.getObjectId(driverID,1);
  	var conditions = {
  		"status":aigoDefine.status['online'],
  		"_id":objectid,
  	};
    
    //console.log('- Location: ' + Location);
    console.log('- number: ' + number);
    console.log('- conditions: ' + conditions);
    
    var retdata = {};
    var usertype = 0;
    AM.findById(clientID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			AM.listTokensbyFindByDistance(o.loc,number,conditions,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					console.log('- send notification to desired drivers ' + JSON.stringify(o.info));
					// send notification to desired drivers
					var pushContents = {};
					pushContents.alert = "Client request pick up";
					pushContents.payload = {
						'clientid':clientID,
						'type':aigoDefine.notificationType['requestDriver'],
					};						
					var info = o.info;
					apns.pushInfo_Drivers(pushContents,info,function(e, o) {
		                if (e) {
		                    retdata.msg = e;
							res.send(retdata, 400);
		                } else {
							var usertype = 0;
							var Status = aigoDefine.status['requesting'];
							AM.updateStatus(clientID,Status,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									retdata = o;
									retdata.msg = 'ok';
									res.send(retdata, 200);
								}
							});	
		                }  
		            });	
				}
			});	
		}
	});
}

// Client request Drivers
exports.requestDrivers = function(req, res) {

	var clientID = req.params.id;
	var Location = req.body.loc;
    //var number = req.body.number;
    //var conditions = req.body.conditions;
    
    var number = 10;
  	var conditions = {"status":aigoDefine.status['online']};
    
    console.log('- Location: ' + Location);
    console.log('- number: ' + number);
    console.log('- conditions: ' + conditions);
    
    var retdata = {};
    var usertype = 0;
    AM.findById(clientID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else {
			AM.listTokensbyFindByDistance(o.loc,number,conditions,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					// send notification to desired drivers
					var pushContents = {};
					pushContents.alert = "Client request pick up";
					pushContents.payload = {
						'clientid':clientID,
						'type':aigoDefine.notificationType['requestDriver'],
					};						
					var info = o.info;
					apns.pushInfo_Drivers(pushContents,info,function(e, o) {
		                if (e) {
		                    retdata.msg = e;
							res.send(retdata, 400);
		                } else {
							var usertype = 0;
							var Status = aigoDefine.status['requesting'];
							AM.updateStatus(clientID,Status,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									retdata = o;
									retdata.msg = 'ok';
									res.send(retdata, 200);
								}
							});	
		                }  
		            });	
				}
			});	
		}
	});
}

// Client cancel request
exports.cancelRequestClient = function(req, res) {

	var clientID = req.params.id;
    var retdata = {};
    var usertype = 0;
    var Status = aigoDefine.status['online'];
    AM.findById(clientID,usertype,function(e, o) {
    	//console.log("client info" + JSON.stringify(o));
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == aigoDefine.status['requesting']) {
			usertype = 0;
			o.status = Status;
			o.transaction = "";
			//console.log("client info xxxx=" + usertype + "=xxxxxxxxxxxxx" + JSON.stringify(o));
			AM.saveData(o,usertype,function(e, o) {
				if (e) {
	                retdata.msg = e;
					res.send(retdata, 400);
				} else {
					retdata = o;
					retdata.msg = 'ok';
					res.send(retdata, 200);
				}
			});
		} else if (o.status == aigoDefine.status['accepted']) {

			var driverID = o.transaction;
			//console.log('- 22222: ' + driverID);

			// --- cancelTransactionClient
			var retdata = {};
		    var usertype = 1;
			AM.findById(driverID,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else if (o.status == aigoDefine.status['accepted'] || o.status == aigoDefine.status['arrival']) {
					var Status = aigoDefine.status['online'];
					o.status = Status;
					o.transaction = "";
					AM.saveData(o,usertype,function(e, o) {
					//AM.updateStatus(id,Status,usertype,function(e, o) {
						if (e) {
							retdata.msg = e;
							res.send(retdata, 400);
						} else {
							var pushContents = {};
							pushContents.alert = "Client cancel transaction";
							pushContents.payload = {
								'clientid':clientID,
								'type':aigoDefine.notificationType['cancelTransaction'],
							};
							tokens = o.devices.iOS;
							apns.push_Drivers(pushContents,tokens,function(e, o) {
					            if (e) {
					                retdata.msg = e;
									res.send(retdata, 400);
					            } else {
					            	// update status for Client
					            	var usertype = 0;
									AM.findById(clientID,usertype,function(e, o) {
										if (e) {
											retdata.msg = e;
											res.send(retdata, 400);
										}	else {
											var Status = aigoDefine.status['online'];
											o.status = Status;
											o.transaction = "";
											AM.saveData(o,usertype,function(e, o) {
												if (e) {
									                retdata.msg = e;
													res.send(retdata, 400);
												} else {
													retdata = o;
													retdata.msg = 'ok';
													res.send(retdata, 200);
												}
											});
										}
									});
								}
							});
						}
					});		
				} else {
					retdata.msg = "Driver is not available.";
					res.send(retdata, 400);
				}
			});	


		} else {
			retdata.msg = "Can not cancel request";
			res.send(retdata, 400);
		}
	});
}

// Client Transaction request
exports.cancelTransactionClient = function(req, res) {
	var clientID = req.params.id;
	var driverID = req.body.driverid;
  
    var retdata = {};
    var usertype = 1;
	AM.findById(driverID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == aigoDefine.status['accepted'] || o.status == aigoDefine.status['arrival']) {
			var Status = aigoDefine.status['online'];
			o.status = Status;
			o.transaction = "";
			AM.saveData(o,usertype,function(e, o) {
			//AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					var pushContents = {};
					pushContents.alert = "Client cancel transaction";
					pushContents.payload = {
						'clientid':clientID,
						'type':aigoDefine.notificationType['cancelTransaction'],
					};
					tokens = o.devices.iOS;
					apns.push_Drivers(pushContents,tokens,function(e, o) {
			            if (e) {
			                retdata.msg = e;
							res.send(retdata, 400);
			            } else {
			            	// update status for Client
			            	var usertype = 0;
							AM.findById(clientID,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									var Status = aigoDefine.status['online'];
									o.status = Status;
									o.transaction = "";
									AM.saveData(o,usertype,function(e, o) {
										if (e) {
							                retdata.msg = e;
											res.send(retdata, 400);
										} else {
											retdata = o;
											retdata.msg = 'ok';
											res.send(retdata, 200);
										}
									});
								}
							});
						}
					});
				}
			});		
		} else {
			retdata.msg = "Driver is not available.";
			res.send(retdata, 400);
		}
	});	
}

// Driver cancel transaction
exports.cancelTransactionDriver = function(req, res) {

	var driverID = req.params.id;
	var clientID = req.body.clientid;
  
    var retdata = {};
    var usertype = 0;
	AM.findById(clientID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == aigoDefine.status['accepted'] || o.status == aigoDefine.status['arrival'] ) {
			var Status = aigoDefine.status['online'];
			o.status = Status;
			o.transaction = "";
			AM.saveData(o,usertype,function(e, o) {
			//AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					var pushContents = {};
					pushContents.alert = "Driver cancel transaction";
					pushContents.payload = {
						'driverid':driverID,
						'type':aigoDefine.notificationType['cancelTransaction'],
					};
					tokens = o.devices.iOS;
					apns.push_Clients(pushContents,tokens,function(e, o) {
			            if (e) {
			                retdata.msg = e;
							res.send(retdata, 400);
			            } else {
			            	// update status for Driver
			            	var usertype = 1;
							AM.findById(driverID,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									var Status = aigoDefine.status['online'];
									o.status = Status;
									o.transaction = "";
									AM.saveData(o,usertype,function(e, o) {
										if (e) {
							                retdata.msg = e;
											res.send(retdata, 400);
										} else {
											retdata = o;
											retdata.msg = 'ok';
											res.send(retdata, 200);
										}
									});
								}
							});
						}
					});
				}
			});		
		} else {
			retdata.msg = "Client is not available.";
			res.send(retdata, 400);
		}
	});	
}

// Driver accept request from client:
//   1) Send notification to client
//   2) Update status of driver = 3
//	 3) update status of driver = 3
//   4) Add driver_ID to transaction of Client
exports.acceptRequestDriver = function(req, res) {

	var driverID = req.params.id;
	var clientID = req.body.clientid;
    //var number = req.body.number;
    //var conditions = req.body.conditions;
  
    var retdata = {};
    var usertype = 0;
	AM.findById(clientID,usertype,function(e, o) {
		//console.log("client info" + JSON.stringify(o));
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == aigoDefine.status['requesting']) {
			var Status = aigoDefine.status['accepted'];
			o.status = Status;
			o.transaction = driverID;
			AM.saveData(o,usertype,function(e, o) {
			//AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					var pushContents = {};
					pushContents.alert = "Driver accept transaction";
					pushContents.payload = {
						'driverid':driverID,
						'type':aigoDefine.notificationType['acceptClient'],
					};
					tokens = o.devices.iOS;
					apns.push_Clients(pushContents,tokens,function(e, o) {
			            if (e) {
			                retdata.msg = e;
							res.send(retdata, 400);
			            } else {
			            	// update status for Driver
			            	var usertype = 1;
							AM.findById(driverID,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									var Status = aigoDefine.status['accepted'];
									o.status = Status;
									o.transaction = clientID;
									AM.saveData(o,usertype,function(e, o) {
										if (e) {
							                retdata.msg = e;
											res.send(retdata, 400);
										} else {
											retdata = o;
											retdata.msg = 'ok';
											res.send(retdata, 200);
										}
									});
								}
							});
						}
					});
				}
			});		
		} else {
			retdata.msg = "Client is not available. Other driver picked up";
			res.send(retdata, 400);
		}
	});	
}

// Driver notification arrival
exports.arrivalNotification = function(req, res) {

	var driverID = req.params.id;
	var clientID = req.body.clientid;
  
    var retdata = {};
    var usertype = 0;
	AM.findById(clientID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == aigoDefine.status['accepted']) {
			var Status = aigoDefine.status['arrival'];
			o.status = Status;
			o.transaction = driverID;
			AM.saveData(o,usertype,function(e, o) {
			//AM.updateStatus(id,Status,usertype,function(e, o) {
				if (e) {
					retdata.msg = e;
					res.send(retdata, 400);
				}	else {
					var pushContents = {};
					pushContents.alert = "Driver arrival notification";
					pushContents.payload = {
						'driverid':driverID,
						'type':aigoDefine.notificationType['arrivalClient'],
					};
					tokens = o.devices.iOS;
					apns.push_Clients(pushContents,tokens,function(e, o) {
			            if (e) {
			                retdata.msg = e;
							res.send(retdata, 400);
			            } else {
			            	// update status for Driver
			            	var usertype = 1;
							AM.findById(driverID,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									var Status = aigoDefine.status['arrival'];
									o.status = Status;
									o.transaction = clientID;
									AM.saveData(o,usertype,function(e, o) {
										if (e) {
							                retdata.msg = e;
											res.send(retdata, 400);
										} else {
											retdata = o;
											retdata.msg = 'ok';
											res.send(retdata, 200);
										}
									});
								}
							});
						}
					});
				}
			});		
		} else {
			retdata.msg = "Client is not available.";
			res.send(retdata, 400);
		}
	});	
}

// Driver begin trip
exports.beginTripDriver = function(req, res) {

	var driverID = req.params.id;
	var clientID = req.body.clientid;
    
    var retdata = {};
    var usertype = 0;
    var Status = aigoDefine.status['pickedUp'];
    AM.findById(clientID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == aigoDefine.status['accepted'] || o.status == aigoDefine.status['arrival']) {
			o.status = Status;
			AM.saveData(o,usertype,function(e, o) {
				if (e) {
	                retdata.msg = e;
					res.send(retdata, 400);
				} else {
					// update status for Driver
	            	var usertype = 1;
					AM.findById(driverID,usertype,function(e, o) {
						if (e) {
							retdata.msg = e;
							res.send(retdata, 400);
						}	else {
							var Status = aigoDefine.status['pickedUp'];
							o.status = Status;
							AM.saveData(o,usertype,function(e, o) {
								if (e) {
					                retdata.msg = e;
									res.send(retdata, 400);
								} else {
									retdata = o;
									retdata.msg = 'ok';
									res.send(retdata, 200);
								}
							});
						}
					});
				}
			});
		} else {
			retdata.msg = "Can not begin trip. Client Status = " + o.status;
			res.send(retdata, 400);
		}
	});
}


// Driver begin trip + billing
exports.finishTripDriver = function(req, res) {

	var driverID = req.params.id;
	var clientID = req.body.clientid;
	var price = req.body.price;
    
    var retdata = {};
    var usertype = 0;
    var Status = aigoDefine.status['finished'];
    AM.findById(clientID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == aigoDefine.status['pickedUp']){
			o.status = Status;
			o.price = price;
			AM.saveData(o,usertype,function(e, o) {
				if (e) {
	                retdata.msg = e;
					res.send(retdata, 400);
				} else {
					var pushContents = {};
					pushContents.alert = "Driver billing notification";
					pushContents.payload = {
						'driverid':driverID,
						'type':aigoDefine.notificationType['billing'],
						'price':price,
					};
					tokens = o.devices.iOS;
					apns.push_Clients(pushContents,tokens,function(e, o) {
			            if (e) {
			                retdata.msg = e;
							res.send(retdata, 400);
			            } else {
			            	// update status for Driver
			            	var usertype = 1;
							AM.findById(driverID,usertype,function(e, o) {
								if (e) {
									retdata.msg = e;
									res.send(retdata, 400);
								}	else {
									var Status = aigoDefine.status['finished'];
									o.status = Status;
									o.price = price;
									AM.saveData(o,usertype,function(e, o) {
										if (e) {
							                retdata.msg = e;
											res.send(retdata, 400);
										} else {
											retdata = o;
											retdata.msg = 'ok';
											res.send(retdata, 200);
										}
									});
								}
							});
						}
					});
				}
			});
		} else {
			retdata.msg = "Can not finish trip. Client Status = " + o.status;
			res.send(retdata, 400);
		}
	});
}

// Client confirm bill and close transaction
exports.confirmBillClient = function(req, res) {

	var clientID = req.params.id;
	var driverID = req.body.driverid;
	var price = req.body.price;
    
 	//console.log("xxxxxxxxx:" +bill);
    
    var retdata = {};
    var usertype = 1;
    var Status = aigoDefine.status['online'];
    AM.findById(driverID,usertype,function(e, o) {
		if (e) {
			retdata.msg = e;
			res.send(retdata, 400);
		}	else if (o.status == aigoDefine.status['finished']) {
			o.status = Status;
			AM.saveData(o,usertype,function(e, o) {
				if (e) {
	                retdata.msg = e;
					res.send(retdata, 400);
				} else {
					// update status for Driver
	            	var usertype = 0;
					AM.findById(clientID,usertype,function(e, o) {
						if (e) {
							retdata.msg = e;
							res.send(retdata, 400);
						}	else {
							var Status = aigoDefine.status['online'];
							o.status = Status;
							AM.saveData(o,usertype,function(e, o) {
								if (e) {
					                retdata.msg = e;
									res.send(retdata, 400);
								} else {
									retdata = o;
									retdata.msg = 'ok';
									res.send(retdata, 200);
								}
							});
						}
					});
				}
			});
		} else {
			retdata.msg = "Can not confirm bill. Driver Status = " + o.status;
			res.send(retdata, 400);
		}
	});
}
