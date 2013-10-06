#!/usr/bin/env node

var twilio = require('twilio');
var config = require('./config');
var _ = require('lodash');
var express = require('express');
var madlib = require('./madlib');

var app = express(); 

// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient(
  config.twilio.sid,
  config.twilio.auth
);

var currentMadlib;

var activeNumbers = {};

function activateNumber(number, wordIndex) {
  activeNumbers[number] = wordIndex;
}

function deactivateNumber(number) {
  console.log('deactivate ' + number);
  delete activeNumbers[number];
}

function saveWord(number, index, word, callback) {
  console.log('saving ' + word + ' to ' + index);
  currentMadlib.blanks[index] = word;
  callback(null);
}

function onMadlibComplete() {
  var madlibText = currentMadlib.getFullText();
  console.log('madlib completed');
  console.log(madlibText);
  var madlibParts = splitMadlib(madlibText);
  _.each(currentMadlib.getParticipants(), function(number) {
    _.each(madlibParts, function(part) {
      sendSMS(number, part, function(err) {
        if (err) {
          console.error(err);
        }
      });
    });
  });
  resetMadlib(function(err) {
    if (err) {
      throw err;
    }
  });
}

function blankIsAvailable() {
  var numActiveBlanks = _.values(activeNumbers).length
  console.log('num active blanks: ' + numActiveBlanks);
  var numUnfilledBlanks = currentMadlib.getNumUnfilledBlanks();
  return currentMadlib.getNumUnfilledBlanks() - numActiveBlanks;
}

function getAvailableBlank() {
  var blanks = currentMadlib.getUnfilledBlanks();
  console.log('unfilled blanks');
  console.log(blanks);
  var availableBlanks = [];
  _.each(blanks, function(blankIndex) {
    if (!_.contains(_.values(activeNumbers), blankIndex)) {
      console.log(blankIndex + ' is not in activeNumbers and is available');
      availableBlanks.push(blankIndex);
    }
  });
  return availableBlanks[0];
}

function resetMadlib(callback) {
  madlib.getMadLib(function(err, a) {
    if (err) {
      callback(err);
      return;
    }
    currentMadlib = a;
    callback(null, a);
  });
}

app.configure(function() {
  app.use(express.bodyParser());
});

app.post('/incomingcall', function(req, res) {
	console.log('received incoming call from "' + req.body.From + '"');
  var resp = new twilio.TwimlResponse();
  resp.say({voice:'woman'}, 'Calls are not accepted. Please send a text.');
  res.writeHead(200, {
  'Content-Type':'text/xml'
  });
  res.end(resp.toString());
});

app.post('/incomingtext', function(req, res) {
  var incomingNumber = req.body.From;
  var incomingMsg = req.body.Body;
  console.log('received "' + incomingMsg + '" from "' + incomingNumber + '"');

  function handleError(err) {
    if (err) {
      console.error(err);
    }
  }

  if (incomingMsg === '_CALL_') {
    // TODO call them with a completed madlib
  } else if (numberIsActive(incomingNumber)) {
    // The number was pending, so we were waiting on it to get a word for our
    // madlib.
    saveWord(incomingNumber, activeNumbers[incomingNumber], incomingMsg, handleError);
    deactivateNumber(incomingNumber);

    if (!currentMadlib.getNumUnfilledBlanks()) {
      onMadlibComplete();
    }
  } else if (incomingMsg === '_ML_') {
    if (blankIsAvailable()) {
      var blankIndex = getAvailableBlank();
      console.log('Selected blank at ' + blankIndex);
      currentMadlib.addParticipant(incomingNumber);
      activateNumber(incomingNumber, blankIndex);
      sendSMS(
        incomingNumber,
        'Send us "' + currentMadlib.words[blankIndex].value + '"', 
        handleError
      );
    } else {
      sendSMS(
        incomingNumber,
        'No blanks are currently available, please try again later.',
        handleError
      );
    }
  } else {
    sendSMS(
      incomingNumber,
      'This is TextLibs: Massively Multiplayer Madlibs! Text _ML_ to ' +
        'participate in the current madlib we\'re trying to complete!',
      handleError
    );
  }
});

function sendSMS(number, msg, callback) {
  client.sendSms({
    to: number,
    from: config.twilio.number,
    body: msg
  }, callback);
}

resetMadlib(function(err) {
  if (err) {
    throw err;
  }
});

function numberIsActive(number) {
  return !!activeNumbers[number];
}

function splitMadlib(text) {
  var parts = [];
  while (text.length > 160) {
    parts.push(text.substring(text.length - 161));
    text = text.substring(0, text.length - 161);
  }
  parts.push(text);
  return parts.reverse();
}

app.listen(config.web.port);
console.log('Listening on port ' + config.web.port);
