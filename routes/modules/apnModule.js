//var express = require('express'),
    //account = require('./routes/account');
var AM = require('../modules/accountModule');;

var apns = require('apn');


var options_Driver = {
    cert: './routes/certificates/AIGO_Driver_Dev1_development.pem',                 /* Certificate file path */
    certData: null,                   /* String or Buffer containing certificate data, if supplied uses this instead of cert file path */
    key:  './routes/certificates/AIGO_key.pem',                  /* Key file path */
    keyData: null,                    /* String or Buffer containing key data, as certData */
    passphrase: 'aigo@123',                 /* A passphrase for the Key file */
    ca: null,                         /* String or Buffer of CA data to use for the TLS connection */
    gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    port: 2195,                       /* gateway port */
    enhanced: true,                   /* enable enhanced format */
    errorCallback: undefined,         /* Callback when error occurs function(err,notification) */
    cacheLength: 100                  /* Number of notifications to cache for error purposes */
};

var options_Client = {
    cert: './routes/certificates/AIGO_Client_Dev1_development.pem',                 /* Certificate file path */
    certData: null,                   /* String or Buffer containing certificate data, if supplied uses this instead of cert file path */
    key:  './routes/certificates/AIGO_key.pem',                  /* Key file path */
    keyData: null,                    /* String or Buffer containing key data, as certData */
    passphrase: 'aigo@123',                 /* A passphrase for the Key file */
    ca: null,                         /* String or Buffer of CA data to use for the TLS connection */
    gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    port: 2195,                       /* gateway port */
    enhanced: true,                   /* enable enhanced format */
    errorCallback: undefined,         /* Callback when error occurs function(err,notification) */
    cacheLength: 100                  /* Number of notifications to cache for error purposes */
};

var apnsConnection_Driver = new apns.Connection(options_Driver);
var apnsConnection_Client = new apns.Connection(options_Client);

var APNM = {}; 

module.exports = APNM;

APNM.push_Driver = function(req, token, callback)
{
    var note = new apns.Notification();

    console.log(JSON.stringify(req) + req.badge);

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    if (req.badge == null) {
       note.badge = 1;
    } else {
        note.badge = req.badge;   
    }
    if (req.sound == null) {
       note.sound = "ping.aiff";
    } else {
        note.sound = req.sound;   
    }
    if (req.alert == null) {
       note.alert = "You have a new message";
    } else {
        note.alert = req.alert;
    }
    if (req.payload == null) {
       note.payload = {'messageFrom': 'Caroline'};
    } else {
        note.payload = req.payload;   
    }
    //note.payload = {'messageFrom': 'Caroline'};
    //var token = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';
    //if (req.token == null) {
    //} else {
    //    token = req.token; 
    //}
    //console.log('xxxxxxxxxxxxxxxxxxxx:' + token);
    var device = new apns.Device(token);
    note.device = device;   
    //note.device = myDevice;

    apnsConnection_Driver.sendNotification(note);
    callback(null,note);
};

APNM.push_Drivers = function(req, tokens, callback) 
{
    var note = new apns.Notification();

    console.log(JSON.stringify(req) + req.badge);

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    if (req.badge == null || typeof(req.badge) == undefined) {
       note.badge = 1;
    } else {
        note.badge = req.badge;   
    }
    if (req.sound == null || typeof(req.sound) == undefined) {
       note.sound = "ping.aiff";
    } else {
        note.sound = req.sound;   
    }
    if (req.alert == null || typeof(req.alert) == undefined) {
       note.alert = "You have a new message";
    } else {
        note.alert = req.alert;
    }
    if (req.payload == null || typeof(req.payload) == undefined) {
       note.payload = {'messageFrom': 'Client'};
    } else {
        note.payload = req.payload;   
    }
    //note.payload = {'messageFrom': 'Caroline'};
    //var token = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';
    //if (req.token == null) {
    //} else {
    //    token = req.token; 
    //}
    //console.log('xxxxxxxxxxxxxxxxxxxx:' + token);
     // var device = new apns.Device(token);
     //  note.device = device;   
    //note.device = myDevice;

    for (var i = tokens.length - 1; i >= 0; i--) {
        var token = tokens[i];
        //console.log('xxxxxxxxxxxxxxxxxxxx:' + token);
        var device = new apns.Device(token);
        apnsConnection_Driver.sendNotification(note.clone(device));
    }

    //apnsConnection_Driver.sendNotification(note);
    callback(null,note);
};

