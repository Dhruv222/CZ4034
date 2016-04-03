var solrClient = require(process.cwd() + '/lib/solr'),
  request = require('request'),
  Promise = require('promise');
  fs = require('fs');
  Arff = require('arff-utils');
  iconv = require('iconv-lite');
  _ = require('lodash');

exports.doSearch = function(req, res, next) {
  var qText = "tweet_text:" + encodeURIComponent(req.params.q).replace(/%20/g, '+') + " AND sentiment:" + encodeURIComponent(req.params.sentiment).replace(/%20/g, '+') +" AND twitter_handle:" + encodeURIComponent(req.params.location).replace(/%20/g, '+');

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

exports.sortByParam = function(req, res, next) {

  var sortParam = req.params.param;
  var numOfDocs = req.params.num;
  var tweet_text = req.params.tweet_text;
  var sortObj = {};
  var reg = /and|for|the|in|or|do|with|by|to|https*/ig;

  tweet_text = tweet_text.replace(reg, " ").split(/\s+/);
  tweet_text = tweet_text.join("* OR ") + "*";

  var query = solrClient.createQuery()
          .q('*:*')
          .start(0)
          .rows(numOfDocs);

  solrClient.search(query,function(err,obj){
    
    if(err){
      res.send(err);
    }
    else {
      res.send(obj);
    }
  
  });

};

exports.retrieveQueries = function(req, res, next) {
  
  var query = solrClient.createQuery()
          .q('*:*')
          .start(0)
          .rows(3103)
          .fl('tweet_text,sentiment');

  solrClient.search(query,function(err,obj){
    if(err){
      res.send(err);
    }
    else {
      var tweets = obj.response.docs;
      var tweets = JSON.stringify(tweets);

      fs.writeFile('file.txt', tweets, function(err) {
        if (err) throw err;
        console.log('file saved');
      });
    }
    res.send(obj.response.docs);
  });
};

exports.generateArff = function(req, res, next) {

  var preprocess= fs.readFileSync('file.txt', 'utf8', function(err) {
        if (err) throw err;
        console.log('file read');
      });
  
  var obj = JSON.parse(preprocess);
  var size = Object.keys(obj).length;

  var processed = '@DATA';
  var processed_tweet_text;
  var processed_sentiment;
  
  while(size > 0) {
    processed_tweet_text= obj[size-1].tweet_text;
    processed_sentiment= obj[size-1].sentiment;
    processed = processed +'\n' + "'" + processed_tweet_text.replace(/\s@\w+|\s#\w+|http.*|:|["'’]+|(\r\n|\n|\r)/g, '')
                .trim()  + "'," + processed_sentiment;
    size--;
  }

  processed = "@RELATION sentiment" + "\n@ATTRIBUTE tweet STRING" + "\n@ATTRIBUTE class {positive, negative, neutral}" + '\n\n' + processed;

  fs.writeFile('twitter.arff', processed, function(err) {
        if (err) throw err;
        console.log('file saved');
      });

    res.send("Arff file created!");
  };



