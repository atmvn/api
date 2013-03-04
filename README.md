taxiapi
=======

State machine:

exports.status = {
	'offline': "0",
	'online': "1",
	'requesting': "2",
	'accepted': "3",
	'arrival': "4",
	'pickedUp': "5",
	'finished': "6",
};

exports.notificationType = {
	'requestDriver': "1",
	'acceptClient':  "2",
	'cancelTransaction': "3",
	'cancelRequest': "4",
	'arrivalClient': "5",
	'billing': "6",
};

api for taxi:

0) delete account
 - Driver: 
 	curl -i -X POST -H 'Content-Type: application/json' -d'{}' http://localhost:3001/accounts/driver/delete/50d7c0b7dc9db30000000001
 - Client: 
 	curl -i -X POST -H 'Content-Type: application/json' -d'{}' http://localhost:3001/accounts/client/delete/50d7c0b7dc9db30000000001

1) sign up
 - Driver: 
 	curl -i -X POST -H 'Content-Type: application/json' -d'{"name":"drive01","email":"test@aigo.com","user":"driver01","pass":"123456","country":"VN"}' http://localhost:3001/accounts/driver/signup

 - Client:
 	curl -i -X POST -H 'Content-Type: application/json' -d'{"name":"client01","email":"test@aigo.com","user":"client01","pass":"123456","country":"VN"}' http://localhost:3001/accounts/client/signup

2) get all accounts
 - Driver: 
 	http://localhost:3001/accounts/driver

 - Client:
 	http://localhost:3001/accounts/client

3) login
 - Driver:
	curl -X POST -H 'Content-Type: application/json' -d'{"user":"driver01", "ass":"123456" ,"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590"}' http://localhost:3001/accounts/driver/login

 - Client:
	curl -X POST -H 'Content-Type: application/json' -d'{"user":"client01", "pass":"123456","devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592"}' http://localhost:3001/accounts/client/login

4) logout
 - Driver:
 	curl -X POST -H 'Content-Type: application/json' -d'{"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592"}' http://localhost:3001/accounts/driver/logout/50d7c0b7dc9db30000000001

 - Client:
	curl -X POST -H 'Content-Type: application/json' -d'{"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592"}' http://localhost:3001/accounts/driver/logout/50d7c10fdc9db30000000002

5) get account info
 - Driver: 
 	http://localhost:3001/accounts/driver/50d7c0b7dc9db30000000001
 - Client: 
 	http://localhost:3001/accounts/client/50d7c10fdc9db30000000002


6) update location:
 - Driver: 
	curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [106.6386,10.827257] }' http://localhost:3001/accounts/driver/location/50d7c0b7dc9db30000000001

	curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : "106.6386,10.827257" }' http://localhost:3001/accounts/driver/location/50d7c0b7dc9db30000000001

 - Client: 
	curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [106.6386,11.827257] }' http://localhost:3001/accounts/client/location/50d7c10fdc9db30000000002

	curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : "106.6386,11.827257" }' http://localhost:3001/accounts/client/location/50d7c10fdc9db30000000002

7) update status
 - Driver: 
	curl -i -X POST -H 'Content-Type: application/json' -d'{"status":"1"}' http://localhost:3001/accounts/driver/status/50d7c0b7dc9db30000000001

 - Client: 	
 	curl -i -X POST -H 'Content-Type: application/json' -d'{"status":"1"}' http://localhost:3001/accounts/client/status/50d7c10fdc9db30000000002

8) update setting info
 - Driver: 
	curl -X POST -H 'Content-Type: application/json' -d'{"user":"driver01", "pass":"123456","seat":"8" }' http://localhost:3001/accounts/driver/info

 - Client: 
	curl -X POST -H 'Content-Type: application/json' -d'{"user":"client01", "pass":"123456","seat":"8" }' http://localhost:3001/accounts/client/info

9) rating
 - Driver: 
	curl -X POST -H 'Content-Type: application/json' -d'{"like":"0"}' http://localhost:3001/accounts/driver/rating/50d7c0b7dc9db30000000001

 - Client: 
	curl -X POST -H 'Content-Type: application/json' -d'{"like":"1"}' http://ocalhost:3001/accounts/client/rating/50d7c10fdc9db30000000002

10) Add device token
 - Driver: 
	curl -X POST -H 'Content-Type: application/json' -d'{"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592"}' http://localhost:3001/accounts/driver/adddevicetoken/50d7c0b7dc9db30000000001

 - Client: 
 	curl -X POST -H 'Content-Type: application/json' -d'{"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592"}' http://localhost:3001/accounts/client/adddevicetoken/50d7c10fdc9db30000000002