APNM.pushInfo_Drivers = function(req, info, callback) 
{
    var note = new apns.Notification();

    console.log(JSON.stringify(req) + req.badge);

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    if (req.badge == null || typeof(req.badge) == undefined) {
       note.badge = 1;
    } else {
        note.badge = req.badge;   
    }
    if (req.sound == null || typeof(req.sound) == undefined) {
       note.sound = "ping.aiff";
    } else {
        note.sound = req.sound;   
    }
    if (req.alert == null || typeof(req.alert) == undefined) {
       note.alert = "You have a new message";
    } else {
        note.alert = req.alert;
    }
    if (req.payload == null || typeof(req.payload) == undefined) {
       note.payload = {'messageFrom': 'Client'};
    } else {
        note.payload = req.payload;   
    }


    //note.payload = {'messageFrom': 'Caroline'};
    //var token = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';
    //if (req.token == null) {
    //} else {
    //    token = req.token; 
    //}
    //console.log('xxxxxxxxxxxxxxxxxxxx:' + info);
     // var device = new apns.Device(token);
     //  note.device = device;   
    //note.device = myDevice;
    var tokens = info.devices;
    var alert = note.alert;
    for (var i = tokens.length - 1; i >= 0; i--) {
        var token = tokens[i];
        var dist = info.dist[token];
        dist = dist.toFixed(2);
        var duration = (dist/30)*60;
        duration.toFixed(2);
        note.alert = alert + ". Distance: " + dist + " kms. Estimate time: " + duration + " minutes.";
        note.payload.distance = dist;
        note.payload.duration = duration;
        console.log('xxxxxxxxxxxxxxxxxxxx:' + token + "dist:"  + note.alert + "payload:" + JSON.stringify(note.payload));
        var device = new apns.Device(token);
        apnsConnection_Driver.sendNotification(note.clone(device));
    }

    //apnsConnection_Driver.sendNotification(note);
    callback(null,note);
};

APNM.push_Client = function(req, token, callback) 
{
    var note = new apns.Notification();

    console.log(JSON.stringify(req) + req.badge);

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    if (req.badge == null) {
       note.badge = 1;
    } else {
        note.badge = req.badge;   
    }
    if (req.sound == null) {
       note.sound = "ping.aiff";
    } else {
        note.sound = req.sound;   
    }
    if (req.alert == null) {
       note.alert = "You have a new message";
    } else {
        note.alert = req.alert;
    }
    if (req.payload == null) {
       note.payload = {'messageFrom': 'Caroline'};
    } else {
        note.payload = req.payload;   
    }
    //note.payload = {'messageFrom': 'Caroline'};
    //var token = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';
    //if (req.token == null) {
    //} else {
    //    token = req.token; 
    //}
    //console.log('xxxxxxxxxxxxxxxxxxxx:' + token);
    var device = new apns.Device(token);
    note.device = device;   
    //note.device = myDevice;

    apnsConnection_Client.sendNotification(note);
    callback(null,note);
};

APNM.push_Clients = function(req, tokens, callback) 
{
    var note = new apns.Notification();

    console.log(JSON.stringify(req) + req.badge);

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    if (req.badge == null) {
       note.badge = 1;
    } else {
        note.badge = req.badge;   
    }
    if (req.sound == null) {
       note.sound = "ping.aiff";
    } else {
        note.sound = req.sound;   
    }
    if (req.alert == null) {
       note.alert = "You have a new message";
    } else {
        note.alert = req.alert;
    }
    if (req.payload == null) {
       note.payload = {'messageFrom': 'Caroline'};
    } else {
        note.payload = req.payload;   
    }
    //note.payload = {'messageFrom': 'Caroline'};
    //var token = 'aeace73a24a233cc75640cb2c72177d6542b51bfbd01e354b8a6f3ce59f0b590';
    //if (req.token == null) {
    //} else {
    //    token = req.token; 
    //}
    //console.log('xxxxxxxxxxxxxxxxxxxx:' + token);
    //var device = new apns.Device(token);
    //note.device = device;   
    //note.device = myDevice;

    for (var i = tokens.length - 1; i >= 0; i--) {
        var token = tokens[i];
        //console.log('xxxxxxxxxxxxxxxxxxxx:' + token);
        var device = new apns.Device(token);
        apnsConnection_Client.sendNotification(note.clone(device));
    }

    //apnsConnection_Client.sendNotification(note);
    callback(null,note);
};