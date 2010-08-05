
var FingerServer = new require('./finger_server');

// Load config file
//var config = JSON.parse(fs.open('config.json'));
//FingerServer.import_config(config);

FingerServer.listen_address = null; // hostname/IP address, or null for all addresses
//FingerServer.listen_port = 7979; // defaults to 79
FingerServer.start();

console.log('Finger server listening on ' + (FingerServer.listen_address || '*') + ':' + FingerServer.listen_port);

