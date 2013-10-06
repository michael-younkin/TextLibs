#!/usr/bin/env node

var twilio = require('twilio');
var config = require('./config');
var _ = require('lodash');
var express = require('express');
var app = express(); 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient(
  config.twilio.sid,
  config.twilio.auth
);

var pendingLibs = {};
var results = [];

app.configure(function() {
  app.use(express.bodyParser());
});

app.post('/incomingcall', function(req, res) {
	console.log('received incoming call');
});

app.post('/incomingtext', function(req, res) {
  console.log('received incoming text');
  var incomingNumber = req.body.From;
  if (pendingLibs[incomingNumber]) {
    handleInsertion(incomingNumber, req.body.Body, function(err) {
      if (err) {
        throw err;
      }
    });
  } else if (libsAreRemaining()) {
    requestLib(incomingNumber, function(err) {
      if (err) {
        throw err;
      }
    });
  } else {
    sendSMS(
      incomingNumber,
      'All libs are taken, please try again in a few  minutes.',
      function(err) {
        if (err) {
          throw err;
        }
      }
    );
  }
});

function libsAreRemaining() {
  return true;
}

function sendSMS(number, msg, callback) {
  client.sendSms({
    to: number,
    from: config.twilio.number,
    body: msg
  }, callback);
}

function handleInsertion(incomingNumber, contents, callback) {
  results.push(contents);
  console.log('Current libs');
  console.dir(results);
  pendingLibs[incomingNumber] = undefined;
  callback();
}

function requestLib(incomingNumber, callback) {
  sendSMS(incomingNumber, 'Please send us a noun.', function(err) {
    pendingLibs[incomingNumber] = 'noun';
    callback(err);
  });
}

app.listen(config.web.port);
console.log('Listening on port ' + config.web.port);
