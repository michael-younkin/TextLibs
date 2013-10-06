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

var blanks = [
  "Misspelled version of real word, ending in -ly or -io",
  "Verb",
  "Plural Noun",
  "Minor Celebrity",
  "Gentrified Neighborhood",
  "Obscure Ethnicity",
  "Noun",
  "Verb ending in -ate",
  "Trivial stuff you like",
  "Social media profile no one reads)",
  "Gerund starting with \"crowd\"",
  "Failing Industry",
  "Verb that Implies Creativity",
  "Noun form of Verb Ending in -ate",
  "Boring Daily Task",
  "Unmanageable thing",
  "Adjective",
  "Slightly Intimidating Acronym",
  "Previous Startup with Record-Breaking IPO",
  "First-World Problem",
  "Euphemistic Gerund",
  "Verb Involving Face-to-Face Interaction with Humans",
  "Data No One Needs to Keep Track of Except Advertisers",
  "Invasive, Data-Mining GPS-Based Service",
  "Serious Verb",
  "Fun Verb",
  "Verb form of Startup Name"
];
var libs = {};
var pendingNumbers = {};
var participants = [];

app.configure(function() {
  app.use(express.bodyParser());
});

app.post('/incomingcall', function(req, res) {
	console.log('received incoming call');
});

app.post('/incomingtext', function(req, res) {
  console.log('received incoming text');
  var incomingNumber = req.body.From;
  if (pendingNumbers[incomingNumber]) {
    handleInsertion(incomingNumber, req.body.Body, function(err) {
      if (err) {
        throw err;
      }
    });
  } else if (getNumMissingLibs() > 0) {
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
  if (_.keys(libs).length === _.keys(blanks).length) {
    console.log('mad lib complete');
    console.dir(libs);
    var madlib = printTextLib();
    console.log(madlib);
    _.each(participants, function(number) {
      sendSMS(number, madlib, function(err) {
        if (err) {
          console.err('Failed to send madlib');
        }
      });
    });
    libs = {};
  } else {
    console.log('mad lib incomplete');
    console.log(printTextLib());
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
  console.log('Insert ' + contents + ' from ' + incomingNumber);
  var index = pendingNumbers[incomingNumber];
  console.log('Inserted lib for index ' + index);
  pendingNumbers[incomingNumber] = undefined;
  libs[index] = contents;
  sendSMS(incomingNumber, 'Thanks! Send another message to answer again.', function() {});
  participants.push(incomingNumber);
  participants = _.uniq(participants);
  callback();
}

function requestLib(incomingNumber, callback) {
  var missingLib = getMissingLib();
  pendingNumbers[incomingNumber] = missingLib;
  var neededValue = blanks[missingLib];
  sendSMS(incomingNumber, 'Please send us a "' + neededValue + '"', function(err) {
    if (err) {
      pendingNumbers[incomingNumber] = undefined;
      callback(err);
    } else {
      callback();
    }
  });
  setTimeout(function() {
    if (pendingNumbers[incomingNumber]) {
      sendSMS(
        incomingNumber,
        'Too slow, send another message to start over',
        function (err) { 
          if (err) {
            console.error('Error ocurred while sending SMS');
            throw err; 
          }
        }
      );
      pendingNumbers[incomingNumber] = undefined;
    } else {
      console.log('timeout complete');
    }
  }, config.game.requestTimeout);
}

function getNumMissingLibs() {
  return blanks.length - _.keys(libs).length;
}

function getMissingLib() {
  if (getNumMissingLibs === 0) {
    throw new Error('No missing libs found');
  } else {
    var missingLib = undefined;
    _.each(_.keys(blanks), function(index) {
      if (missingLib) {
        return;
      }
      if (!libs[index] &&  !_.contains(_.values(pendingNumbers), index)) {
        missingLib = index;
      }
    });
    return missingLib;
  }
}

function printTextLib() {
	var story = "Your startup name: " +
	libs[0] +
	". Have you ever wanted to " +
	libs[1] +
	" all sorts of " +
	libs[2] +
	" with friends, family, colleagues, or even " +
	libs[3] +
	", but didn't know how? Maybe you were just strolling the sidewalks of " +
	libs[4] +
	" past your favorite " +
	libs[5] +
	" bakery when you wished you could pull out your i" +
	libs[6] +
	" and use it to quickly " +
	libs[7] +
	" all your latest " +
	libs[8] +
	" and post it to your " +
	libs[9] +
	"? " +
	libs[0] +
	" is the answer. The fact is, we live in a world where " +
	libs[10] +
	" will revolutionize " +
	libs[11] +
	", and pretty soon you'll be able to " +
	libs[12] +
	" anything you want through the cloud. All this " +
	libs[13] +
	" is already changing the way we " +
	libs[14] +
	", but who has the tools to keep up with it? " +
	libs[0] +
	" is that tool. With our beautiful, user-friendly interface, you'll find that managing all your " +
	libs[15] +
	" is easier than ever-and " +
	libs[16] +
	"! Utilizing the power of " +
	libs[17] +
	" services with all the connectivity of " +
	libs[18] +
	", we can help you free yourself from tyranny of " +
	libs[19] +
	". In this rapidly " +
	libs[20] +
	" world of ours, it's hard to find the time to " +
	libs[21] +
	" or keep track of all the " +
	libs[22] +
	". " +
	libs[0] +
	" changes that. It puts the power of " +
	libs[23] +
	" at your fingertips. " +
	libs[24] +
	". " +
	libs[25] +
	". " +
	libs[26] +
	".";
	return story;
}

app.listen(config.web.port);
console.log('Listening on port ' + config.web.port);
