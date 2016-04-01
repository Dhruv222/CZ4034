var fs = require('fs'),
    request = require('request'),
    Promise = require('promise');

exports.download = function(uri, filename){
  return new Promise(function(fulfill, reject) {
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', fulfill);
    });
  });

};
