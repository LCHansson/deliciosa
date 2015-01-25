## Libraries ----
library("dplyr")
library("stringr")

## Data ----
# mello_data from read_json.R
lyrdata <- mello_data %>%
  select(translated_lyric_cleaned, artist, id, language, song_name)


## Sentiment data ----
sentwords <- read.table(
  "data/sentiment_scores_en.txt",
  sep = "\t", col.names = c("word", "score")) %>% tbl_df()

scores = sapply(lyrdata$translated_lyric_cleaned, function(lyric, sentwords) {
  
  # clean up lyrics with R's regex-driven global substitute, gsub():
  lyric = gsub('[[:punct:]]', '', lyric)
  lyric = gsub('[[:cntrl:]]', ' ', lyric)
  lyric = gsub('\\d+', '', lyric)
  # and convert to lower case:
  lyric = tolower(lyric)
  
  # split into words. str_split is in the stringr package
  word.list = str_split(lyric, '\\s+')
  # sometimes a list() is one level of hierarchy too much
  words = unlist(word.list)
  
  matches <- match(words, sentwords$word)
  
  scores <- sentwords[matches[!is.na(matches)],]$score
  
  score <- sum(scores)
  
  return(score)
}, sentwords, USE.NAMES = FALSE)

lyrdata$sent_score <- scores

