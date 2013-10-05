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

var phase = 'signup';
var numbers = [];

app.configure(function() {
  app.use(express.bodyParser());
});

app.post('/incomingcall', function(req, res) {
	console.log('received incoming call');
  var resp = new twilio.TwimlResponse();
  if (phase === 'signup') {
    numbers.push(req.body.From);
    numbers = _.uniq(numbers);
    
    if (numbers.length === config.collectSize) {
      console.log('Signup completed');
      console.dir(numbers);
      phase = 'libs';
    }
    resp.say({voice: 'female'}, 'You have registered');
  } else if (phase === 'libs') {
    resp.say({voice: 'male'}, 'We have completed the signup phase.' + 
             ' Try again later');
  }
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(resp.toString());
});

app.post('/incomingtext', function(req, res) {
  console.log('received incoming text');
  res.send(200, '');
});

app.listen(config.web.port);
console.log('Listening on port ' + config.web.port);
