## Yearly statistics for Mello data ##

## Libraries ----
library(dplyr)

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
    finalists_with_language = sum(final_jury_points > -1 & language != "")
  )

View(yearly_mello)
