var glob = require('glob');
var _ = require('lodash');
var fs = require('fs');

var config = require('./config');

exports.getMadLib = function(callback) {
  selectRandomMadLib(function(err, madlib) {
    if (err) {
      callback(err);
    } else {
      makeMadlib(madlib, callback);
    }
  });
};

function selectRandomMadLib(callback) {
  glob(config.game.madlibPath + '/*.madlib', function(err, files) {
    if (err) {
      callback(err);
    } else {
      callback(null, files[_.random(0, files.length - 1)]);
    }
  });
}

function makeMadlib(filename, callback) {
  var madlib = {
    "filename": filename
  };

  function onReadFile(err, data) {
    if (err) {
      callback(err);
      return;
    }
    data = ('' + data).replace(/\n/, '');
    madlib.data = data;
    madlib.words = getWords(data);
    madlib.blanks = {};
    madlib.participants = {};
    madlib.getFullText = function() {
      var text = '';
      _.each(madlib.words, function(word, index) {
        if (word.isBlank) {
          if (madlib.blanks[index]) {
            word = madlib.blanks[index];
          } else {
            word = 'BLANK'
          }
        }
      text += word + ' ';
      });
      text = text.replace(/\n| [?!.,]/, '');
      return text;
    };
    madlib.addParticipant = function(number) {
      madlib.participants[number] = true;
    };
    madlib.getParticipants = function() {
      return _.keys(madlib.participants);
    };
    madlib.getNumUnfilledBlanks = function() {
      var unfilledBlanks = madlib.getUnfilledBlanks();
      console.log('Num Unfilled Blanks: ' + unfilledBlanks.length);
      return unfilledBlanks.length;
    };
    madlib.getUnfilledBlanks = function() {
      var unfilledBlanks = [];
      _.each(madlib.words, function(word, index) {
        if (word.isBlank && !madlib.blanks[index]) {
          unfilledBlanks.push(index);
        }
      });
      console.log('Retrieved unfilled blanks:');
      console.dir(unfilledBlanks);
      return unfilledBlanks;
    };

    callback(null, madlib);
  }

  fs.readFile(filename, onReadFile);
}

function getWords(data) {
  var words = [];
  var inBlank = false;
  var blankDescription = '';
  _.each(('' + data).split(' '), function(word) {
    console.log('parsing "' + word + '"');
    if (inBlank) {
      if (word === '-->') {
        inBlank = false;
        words.push({
          value: blankDescription,
          isBlank: true
        });
        blankDescription = '';
      } else {
        blankDescription += word + ' ';
      }
    } else {
      if (word === '<!--') {
        inBlank = true;
      } else {
        words.push(word);
      }
    }
  });
  console.log('After parsing:');
  _.each(words, function(word) {
    console.log((word.value || word) + ':' + word.isBlank);
  });
  return words;
}
