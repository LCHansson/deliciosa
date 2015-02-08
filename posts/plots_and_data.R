library("jsonlite")
library("ggplot2")

## Texterna ----
ggplot(mello_data %>% filter(as.character(lovebins) != "<NA>"), aes(x = factor(1), fill = factor(lovebins))) +
  #   geom_bar(color = "#17ACD2", size = 1, width = 1) +
  geom_bar(size = 1, width = 1) +
  coord_polar(theta = "y", direction = -1) +
  scale_fill_manual(values = c("#FFFFFF", "lightgrey", "#17ACD2")) +
  theme_tufte() +
  theme(axis.text.x = element_blank(), axis.ticks.x = element_blank(),
        axis.text.y = element_blank(), axis.ticks.y = element_blank(),
        axis.title.y = element_blank(), axis.title.x = element_blank(),
        legend.position = "bottom")
ggsave("posts/texterna/texterna_loveprops.png")

json <- jsonlite::toJSON(
  table(mello_data$lovebins) %>%
    as.data.frame() %>%
    filter(1:n() > 1) %>%
    dplyr::rename(name = Var1, freq = Freq) %>%
    arrange(desc(freq)),
  pretty = TRUE)
cat(json, file = "frontend/data/texterna_loveprops.json")



ggplot(plotdata_texter, aes(x = wordfac, y = freqs)) +
  geom_bar(stat = "identity", fill = "#17ACD2") +
  geom_text(aes(y = freqs, label = words, hjust = -0.2)) +
  coord_flip() +
  theme_tufte() +
  theme(axis.text.y = element_blank(), axis.ticks.y = element_blank(),
        axis.title.y = element_blank(), axis.title.x = element_blank()) +
  ylim(0, 900)
ggsave("posts/texterna/texterna_wordfreqs.png")

json <- toJSON(
  plotdata_texter %>% select(-wordfac) %>% slice(1:10),
  pretty = TRUE)
cat(json, file = "frontend/data/texterna_wordfreqs.json")


json <- toJSON(
  lyrdata %>% select(-translated_lyric_cleaned) %>% arrange(desc(sent_score)),
  pretty = TRUE)
cat(json, file = "frontend/data/texterna_peppodepp.json")

sentiments_dt <- lyrdata %>%
  mutate(title = paste0(artist, ": ", song_name, " (", year, ")")) %>%
  select(title, sent_score, id) %>%
  arrange(desc(sent_score)) %>%
  as.matrix()
json <- jsonlite::toJSON(list(data = sentiments_dt), pretty = TRUE)
cat(json, file = "frontend/data/texterna_peppodepp_dt.json")


ggplot(mello_data, aes(x = factor(1), fill = factor(seasonbins))) +
  geom_bar(color = "#17ACD2", size = 1, width = 1) +
  coord_polar(theta = "y", direction = -1) +
  scale_fill_manual(values = c("#FFFFFF", "#17ACD2")) +
  theme_tufte() +
  theme(axis.text.x = element_blank(), axis.ticks.x = element_blank(),
        axis.text.y = element_blank(), axis.ticks.y = element_blank(),
        axis.title.y = element_blank(), axis.title.x = element_blank(),
        legend.position = "none") +
  labs(title = "Årstider")
ggsave("posts/texterna/texterna_arstider.png")

json <- jsonlite::toJSON(
  table(mello_data$seasonbins) %>%
    as.data.frame() %>%
    dplyr::rename(name = Var1, freq = Freq) %>%
    arrange(freq),
  pretty = TRUE
)
cat(json, file = "frontend/data/texterna_seasons.json")


ggplot(mello_data, aes(x = factor(1), fill = factor(godbins))) +
  geom_bar(color = "#17ACD2", size = 1, width = 1) +
  coord_polar(theta = "y", direction = -1) +
  scale_fill_manual(values = c("#FFFFFF", "#17ACD2")) +
  theme_tufte() +
  theme(axis.text.x = element_blank(), axis.ticks.x = element_blank(),
        axis.text.y = element_blank(), axis.ticks.y = element_blank(),
        axis.title.y = element_blank(), axis.title.x = element_blank(),
        legend.position = "none") +
  labs(title = "Religion")
ggsave("posts/texterna/texterna_religion.png")

json <- jsonlite::toJSON(
  table(mello_data$godbins) %>%
    as.data.frame() %>%
    dplyr::rename(name = Var1, freq = Freq) %>%
    arrange(freq),
  pretty = TRUE
)
cat(json, file = "frontend/data/texterna_religion.json")


ggplot(mello_data, aes(x = factor(1), fill = factor(partybins))) +
  geom_bar(color = "#17ACD2", size = 1, width = 1) +
  coord_polar(theta = "y", direction = -1) +
  scale_fill_manual(values = c("#FFFFFF", "#17ACD2")) +
  theme_tufte() +
  theme(axis.text.x = element_blank(), axis.ticks.x = element_blank(),
        axis.text.y = element_blank(), axis.ticks.y = element_blank(),
        axis.title.y = element_blank(), axis.title.x = element_blank(),
        legend.position = "none") +
  labs(title = "Fest och äventyr")
ggsave("posts/texterna/texterna_aventyr.png")

json <- jsonlite::toJSON(
  table(mello_data$partybins) %>%
    as.data.frame() %>%
    dplyr::rename(name = Var1, freq = Freq) %>%
    arrange(freq),
  pretty = TRUE
)
cat(json, file = "frontend/data/texterna_aventyr.json")


