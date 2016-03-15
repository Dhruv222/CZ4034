var twitterClient = require(process.cwd() + '/lib/twitter'),
  solrClient = require(process.cwd() + '/lib/solr'),
  Tweet = require(process.cwd() + '/app/models/tweet');

exports.addTwitterHandle = function(req, res, next) {
  var screen_name = req.params.screen_name;

  Tweet.fetchTweets(screen_name).then(function(tweets) {
    var tweets_trimmed = [];
    var numTweets = tweets.length;

    for (var i = 0; i < numTweets; i++) {
      tweets_trimmed.push({
        id: tweets[i].id,
        tweet_text: tweets[i].text
      });
    }

    solrClient.add(tweets_trimmed, {
      overwrite: true,
      commitWithin: 1000
    }, function(err, obj) {
      if (err) {
        res.send(500, err);
      } else {
        solrClient.commit(function(err, obj) {
          if (err) {
            res.send(500, err);
          } else {
            res.send({ ok: "true", message: "Tweets were successfully indexed" });
          }
        });
      }
    });

  }).catch(function(error) {
    res.send(500, error);
  });

};
