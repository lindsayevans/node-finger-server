var
    // Requires
    net = require('net'),
    sys = require('sys'),

    // Constants
    REQUEST_MATCH = /^(\/W)?\s*([\+\-\_\.\/\=\?a-z0-9]*)(?:@([@\.:\-0-9a-z]+))*\r\n$/i

;

// Defaults
exports.listen_address = '127.0.0.1'; // Hostname/IP address to listen on, null for all addresses
exports.listen_port = 79; // TCP port to listen on

exports.allow_recursive = false; // Allow forwarding to remote hosts - RFC 1288 section 3.2.1
exports.allow_list = false; // Allow listing of all users - RFC 1288 section 3.2.2
exports.allow_verbose = false; // Allow verbose output - RFC 1288 section 2.5.4
exports.allow_plan = false; // Allow user information file - RFC 1288 section 3.2.4
exports.allow_user_scripts = false; // Allow user scripts - RFC 1288 section 3.2.5
exports.allow_ambiguous = false; // Allow ambiguous user lookup - RFC 1288 section 3.2.6

// Allowed users
exports.allowed_users = {};

// What gets returned - RFC 1288 section 3.2.3
// TODO: replace with template files
exports.user_output_template = "Full name: {full_name}";
exports.verbose_user_output_template = "User name: {user_name}\tFull name: {full_name}\r\nOnline: {online}\r\nPlan:\r\n{plan}";
exports.list_output_template = "User name\t\t\tFull name\r\n{{user_name}\t\t\t{full_name}\r\n}";
exports.verbose_list_output_template = "User name\t\t\tFull name\t\t\tOnline\r\n{{user_name}\t\t\t{full_name}\t\t\t{online}\r\n}";

// Log requests - RFC 1288 section 3.2.7
exports.enable_logging = true;
exports.log_path = "/var/log/finger.log";

// Start finger server
exports.start = function(){

  net.createServer(function(socket){

    var request, reponse = '';

    socket.setEncoding("utf8");
    console.log('Connection established, remote address: ' + socket.remoteAddress);

    socket.on("data", function(data){
      console.log('Incoming request: [' + data + ']');

      // Parse request
      request = exports.parse_request(data);

      // Handle request
      response = exports.handle_request(request);

      socket.write(response);
      socket.end();

    });
    socket.on("end", function(){
      console.log('Connection closed, remote address: ' + socket.remoteAddress);
      socket.end();
    });

  }).listen(exports.listen_port, exports.listen_address);

};

// Import configuration
exports.import_config = function(config){
  for(k in config){
   exports[k] = config[k];
  }
};

// Parse the finger query
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

// Handle request
exports.handle_request = function(request){

  var response = '';

  // Invalid request
  if(!request){
    return 'Invalid request';
  }

  // Forwarding
  if(request.recursive){
    if(exports.allow_recursive){
      // Forward to next host
      response = 'Forwarding not implemented yet';
    }else{
      response = 'Finger forwarding service denied';
    }
  }else if(request.list_users){
    if(exports.allow_list){
      if(request.verbose){
        response = exports.verbose_list_output_template;
      }else{
        response = exports.list_output_template;
      }
    }else{
      response = "User listing denied";
    }
  }else{
    if(request.verbose){
      response = exports.verbose_user_output_template;
    }else{
      response = exports.user_output_template;
    }
  }

  return response;
};

