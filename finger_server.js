var net = require('net'),
    sys = require('sys')
;

// Defaults
this.listen_address = null; // hostname/IP address, or null for all addresses
this.listen_port = 79;

// Start finger server
this.start = function(){

  net.createServer(function(socket){

    socket.setEncoding("utf8");
    console.log('Connection established, remote address: ' + socket.remoteAddress);

    socket.on("data", function(data){
      console.log('Incoming request: [' + data + ']');

      if(var response = this.handle_request(data)){
        socket.write(response);
      }
      socket.end();

    });
    socket.on("end", function(){
      console.log('Connection closed, remote address: ' + socket.remoteAddress);
      socket.end();
    });

  }).listen(this.listen_port, this.listen_address);

};


this.handle_request = function(data){

  if(data.match(/lindsay/i)){
    return 'lindsay is online & being awesome';
  }

  return false;

};

