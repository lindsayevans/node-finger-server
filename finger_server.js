var net = require('net'),
    sys = require('sys')
;

// Defaults
exports.listen_address = null; // hostname/IP address, or null for all addresses
exports.listen_port = 79;

// Start finger server
exports.start = function(){

  net.createServer(function(socket){

    socket.setEncoding("utf8");
    console.log('Connection established, remote address: ' + socket.remoteAddress);

    socket.on("data", function(data){
      console.log('Incoming request: [' + data + ']');

      if(data.match(/lindsay/i)){
        socket.write('lindsay is online & being awesome');
        socket.end();
      }

    });
    socket.on("end", function(){
      console.log('Connection closed, remote address: ' + socket.remoteAddress);
      socket.end();
    });

  }).listen(this.listen_port, this.listen_address);

};