json <- jsonlite::toJSON(
  mello_data %>% select(artist, song_name, year, lovecount, lyrics_cleaned, id) %>% arrange(desc(lovecount)) %>% filter(lovecount > -1),
  pretty = TRUE
)
cat(json, file = "frontend/data/texterna_lovecounts.json")

lovecounts_dt <- mello_data %>%
  mutate(title = paste0(artist, ": ", song_name, " (", year, ")")) %>%
  select(title, lovecount, id) %>%
  arrange(desc(lovecount)) %>%
  filter(lovecount > -1) %>%
  as.matrix()
json <- jsonlite::toJSON(list(data = lovecounts_dt), pretty = TRUE)
cat(json, file = "frontend/data/texterna_lovecounts_datatables_LH.json")


json <- jsonlite::toJSON(
  list(love_words = lovewords_phrases),
  pretty = TRUE
)
cat(json, file = "frontend/data/love_words.json")


## New cool scatter plot data
json <- jsonlite::toJSON(
  list(
    data = scatter_data %>%
      select(id, lovecount, godcount, partycount, seasoncount,
             sent_score, year, y, x, r, artist, song_name) %>% 
      mutate(first_letter = str_sub(song_name, 1, 1))
  ),
  pretty = TRUE
)
cat(json, file = "frontend/data/texterna_allcounts.json")



## Låtarna ---- 
# Tempo
json <- jsonlite::toJSON(
  list(
    tempos = data_frame(tempo = seq(75, 195, 5)) %>% 
    left_join(
      wl %>% 
        filter(winner == 1) %>% 
        mutate(tempo = round(echonest_tempo) %/% 5 * 5) %>%
        group_by(tempo) %>%
        dplyr::summarise(winners = length(tempo))
    ) %>%
    left_join(
      wl %>% 
        filter(winner == 0) %>% 
        mutate(tempo = round(echonest_tempo) %/% 5 * 5) %>%
        group_by(tempo) %>%
        dplyr::summarise(losers = length(tempo))
    ) %>%
    mutate(
      winners = ifelse(is.na(winners), 0, winners),
      losers = ifelse(is.na(losers), 0, losers)
    )
    ),
  pretty = TRUE
)

cat(json, file = "frontend/data/songs_tempo.json")

# Sentiment
json <- jsonlite::toJSON(
  data_frame(sentiment = seq(-80, 120, 10)) %>% 
    left_join(
      wl %>%
        filter(winner == 1) %>% 
        mutate(sentiment = sent_score %/% 10 * 10) %>%
        group_by(sentiment) %>%
        dplyr::summarise(winners = length(sentiment))
      ) %>% 
    left_join(
      wl %>%
        filter(winner == 0) %>% 
        mutate(sentiment = sent_score %/% 10 * 10) %>%
        group_by(sentiment) %>%
        dplyr::summarise(losers = length(sentiment))
    ) %>% 
    mutate(
      winners = ifelse(is.na(winners), 0, winners),
      losers = ifelse(is.na(losers), 0, losers)
    )
  ,
  pretty = TRUE
)

cat(json, file = "frontend/data/songs_sentiment.json")

# Språk
json <- jsonlite::toJSON(
  wl %>%
    filter(winner == 1) %>% 
    group_by(language) %>%
    dplyr::summarise(winners = length(language)) %>% 
    left_join(
      wl %>%
        filter(winner == 0) %>% 
        group_by(language) %>%
        dplyr::summarise(losers = length(language))
    ) %>% 
    mutate(language = ifelse(language == "english", "Engelska", "Svenska")),
  pretty = TRUE
)

cat(json, file = "frontend/data/songs_language.json")

# Word counts
json <- jsonlite::toJSON(
  data_frame(words = seq(45, 270, 5)) %>% 
    left_join(
      wl %>%
        filter(winner == 1) %>% 
        mutate(unique_words = unique_words %/% 5 * 5,
               total_words = total_words %/% 5 * 5) %>%
        group_by(words) %>%
        dplyr::summarise(winners = length(words))
    ) %>% 
    left_join(
      wl %>%
        filter(winner == 0) %>% 
        mutate(unique_words = unique_words %/% 5 * 5,
               total_words = total_words %/% 5 * 5) %>%
        group_by(words) %>%
        dplyr::summarise(losers = length(words))
    ) %>% 
    mutate(
      winners = ifelse(is.na(winners), 0, winners),
      losers = ifelse(is.na(losers), 0, losers)
    )
  ,
  pretty = TRUE
)

cat(json, file = "frontend/data/songs_words.json")

json <- jsonlite::toJSON(
  list(
    categories = c("Förlorare", "Vinnare") %>% rev(),
    unique_mean = (wl %>% group_by(winner) %>% summarise(m = mean(unique_words)))[['m']] %>% rev(),
    loudness_mean = (wl %>% group_by(winner) %>% summarise(l = mean(echonest_loudness)))[['l']] %>% rev()
  ),
  pretty = TRUE
)

cat(json, file = "frontend/data/songs_words.json")

wl %>%
  filter(winner == 1) %>% 
  group_by(language) %>%
  dplyr::summarise(winners = length(language)) %>% 
  left_join(
    wl %>%
      filter(winner == 0) %>% 
      group_by(language) %>%
      dplyr::summarise(losers = length(language))
  ) %>% 
  mutate(language = ifelse(language == "english", "Engelska", "Svenska"))



  
  



