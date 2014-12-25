## Analysis of lyrics DB from 2002-2011 song lyrics

## Libraries ----
library(tm)
library(wordcloud)
library(ggplot2)
library(lubridate)
library(jsonlite)

## Read JSON ----
lyrics_data <- jsonlite::fromJSON(readLines("data/participants_with_lyrics.json"))


#  Wordcloud
mello_lyrics_corpus <- Corpus(VectorSource(
  lyrics_data[lyrics_data$language == "english",]$lyrics
))
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, content_transformer(tolower), mc.cores=1)
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, removePunctuation, mc.cores=1)
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, function(x)removeWords(x,stopwords("english")), mc.cores=1)

wordcloud(mello_lyrics_corpus, max.words = 250, colors = brewer.pal(8, "RdBu"))

mello_lyrics_corpus <- Corpus(VectorSource(
  lyrics_data[lyrics_data$language == "swedish",]$lyrics
))
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, content_transformer(tolower), mc.cores=1)
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, removePunctuation, mc.cores=1)
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, function(x)removeWords(x,stopwords("swedish")), mc.cores=1)

wordcloud(mello_lyrics_corpus, max.words = 250, colors = brewer.pal(8, "RdBu"), scale = c(3, .5))
