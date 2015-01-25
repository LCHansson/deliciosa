## Libraries ----
library(dplyr)
library(tidyr)
library(stringr)
library(ggplot2)

## Data ----
votes_data <- jsonlite::fromJSON(readLines("data/participants_with_lyrics.json")) %>%
  tbl_df() %>%
  select(-artist_wikilink, -song_link, -textmusic_wikilinks, -lyrics) %>%
  

## Tables ----
final_votes <- votes_data %>%
  # Remove non-finalists
  filter(!is.na(final_place)) %>%
  mutate(
    votes_round1 = as.integer(votes_round1),
    votes_round2 = as.integer(str_replace_all(votes_round2, " ", ""))
  ) %>%
  group_by(year) %>%
  mutate(
    votes_r1_rank = rank(votes_round1),
    votes_r2_rank = rank(votes_round2, ties.method = "first")
  )
