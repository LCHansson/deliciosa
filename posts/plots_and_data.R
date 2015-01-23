library("jsonlite")
library("ggplot2")

## Texterna ----
ggplot(mello_data, aes(x = factor(1), fill = factor(lovebins))) +
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

json <- RJSONIO::toJSON(
  table(mello_data$lovebins) %>% as.data.frame() %>% dplyr::rename(name = Var1, freq = Freq),
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
  plotdata_texter %>% select(-wordfac),
  pretty = TRUE)
cat(json, file = "posts/texterna/texterna_wordfreqs.json")


json <- toJSON(
  lyrdata %>% select(-lyrics_cleaned),
  pretty = TRUE)
cat(json, file = "frontend/data/texterna_peppodepp.json")


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
ggsave("posts/texterna_arstider.png")

json <- RJSONIO::toJSON(
  table(mello_data$seasonbins) %>% as.data.frame() %>% dplyr::rename(name = Var1, freq = Freq),
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

json <- RJSONIO::toJSON(
  table(mello_data$godbins) %>% as.data.frame() %>% dplyr::rename(name = Var1, freq = Freq),
  pretty = TRUE
) %>% cat
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
  table(mello_data$partybins) %>% as.data.frame() %>% dplyr::rename(name = Var1, freq = Freq),
  pretty = TRUE
)
cat(json, file = "frontend/data/texterna_aventyr.json")


json <- jsonlite::toJSON(
  mello_data %>% select(artist, song_name, year, lovecount, lyrics_cleaned, id) %>% arrange(desc(lovecount)) %>% filter(lovecount > -1),
  pretty = TRUE
)
cat(json, file = "frontend/data/texterna_lovecounts.json")
