## Write JSON with language for 2012-2014 participants ##

## Libraries ----
library(dplyr)
library(jsonlite)

## Munge ----
# Data is fetched from analysis/read_json.R
lyrics_1214 <- mello_data %>%
  filter(year %in% 2012:2014) %>%
  select(id, language)

## Write ----
json <- jsonlite::stream_out(lyrics_1214, con=file("data/languages_1214.json"))
