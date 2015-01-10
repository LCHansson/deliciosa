## Yearly statistics for Mello data ##

## Libraries ----
library("dplyr")
library("ggplot2")

# mello_data is fetched from analysis/read_json.R
mello_data <- tbl_df(mello_data)

# Yearly metastatistics
yearly_mello <- mello_data %>%
  group_by(year) %>%
  summarise(
    num_songs = n(),
    has_language = sum(language != ""),
    has_lyrics = sum(lyrics != ""),
    is_english = sum(language == "english"),
    num_finalists = sum(final_jury_points > -1),
    finalists_with_language = sum(final_jury_points > -1 & language != ""),
    finalists_is_english = sum(final_jury_points > -1 & language == "english")
  )


## Graphics ----

# The number of English songs is not significantly increasing...
# but the number of FINALISTS in English is monotonously increasing!!
ggplot(yearly_mello, aes(x = year, y = is_english)) +
  geom_bar(stat = "identity") + 
  # geom_bar(stat = "identity", aes(y = finalists_is_english)) +
  labs(title = "Låtar på engelska i svenska Mello per år")
