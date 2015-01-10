## Count unique number of words per song and/or year ##

## Libraries ----
library("dplyr")
library("stringr")
library("tm")
library("ggplot2")
library("scales")

## Munge ----
# Data is fetched from analysis/read_json.R
mello_lyrics_corpus <- Corpus(VectorSource(mello_data$lyrics))
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, content_transformer(tolower), mc.cores=1)
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, removePunctuation, mc.cores=1)
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, function(x) removeWords(x, stopwords("english")), mc.cores=1)
mello_lyrics_corpus <- tm_map(mello_lyrics_corpus, function(x) removeWords(x, stopwords("swedish")), mc.cores=1)

## Analysis ----
# Unique words count per song

dtm <- DocumentTermMatrix(mello_lyrics_corpus)
uw <- rowSums(as.matrix(dtm))
mello_data <- mello_data %>%
  mutate(unique_words = uw)

## Plots ----
ggplot(mello_data %>% filter(final_placing > -1), aes(x = unique_words, y = final_placing)) + 
  # geom_point(aes(color = as.factor(year)), size = 5) +
  # geom_line(aes(color = as.factor(year))) +
  geom_hex() +
  scale_fill_continuous(low = muted("red"), high = muted("blue")) +
  # scale_fill_discrete() +
  labs(title = "Unika ord vs Röster i första omgången")

