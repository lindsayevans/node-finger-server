var
    // Requires
    net = require('net'),
    sys = require('sys'),

    // Constants
    REQUEST_MATCH = /^(\/W)?\s*([\+\-\_\.\/\=\?a-z0-9]*)(?:@([@\.:\-0-9a-z]+))*\r\n$/i

;

// Defaults
exports.listen_address = '127.0.0.1'; // hostname/IP address, or null for all addresses
exports.listen_port = 79;

// Start finger server
exports.start = function(){

  net.createServer(function(socket){

    var response;

    socket.setEncoding("utf8");
    console.log('Connection established, remote address: ' + socket.remoteAddress);

    socket.on("data", function(data){
      console.log('Incoming request: [' + data + ']');

      // Parse request
      if(!(response = exports.parse_request(data))){
        socket.write('Invalid request');
        socket.end();
      }
      // Handle request
      socket.end();

    });
    socket.on("end", function(){
      console.log('Connection closed, remote address: ' + socket.remoteAddress);
      socket.end();
    });

  }).listen(exports.listen_port, exports.listen_address);

};


exports.parse_request = function(data){

  var match = REQUEST_MATCH.exec(data),
      request = {
        verbose: match[1] != null,
        user: match[2],
        list_users: match[2] === '',
        hosts: match[3] == null ? [] : match[3].split('@')
      }
  ;
  request.recursive = request.hosts.length !== 0;

  console.log(JSON.stringify(request));

  return match || false;

};

