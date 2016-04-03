
var solr = require('solr-client');

var client = solr.createClient({
  core: "tweets"
});

// solrClient.autoCommit = true;

module.exports = client;
