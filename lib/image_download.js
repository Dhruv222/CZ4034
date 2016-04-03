var fs = require('fs'),
    request = require('request'),
    Promise = require('promise');

exports.download = function(uri, filename){
  return new Promise(function(fulfill, reject) {
    request.get(uri).on('error', function(err) {
      reject(err);
    }).on('response', function(response) {
      fulfill();
    }).pipe(fs.createWriteStream(filename));
  });

};
