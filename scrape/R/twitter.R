## Using RTwitterAPI ----

## Libraries
library(RTwitterAPI);

## Call parameters
params <- c(
  "oauth_consumer_key"     = "mWmpiD7EJS8UzZJB7gU3MdbkM",
  "oauth_nonce"            = NA,
  "oauth_signature_method" = "HMAC-SHA1",
  "oauth_timestamp"        = NA,
  "oauth_token"            = "390111081-I6bKavFhhmYFi4xOIwSot2yMCM89OzYKTeCWjHjb",
  "oauth_version"          = "1.0",
  "consumer_secret"        = "uWqod5GpGA0Nd5uX4hLoo8JtLhKnVCUX0gIEEjQ4YSXpF45IGy",
  "oauth_token_secret"     = "6MqGmfchbtT6S5oyPxPMaa7JjP4bVJCKtZWFYNgV1iTzk"
);

# https://dev.twitter.com/docs/api/1.1/get/followers/ids
url   <- "https://api.twitter.com/1.1/friends/ids.json";
query <- c(cursor=-1, screen_name="hrw", count=10);

result <- RTwitterAPI::twitter_api_call(url, query, params, print_result=TRUE)


## Using twitteR ----

## Libraries
library(twitteR)
library(wordcloud)
library(tm)
library(lubridate)
library(stringr)

## Authentication
reqURL <- "https://api.twitter.com/oauth/request_token"
accessURL <- "https://api.twitter.com/oauth/access_token"
authURL <- "https://api.twitter.com/oauth/authorize"
consumerKey <- "mWmpiD7EJS8UzZJB7gU3MdbkM"
consumerSecret <- "uWqod5GpGA0Nd5uX4hLoo8JtLhKnVCUX0gIEEjQ4YSXpF45IGy"
twitCred <- OAuthFactory$new(consumerKey = consumerKey,
                             consumerSecret = consumerSecret,
                             requestURL = reqURL,
                             accessURL = accessURL,
                             authURL = authURL)
twitCred$handshake()
registerTwitterOAuth(twitCred)


## Get data
since = (Sys.Date() %>% lubridate::ymd() - days(7)) %>% as.character()
until = Sys.Date() %>% lubridate::ymd() %>% as.character()

mello_tweets <- searchTwitter("#mello OR #mello15 OR #melfest OR #melfest15", n = 1500, since = since, until = until)

## Word cloud
#save text
mello_tweets_text <- sapply(mello_tweets, function(x) x$getText())
mello_tweets_text <- str_replace_all(mello_tweets_text,"[^[:graph:]]", " ") 
mello_tweets_text <- str_replace_all(mello_tweets_text, "2015", "15") 

#create corpus
mello_tweets_text_corpus <- Corpus(VectorSource(mello_tweets_text))

#clean up
mello_tweets_text_corpus <- tm_map(mello_tweets_text_corpus,
                                   content_transformer(function(x) iconv(x, to='UTF-8-MAC', sub='byte')),
                                   mc.cores=1
)
mello_tweets_text_corpus <- tm_map(mello_tweets_text_corpus, content_transformer(tolower), mc.cores=1)
mello_tweets_text_corpus <- tm_map(mello_tweets_text_corpus, removePunctuation, mc.cores=1)
mello_tweets_text_corpus <- tm_map(mello_tweets_text_corpus, function(x)removeWords(x,stopwords()), mc.cores=1)
wordcloud(mello_tweets_text_corpus)

## DB write ----
mello_data <- lapply(mello_tweets, function(tweet) {
  list(
    id = tweet$id,
    text = tweet$text,
    name = tweet$screenName,
    statusSource = tweet$statusSource,
    favorited = tweet$favorited,
    favoriteCount = tweet$favoriteCount,
    isRetweet = tweet$isRetweet,
    created = as.character(tweet$created),
    retweeted = tweet$retweeted,
    lat = tweet$latitude,
    long = tweet$longitude,
    urls = as.list(tweet$urls)
  )
})

mello_json <- jsonlite::toJSON(mello_data, pretty = TRUE)

## Write to disk
cat(mello_json, file = "meltweets.json")

## Read from disk
mello_data <- jsonlite::fromJSON("meltweets.json", simplifyDataFrame = FALSE)


