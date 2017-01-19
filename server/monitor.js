'use strict';

var request = require("request");
var _ = require("lodash");
var ping = require('ping');

const URL_PROCESSING = 'http://127.0.0.1:4000';
const SUBURL_DETECTOR_REGISTRY = '/registry';

global.detectors = [];

exports.monitor = function() {

  if (!global.detectors || global.detectors.length == 0) {
    getDetectorsCredentials(URL_PROCESSING + SUBURL_DETECTOR_REGISTRY, function (error, data) {
      if (error) {
        return;
      }
      global.detectors = data;
      //console.log("============================================================");
      //console.log("Detectors Credentials:");
      //console.log(data);
      //console.log("============================================================");
      getDetectorsStatus(global.detectors, function (err, statuses) {
        if (err) {
          return;
        }
        global.detectors = statuses;
      });
    });
    return;
  }

  getDetectorsStatus(global.detectors, function (err, statuses) {
    if (err) {
      return;
    }
    global.detectors = statuses;
  });
};

function getDetectorsCredentials(url2req, callback) {
  request({
      url: url2req,
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
        return callback(error, null);
      }
      return callback(null, body);
    });
}

function getDetectorsStatus(detectorsCred, callback) {
  if (!detectorsCred || detectorsCred.length == 0) {
    return callback(null, detectorsCred);
  }

  let detectorsStat = _.clone(detectorsCred);

  _.forEach(detectorsStat, function (detector, detectorInd) {
    ping.sys.probe(detector.ip, function(isAlive){
      detector.isAlive = isAlive;
      if (isAlive) {
        getDetectorInfo(detector.ip, detector.login, detector.password, function (error, info) {
          detector.isRestApiAvail = error === null;

          if (detectorInd === detectorsStat.length - 1) {
            return callback(null, detectorsStat);
          }

        });
      }
      else {
        detector.isRestApiAvail = false;

        if (detectorInd === detectorsStat.length - 1) {
          return callback(null, detectorsStat);
        }
      }
    });
  });

}

function getDetectorInfo(detectorIP, username, passwd, callback) {
  request({
      url: `http://${detectorIP}/api/info`,
      json: true,
      'auth': {
        'user': username,
        'pass': passwd
      }
    },
    function (error, response, body) {
      if (error) {
        //console.log(error);
        return callback(error, null);
      }
      return callback(null, body);
    });
}
