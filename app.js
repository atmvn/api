var express = require('express'),
    //account = require('./routes/account');
    account = require('./routes/controllers/accountController');
    apns = require('./routes/controllers/apnController');
    transaction = require('./routes/controllers/transactionController');

var app = express.createServer();
//var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(require('connect').bodyParser());
});

//LOCATION
	//curl -i -X POST -H 'Content-Type: application/json' -d'{"longtitude" : "106.63896", "lattitude": "10.827257" ,"number":"10"}' http://localhost:3001/atm/distance
	app.post('/atm/distance', account.findByDistance);

// USER
	app.post('/accounts/driver/signup', account.signUpDriver);
	app.post('/accounts/client/signup', account.signUpClient);

	app.post('/accounts/driver/delete/:id', account.deleteDriver);
	app.post('/accounts/client/delete/:id', account.deleteClient);

	app.post('/accounts/driver/login', account.loginWithDeviceTokenDriver);
	app.post('/accounts/client/login', account.loginWithDeviceTokenClient);

	app.post('/accounts/driver/logout/:id', account.logoutWithDeviceTokenDriver);
	app.post('/accounts/client/logout/:id', account.logoutWithDeviceTokenClient);

	app.get('/accounts/driver', account.findAllDriver);
	app.get('/accounts/client', account.findAllClient);

	app.get('/accounts/driver/:id', account.findByIdDriver);
	app.get('/accounts/client/:id', account.findByIdClient);

	app.post('/accounts/driver/location/:id', account.updateLocationDriver);
	app.post('/accounts/client/location/:id', account.updateLocationClient);

	app.post('/accounts/driver/status/:id', account.updateStatusDriver);
	app.post('/accounts/client/status/:id', account.updateStatusClient);
	
	app.post('/accounts/driver/info', account.updateInfoDriver);
	app.post('/accounts/client/info', account.updateInfoClient);

	app.post('/accounts/driver/rating/:id', account.ratingDriver);
	app.post('/accounts/client/rating/:id', account.ratingClient);

	app.post('/accounts/driver/savelocation/add/:id', account.addLocationsDriver);
	app.post('/accounts/client/savelocation/add/:id', account.addLocationsClient);

	app.post('/accounts/driver/savelocation/delete/:id', account.deleteLocationsDriver);
	app.post('/accounts/client/savelocation/delete/:id', account.deleteLocationsClient);

	app.post('/accounts/driver/adddevicetoken/:id', account.addDeviceTokenDriver);
	app.post('/accounts/client/adddevicetoken/:id', account.addDeviceTokenClient);

	app.post('/accounts/driver/deletedevicetoken/:id', account.deleteDeviceTokenDriver);
	app.post('/accounts/client/deletedevicetoken/:id', account.deleteDeviceTokenClient);

	app.post('/accounts/driver/updatedevicetoken/:id', account.updateDeviceTokenDriver);
	app.post('/accounts/client/updatedevicetoken/:id', account.updateDeviceTokenClient);


//LOCATION
	app.post('/locations/driver/distance', account.findByDistanceDriver);
	app.post('/locations/client/distance', account.findByDistanceClient);

	app.post('/locations/driver/distance/:id', account.findByDistanceWithAccountIDDriver);
	app.post('/locations/client/distance/:id', account.findByDistanceWithAccountIDClient);

// APNS
	app.post('/apns/simplepush', apns.simplePush);
	app.post('/apns/requesttaxi/:id', apns.pushToDrivers);
	app.post('/apns/respondclient/:id', apns.pushToClients);
	app.post('/apns/arrivalnotify/:id', apns.pushToClients);
	
// TEST
	app.post('/test/:id', transaction.requestDrivers);

// TRANSACTON
	app.post('/transactions/client/requestthisdriver/:id', transaction.requestThisDriver);
	app.post('/transactions/client/request/:id', transaction.requestDrivers);
	app.post('/transactions/driver/accept/:id', transaction.acceptRequestDriver);
	app.post('/transactions/driver/cancel/:id', transaction.cancelTransactionDriver);
	app.post('/transactions/client/cancelrequest/:id', transaction.cancelRequestClient);
	app.post('/transactions/client/canceltransaction/:id', transaction.cancelTransactionClient);
	app.post('/transactions/driver/arrival/:id', transaction.arrivalNotification);
	app.post('/transactions/driver/begintrip/:id', transaction.beginTripDriver); 
	app.post('/transactions/driver/finishtrip/:id', transaction.finishTripDriver); 
	app.post('/transactions/client/confirmbill/:id', transaction.confirmBillClient);

//app.listen(3001);

app.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3001, function(){
	//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
	console.log('Listening on port 3001...');
});

//app.listen(process.env.PORT || process.env.VCAP_APP_PORT || 3001);
//console.log('Listening on port 3001...');