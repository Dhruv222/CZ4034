var sentiment = require('Sentimental').analyze;

module.exports = function(text){
  return sentiment(text);
};
