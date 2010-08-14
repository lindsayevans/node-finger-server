
var FingerServer = new require('./finger_server'),
    config = {},
    sys = require('sys'),
    fs = require('fs')
;

// Load config file
fs.readFile('config.json', function(e, data){
  if(e) throw e;
  config = JSON.parse(data);
  FingerServer.import_config(config);
  FingerServer.start();
});

// TODO: catch signals & stop/restart/reconfigure
