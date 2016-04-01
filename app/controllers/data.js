var twitterClient = require(process.cwd() + '/lib/twitter'),
  solrClient = require(process.cwd() + '/lib/solr'),
  Tweet = require(process.cwd() + '/app/models/tweet')
  Sentiment = require(process.cwd() + '/app/models/sentimentAnalysis');

exports.addTwitterHandle = function(req, res, next) {
  var screen_name = req.params.screen_name;

  Tweet.fetchTweets(screen_name).then(function(tweets) {
    var tweets_trimmed = [];
    var numTweets = tweets.length;

    for (var i = 0; i < numTweets; i++) {
      var ss = Sentiment(tweets[i].text);
      console.log(ss);
      if (ss.score>0){
        var polarity = 'positive';
      }
      else if (ss.score<0){
        var polarity = 'negative';
      }
      else{
        var polarity = 'neutral';
      }
      console.log(polarity);
      if(tweets[i].coordinates != null){
        var coord = tweets[i].coordinates.coordinates.reverse().toString();
      }
      else if(tweets[i].place != null){
        var coord = tweets[i].place.coordinates[1][1].reverse().toString();
      }
      else {
        var coord = "0,0";
      }
      tweets_trimmed.push({
        id: tweets[i].id,
        tweet_text: tweets[i].text,
        coordinates: coord,
        sentiment: polarity
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
