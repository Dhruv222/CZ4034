var twitterClient = require(process.cwd() + '/lib/twitter'),
  solrClient = require(process.cwd() + '/lib/solr'),
  Tweet = require(process.cwd() + '/app/models/tweet'),
  image_download = require(process.cwd() + '/lib/image_download'),
  fs = require('fs'),
  shell = require(process.cwd() + '/lib/shell'),
  Promise = require('promise'),
  Sentiment = require(process.cwd() + '/app/models/sentimentAnalysis');

var indexImages = function(url_tweet_mapping) {
  var image_promises = [];
  var filenames_str = "";
  var tweet_ids = Object.keys(url_tweet_mapping);

  for (var i = 0; i < tweet_ids.length; i++) {
    var filename = tweet_ids[i] + '.jpg';
    var filepath = "/tmp/images/" + filename;
    image_promises.push(image_download.download(url_tweet_mapping[tweet_ids[i]], filepath));
    filenames_str = filenames_str + filepath + "\n";
  }
  console.log("starting download");
  Promise.all(image_promises).then(function() {
    console.log("downloaded " + image_promises.length + " images");
    if (fs.existsSync("/tmp/infile.txt"))
      fs.unlinkSync("/tmp/infile.txt");
    fs.writeFile("/tmp/infile.txt", filenames_str, function(err) {
      if (err) {
        console.log("error writing to file");
      }
      console.log("created infile.txt");

      console.log("indexing images");
      shell.execute("sh " + process.cwd() + "/index_images.sh");
    });
  });
};

exports.addTwitterHandle = function(req, res, next) {
  var screen_name = req.params.screen_name;
  var coordinate = req.params.coordinate;

  Tweet.fetchTweets(screen_name).then(function(tweets) {
    var tweets_trimmed = [];
    var numTweets = tweets.length;

    var url_tweet_mapping = {};

    for (var i = 0; i < numTweets; i++) {

      //Calculate the sentiment of the tweet
      var ss = Sentiment(tweets[i].text);
      if (ss.score >= 0.5){
        var polarity = 'positive';
      }
      else if(ss.score <= -0.5){
        var polarity ='negative';
      }
      else{
        var polarity = 'neutral';
      }

      //Find the location of the tweet[i]


      tweets_trimmed.push({
        id: tweets[i].id,
        tweet_text: tweets[i].text,
        sentiment: polarity,
        coordinates:coordinate || "0,0",
        twitter_handle:screen_name
      });
      if (tweets[i].entities.media && tweets[i].entities.media.length > 0) {
        url_tweet_mapping[tweets[i].id] = tweets[i].entities.media[0].media_url;
      }
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
    indexImages(url_tweet_mapping);

  }).catch(function(error) {
    res.send(500, error);
  });

};
