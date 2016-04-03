var fs = require('fs'),
    request = require('request'),
    Promise = require('promise');

exports.download = function(uri, filename){
  return new Promise(function(fulfill, reject) {
    request.head(uri, function(err, res, body){
      if (err) {
        fs.writeFile(filename, "", function(err) {
          fulfill();
        });
      } else {

        request.get(uri).on('error', function(err) {
          console.log("request error");
          console.log(err);
          fulfill();
        }).on('response', function(response) {
          fulfill(); 
        }).pipe(fs.createWriteStream(filename));
      }
    });
  });

};
