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
  var filenames = [];
  var filenames_str = "";
  var tweet_ids = Object.keys(url_tweet_mapping);

  for (var i = 0; i < tweet_ids.length; i++) {
    var filename = tweet_ids[i] + '.jpg';
    var filepath = "/tmp/images/" + filename;
    filenames.push(filepath);
  }

  console.log("starting download");
  var download_image = function(index) {
    if (index >= filenames.length) {
      console.log("downloaded " + filenames.length + " images");
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
      return;
    }

    image_download.download(url_tweet_mapping[tweet_ids[index]], filenames[index]).then(function() {
      filenames_str = filenames_str + filenames[index] + "\n";
      console.log("Downloaded " + filenames[index]);
      download_image(index + 1);
    }).catch(function(error) {
      console.log("Download error: ")
      console.log(error);
      download_image(index + 1);
    });
  };

  download_image(0);
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
            indexImages(url_tweet_mapping);
          }
        });
      }
    });

  }).catch(function(error) {
    res.send(500, error);
  });

};
