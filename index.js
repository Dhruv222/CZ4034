"use strict";

var restify = require('restify'),
  fs = require('fs'),
  env = require('node-env-file');

// env(process.cwd() + '/.env');

var controllers = {};
var controllers_path = process.cwd() + '/app/controllers';
fs.readdirSync(controllers_path).forEach(function (file) {
   if (file.indexOf('.js') != -1) {
       controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
   }
});

var server = restify.createServer({
  name: "cz4034-information-retrieval"
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({mapParams: true, overrideParams: false}));

server.get('/ping', function (req, res, next) {
  res.json({"code": "OK", "message":"Hello world!"});
  next();
});

// Backend API endpoints
server.post('/search', controllers.search.doSearch);
server.post('/data/:screen_name', controllers.data.addTwitterHandle);

// Serve static content from the ./frontend directory
server.get(/.*/, restify.serveStatic({
  directory: './frontend',
  default: 'search.html'
}));

server.listen( 3001, function() {
  console.log('%s now listening on %s', server.name, server.url );
});
