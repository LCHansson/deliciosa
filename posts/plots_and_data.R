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
ggsave("posts/texterna_loveprops.png")

json <- toJSON(
  as.list(table(mello_data$lovebins)),
  pretty = TRUE)
cat(json, file = "posts/texterna_loveprops.json")



ggplot(plotdata_texter, aes(x = wordfac, y = freqs)) +
  geom_bar(stat = "identity", fill = "#17ACD2") +
  geom_text(aes(y = freqs, label = words, hjust = -0.2)) +
  coord_flip() +
  theme_tufte() +
  theme(axis.text.y = element_blank(), axis.ticks.y = element_blank(),
        axis.title.y = element_blank(), axis.title.x = element_blank()) +
  ylim(0, 900)
ggsave("posts/texterna_wordfreqs.png")

json <- toJSON(
  plotdata_texter %>% select(-wordfac),
  pretty = TRUE)
cat(json, file = "posts/texterna_wordfreqs.json")


