'use strict';

var ping = require('ping');

exports.monitor = function() {
  var host = '10.10.2.163';
  ping.sys.probe(host, function(isAlive){
    var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
    console.log(msg);
  });
};
