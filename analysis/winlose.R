## Libraries ----
library("wordcloud")
source("analysis/sentiment_func.R")
library("qdap")
library("stringr")
library("ggplot2")
library("tm")

## Data ---- 
# Data: "wl" from read_json.R + mello_data from load(".RData") <--

## Lyrics corpus ----
wl_corpus <- Corpus(VectorSource(wl$lyrics))
wl_corpus <- tm_map(wl_corpus, content_transformer(tolower), mc.cores=1)
wl_corpus <- tm_map(wl_corpus, removePunctuation, mc.cores=1)
wl_corpus <- tm_map(wl_corpus, function(x) removeWords(x, stopwords("english")), mc.cores=1)
wl_corpus <- tm_map(wl_corpus, function(x) removeWords(x, stopwords("swedish")), mc.cores=1)


# Count of unique and total number of words in each song
dtm <- DocumentTermMatrix(wl_corpus)
uw <- rowSums(as.matrix(dtm))
wl <- wl %>%
  mutate(unique_words = uw,
         total_words = wc(lyrics_cleaned))

# Divide into Swedish and English songs (we can do more with English songs)
wl_se <- wl %>% filter(language == "swedish")
wl_en <- wl %>% filter(language == "english")

# Term score for English texts
# require("tm.lexicon.GeneralInquirer")
# positives <- terms_in_General_Inquirer_categories("Positiv")
# negatives <- terms_in_General_Inquirer_categories("Negativ")

# sentterms <- read.table("data/sentiment_scores_en.txt", sep = "\t") %>%
#   tbl_df() %>%
#   dplyr::rename(V1 = term, V2 = score)
# 
# wl_en$lyric_sentiment <- score.sentiment(wl_en$lyrics_cleaned, positives, negatives)$score
# wl_en <- wl_en %>% mutate(
#   weighted_sentiment = lyric_sentiment / total_words,
#   binned_sentiment = cut(lyric_sentiment, c(-Inf, -5, 0, 5, Inf))
#   ) %>%
#   filter(winner == 1)
# 
# sents <- levels(factor(wl_en$binned_sentiment))
# labels <- lapply(sents, function(x) {
#   paste(
#     x,
#     format(round(
#       (length((wl_en[wl_en$binned_sentiment == x,])$lyrics_cleaned)/length(wl_en$binned_sentiment)*100),
#       2
#     ), nsmall = 2),"%"
#   )
#   })
# nemo = length(sents)
# emo.docs = rep("", nemo)
# for (i in 1:nemo)
# {
#   tmp = wl_en[wl_en$binned_sentiment == sents[i],]$lyrics_cleaned
#   
#   emo.docs[i] = paste(tmp,collapse=" ")
# }
# # emo.docs = removeWords(emo.docs, stopwords("swedish"))
# emo.docs = removeWords(emo.docs, stopwords("english"))
# corpus = Corpus(VectorSource(emo.docs))
# tdm = TermDocumentMatrix(corpus)
# tdm = as.matrix(tdm)
# colnames(tdm) = labels
# comparison.cloud(tdm, colors = brewer.pal(nemo, "Dark2"),
#                  scale = c(3,.5), random.order = FALSE, title.size = 1.5)

wl <- wl %>% 
  left_join(mello_data %>% 
              select(id, sent_score, lovecount, lovebins),
            by = "id")

## Winners/losers plots ----
wl %>%
  group_by(winner) %>%
  summarise(mean_unique_words = mean(unique_words, na.rm = TRUE),
            sd_unique_words = sd(unique_words, na.rm = TRUE)) %>%
  ggplot(aes(x = winner, y = sd_unique_words)) +
  geom_bar(stat = "identity")

# Winners typically have wordier songs than losers (albeit with relatively small differences)
wl %>%
  ggplot(aes(x = unique_words, group = winner, fill = winner)) +
  geom_density(alpha = 0.7)

# Winners are typically in the minor(!) key
wl %>%
  ggplot(aes(group = as.factor(echonest_mode), x = as.factor(winner), fill = echonest_mode)) +
  geom_bar(position = position_dodge(), binwidth = 0.2)

# Winners typically center aruond a BPM of about 128
wl %>%
  ggplot(aes(x = echonest_tempo, group = winner, fill = winner)) +
  geom_density(alpha = 0.7)

# Winners almost always sing in English
wl %>%
  ggplot(aes(x = as.factor(language), group = winner, fill = winner)) +
  geom_bar(position = position_dodge())

# Both winners and losers center around 3 minutes in song length
wl %>%
  ggplot(aes(x = echonest_duration, group = winner, fill = winner)) +
    geom_density(alpha = 0.7)

# Winners tend to be happier than losers
wl %>%
  ggplot(aes(x = sent_score, group = winner, fill = winner)) +
  geom_density(alpha = 0.7)

## Wordclouds ----
wordcloud(wl_corpus, max.words = 250, colors = brewer.pal(8, "RdBu"))

# Per language + winner/loser
# Swedish
wl_se$lyrics %>%
  tolower() %>%
  removePunctuation() %>%
  removeWords(stopwords("swedish")) %>%
  wordcloud(max.words = 250, colors = brewer.pal(8, "RdBu"))

# Swedish losers
wl_se[wl_se$winner == 0,]$lyrics %>%
  tolower() %>%
  removePunctuation() %>%
  removeWords(stopwords("swedish")) %>%
  wordcloud(max.words = 250, colors = brewer.pal(8, "RdBu"))

# Swedish winners
wl_se[wl_se$winner == 1,]$lyrics %>%
  tolower() %>%
  removePunctuation() %>%
  removeWords(stopwords("swedish")) %>%
  wordcloud(max.words = 250, colors = brewer.pal(8, "RdBu"))

# English
wl_en$lyrics %>%
  tolower() %>%
  removePunctuation() %>%
  removeWords(stopwords("english")) %>%
  wordcloud(max.words = 250, colors = brewer.pal(8, "RdBu"))

# English losers
wl_en[wl_se$winner == 0,]$lyrics %>%
  tolower() %>%
  removePunctuation() %>%
  removeWords(stopwords("english")) %>%
  wordcloud(max.words = 250, colors = brewer.pal(8, "RdBu"))

# English winners
wl_en[wl_se$winner == 1,]$lyrics %>%
  tolower() %>%
  removePunctuation() %>%
  removeWords(stopwords("english")) %>%
  wordcloud(max.words = 250, colors = brewer.pal(8, "RdBu"))


