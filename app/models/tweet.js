var Promise = require('promise'),
  dateHelper = require(process.cwd() + '/lib/date_helper'),
  twitterClient = require(process.cwd() + '/lib/twitter');
var Tweet = function() {};

var NUM_TWEETS_TO_FETCH = 2000;
var TWEETS_IN_ONE_API_CALL = 200; // 200 tweets is the Twitter API limit

var _fetch = function(screen_name, offset, max_id, fulfill, reject, tweets_list) {
  tweets_list = tweets_list || [];
  offset = offset || 0;
  if (offset >= NUM_TWEETS_TO_FETCH) {
    fulfill(tweets_list);
    return;
  };

  screen_name = screen_name.toLowerCase();
  twitterClient.get('statuses/user_timeline', {
    screen_name: screen_name,
    trim_user: true,
    count: TWEETS_IN_ONE_API_CALL,
    max_id: max_id
  }, function(error, tweets, response) {
    if (error) {
      reject(error);
      return;
    }

    if (NUM_TWEETS_TO_FETCH < TWEETS_IN_ONE_API_CALL) {
      tweets = tweets.slice(0, NUM_TWEETS_TO_FETCH);
    }

    var numTweets = tweets.length;
    if (numTweets !== 0) {
      var max_id = tweets[numTweets - 1].id;
      _fetch(screen_name, offset + numTweets, max_id, fulfill, reject, tweets_list.concat(tweets));
    } else {
      fulfill(numTweets);
    }
  });
};

Tweet.fetchTweets = function(screen_name) {
  return new Promise(function(fulfill, reject) {
    _fetch(screen_name, 0, undefined, fulfill, reject);
  });
};

module.exports = Tweet;
