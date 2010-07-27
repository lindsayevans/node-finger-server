
var FingerServer = new require('./finger_server');
FingerServer.listen_address = '127.0.0.1'; // hostname/IP address, or null for all addresses
//FingerServer.listen_port = 7979; // defaults to 79
FingerServer.start();

console.log('Finger server listening on ' + (FingerServer.listen_address || '*') + ':' + FingerServer.listen_port);

