var solrClient = require(process.cwd() + '/lib/solr');

exports.doSearch = function(req, res, next) {
  var qText = "tweet_text:" + encodeURIComponent(req.params.q).replace(/%20/g, '+');
  var page = parseInt(req.params.page);
  page = isNaN(page) ? 1 : page;
  var page_size = parseInt(req.params.page_size);
  page_size = isNaN(page_size) ? 10 : page_size;

  solrClient.query(qText, {
    start: (page - 1) * page_size,
    rows: page_size
  }, function(err, result) {
    if (err) {
      res.send(500, err);
    } else {
      res.json(result);
    }
  });
};
