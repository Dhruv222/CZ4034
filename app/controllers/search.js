var solrClient = require(process.cwd() + '/lib/solr'),
  request = require('request'),
  Promise = require('promise');

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

exports.imageSearch = function(req, res, next) {
  var img_url_enc = encodeURIComponent(req.params.img_url);

  request("http://localhost:8983/solr/images/lireq?url=" + img_url_enc, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var docs = JSON.parse(body).docs;
      var promises = [];
      for (var i = 0; i < docs.length; i++) {
        var temp_arr = docs[i].id.split("/");
        var tweet_id = temp_arr[temp_arr.length - 1].split(".")[0];
        promises.push(getTweetById(tweet_id));
      }

      Promise.all(promises).then(function(tweets) {
        res.json(tweets);
      }).catch(function(error) {
        res.send(500, error);
      });

    } else {
      res.send(500, error);
    }
  });

};

var getTweetById = function(tweet_id) {
  return new Promise(function(fulfill, reject) {
    var qText = "id:" + tweet_id;
    solrClient.query(qText, {}, function(err, result) {
      if (err) {
        reject(err);
      } else {
        fulfill(JSON.parse(result).response.docs[0]);
      }
    });
  });
};