11) delete device token
 - Driver: 
	curl -X POST -H 'Content-Type: application/json' -d'{"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592"}' http://localhost:3001/accounts/driver/deletedevicetoken/50d7c0b7dc9db30000000001

 - Client: 
	curl -X POST -H 'Content-Type: application/json' -d'{"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592"}' http://localhost:3001/accounts/client/deletedevicetoken/50d7c10fdc9db30000000002

12) update device token
 - Driver: 
	curl -X POST -H 'Content-Type: application/json' -d'{"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b591","olddevicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592"}' http://localhost:3001/accounts/driver/updatedevicetoken/50d7c0b7dc9db30000000001

 - Client: 
 	curl -X POST -H 'Content-Type: application/json' -d'{"devicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b592","olddevicetoken":"aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b591"}' http://localhost:3001/accounts/client/updatedevicetoken/50d7c10fdc9db30000000002

13) Find closest Driver/Client
 - Driver: 
 	curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [ 106.63896,10.827257 ],"number":"10"}' http://localhost:3001/locations/driver/distance

 	 curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : "106.63896,10.827257" ,"number":"10"}' http://localhost:3001/locations/driver/distance

 - Client: 
 	curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : [ 106.6386,10.827257 ],"number":"10"}' http://localhost:3001/locations/client/distance

 	curl -i -X POST -H 'Content-Type: application/json' -d'{"loc" : "106.6386,10.827257","number":"10"}' http://localhost:3001/locations/client/distance

14) Find closest Driver/Client with account ID
 - Driver: 
	curl -i -X POST -H 'Content-Type: application/json' -d'{"number":"10"}' http://localhost:3001/locations/driver/distance/50d7c0b7dc9db30000000001

 - Client: Seat = 4,8 or 0 (all)
 	curl -i -X POST -H 'Content-Type: application/json' -d'{"number":"10","set":"8"}' http://localhost:3001/locations/client/distance/50d81382b951badb10000001

old: 
	15) Request taxi
	 - Client: 
	 	curl -X POST  -H 'Content-Type: application/json' -d'{"alert" : { "body" : "Bob wants to play poker", "action-loc-key" : "Reject" },"badge":"0"}' http://localhost:3001/apns/requesttaxi/50d7c0b7dc9db30000000001
		
	16) Respond accept to client
	 - Driver: 
	 	curl -X POST  -H 'Content-Type: application/json' -d'{"alert" : { "body" : "Got taxi", "action-loc-key" : "Reject" },"badge":"0"}' http://localhost:3001/apns/respondclient/50d7c10fdc9db30000000002

	17) Arrival notification:
	 - Driver: 
	 	curl -X POST  -H 'Content-Type: application/json' -d'{"alert" : { "body" : "Arrival notification", "action-loc-key" : "Reject" },"badge":"0"}' http://localhost:3001/apns/arrivalnotify/50d7c10fdc9db30000000002	

new: 
	15) Request taxi
	 - Client: 
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{}' http://localhost:3001/transactions/client/request/50d81382b951badb10000001
		
	16) Respond accept to client
	 - Driver: 
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{"clientid":"50d81382b951badb10000001"}' http://localhost:3001/transactions/driver/accept/50d83872e739b0dd1a000004

	17) Driver cancel transaction:
	 - Driver: 
		curl -i -X POST -H 'Content-Type: application/json' -d'{"clientid":"50d81382b951badb10000001"}' http://localhost:3001/transactions/driver/cancel/50d83872e739b0dd1a000004

	18) Client cancel transaction after driver accept:
	 - Client: 
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{"driverid":"50d83872e739b0dd1a000004"}' http://localhost:3001/transactions/client/canceltransaction/50d81382b951badb10000001

	19) Client cancel requeset before driver accept, if find driver accepted then send notification cancel transaction to driver:
	 - Client:
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{}' http://localhost:3001/transactions/client/cancelrequest/50d81382b951badb10000001
		
	20) Arrival notification
	 - Driver: 
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{"clientid":"50d8182b951badb10000001"}' http://localhost:3001/transactions/driver/arrival/50d83872e739b0dd1a000004

	21) Begin the trip
	 - Driver: 
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{"clientid":"50d8182b951badb10000001"}' http://localhost:3001/transactions/driver/begintrip/50d83872e739b0dd1a000004

	22) Finish the trip -> send build notification to client
	 - Driver: 
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{"clientid":"50d81382b951badb10000001","price":"100.000"}' http://localhost:3001/transactions/driver/finishtrip/50d83872e739b0dd1a000004
	
	23) Confirm bill
	 - Client: 
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{"driverid":"50d8372e739b0dd1a000004","price":"100.000"}' http://localhost:3001/transactions/client/confirmbill/50d81382b951badb10000001

	24) Request this taxi
	 - Client: 
	 	curl -i -X POST -H 'Content-Type: application/json' -d'{"driverid":"50d7c0b7dc9db3000000001"}' http://localhost:3001/transactions/client/requestthisdriver/50d81382b951badb10000001


	 		






