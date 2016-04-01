var solr = require('solr');

var client = solr.createClient({
  core: "/tweets"
});

// solrClient.autoCommit = true;

module.exports = client;
