## Libraries ----
library("data.table")
library("dplyr")
library("jsonlite")
library("textcat")

## Get raw JSON ----
con <- file.path("./data/all_participants_all_data_2002_2014_2.json")
data <- fromJSON(con)

## Convert to data.frame ----
mello_data <- as_data_frame(data)

## Munge ---
## Language for songs without language in the database (i.e. 2012-2014 songs)
mello_data <- tbl_dt(mello_data)
mello_data[
  language == "" & lyrics != "",
  language := textcat(lyrics)
  ]
mello_data[language == "scots", language := "english"]
# Inspect results
# mello_data$language %>% table
mello_data <- tbl_df(mello_data)

## Get winners/losers JSON ----
losers <- file.path("data/losers.json")
winners <- file.path("data/winners.json")
wl <- bind_rows(
  fromJSON(losers) %>% mutate(winner = 0),
  fromJSON(winners) %>% mutate(winner = 1)
)
