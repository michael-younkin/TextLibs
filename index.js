#!/usr/bin/env node

var twilio = require('twilio');
var config = require('./config');
var _ = require('lodash');
var express = require('express');
var app = express();

// Create a new REST API client to make authenticated requests against the
// twilio back end
//var client = new twilio.RestClient(
//  config.twilio.sid,
//  config.twilio.auth
//);

app.get('/incomingcall', function(req, res) {
  var resp = new twilio.TwimlResponse();

  resp.say({voice: 'woman'}, 'Thank you for your call to team 42.');
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(resp.toString());
});

app.listen(config.web);
