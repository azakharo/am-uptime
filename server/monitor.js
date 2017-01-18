'use strict';

var request = require("request");
var _ = require("lodash");
var ping = require('ping');

const URL_PROCESSING = 'http://127.0.0.1:4000';
const SUBURL_DETECTOR_REGISTRY = '/registry';

global.detectors = [];

exports.monitor = function() {

  if (!global.detectors || global.detectors.length == 0) {
    request({
        url: URL_PROCESSING + SUBURL_DETECTOR_REGISTRY,
        json: true
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
          return;
        }
        global.detectors = body;
        console.log(global.detectors);
      });
    return;
  }

  getDetectorStatuses();
};

function getDetectorStatuses() {
  if (!global.detectors || global.detectors.length == 0) {
    return;
  }

  _.forEach(global.detectors, function (detector) {
    ping.sys.probe(detector.ip, function(isAlive){
      detector.isAlive = isAlive;
    });
  });

}
