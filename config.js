var _ = require('lodash');

exports.twilio = {
  sid: process.env.TWILIO_SID,
  number: process.env.TWILIO_NUMBER,
  auth: process.env.TWILIO_AUTH
};

exports.web = {
  port: 80
};

exports.game = {
  requestTimeout: 60000
};

_.each(exports.twilio, function(value, key) {
  if (!value) {
    throw new Error('Missing config value: "' + key + '"');
  }
});
