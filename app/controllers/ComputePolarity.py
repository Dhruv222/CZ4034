import nltk, sys
from nltk.sentiment.vader import SentimentIntensityAnalyzer
sentence = sys.argv[1]
sid = SentimentIntensityAnalyzer()
ss = sid.polarity_scores(sentence)
if ss['pos'] > ss['neg'] and ss['pos'] > ss['neu']:
    polarity = 'positive'
elif ss['neg'] > ss['pos'] and ss['neg'] > ss['neu']:
    polarity = 'negative'
else:
    polarity = 'neutral'
print polarity
