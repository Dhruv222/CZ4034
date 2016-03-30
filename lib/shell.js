var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
  console.log(stdout)
};

exports.execute = function(command) {
  exec(command, puts);
};
