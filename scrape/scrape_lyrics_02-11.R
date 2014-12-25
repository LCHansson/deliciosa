
## Libraries ----
library(stringr)
library(rvest)
library(jsonlite)

## Scraping lyric links data ----
lyrics_url <- "http://artists.letssingit.com/melodifestivalen-olcr2/lyrics"

# Get song links
song_list <- list()

webpage <- html(lyrics_url)

song_nodes <- webpage %>%
  html_nodes("#sortme") %>%
  html_node("tbody") %>%
  html_nodes("tr") %>%
  html_node("td")

song_names <- song_nodes %>%
  html_attr("data-sort-value") %>%
  tolower() %>%
  str_replace_all("[\\?\\!]$", "")

# Due to the DOM structure, we have to find artist names by substracting song
# titles and the " lyrics" substring from the <td> content
song_artists <- song_nodes %>%
  sapply(function(node) {
    raw_node <- node %>% html_node("b")
    raw_string <- raw_node %>% html_text()
    raw_title <- raw_node %>% html_node("b") %>% html_text()
    
    artist <- gsub(raw_title, "", raw_string, fixed = TRUE)
    artist
  })

song_links <- song_nodes %>%
  html_nodes("a") %>%
  html_attr("href")

song_link_db <- data_frame(
  song_name = song_names,
  song_artist = song_artists,
  song_link = song_links
)

# Individual title love
song_link_db[song_link_db$song_name %in% c(
  "bye,bye",
  "clubbin'",
  "déjà vu",
  "date - det innersta rummet",
  "långt bortom tid och rum",
  "idag & imorgon",
  "i got u (feat.the topaz sound and red fox)",
  "make me no. 1",
  "not a sinner nor a saint",
  "rockin' the ride",
  "annika ljungberg - sail away",
  "den förste banan",
  "queen",
  "the saviour",
  "tick  tock",
  "t.k.o. (knock you out)",
  "trendy discotheque"
),]$song_name <- c(
  "bye, bye",
  "clubbin",
  "deja vû",
  "det innersta rummet",
  "långt bort om tid och rum",
  "i dag & i morgon",
  "i got u",
  "make me no 1",
  "not a sinner, nor a saint",
  "rockin’ the ride",
  "sail away",
  "sean den förste banan",
  "the queen",
  "the saviour (il salvatore)",
  "tick tock",
  "tko (knock you out)",
  "trendy discoteque"
)

song_link_db[song_link_db$song_artist == "Maria Benhajji",]$song_artist <- "Maria BenHajji"

# Merge to data frame
save(song_link_db, file = "data/song_link_db.Rdata")


## Merge with participants data set ----
source("data//load_participants.R")

# Create clean merge column
participants <- participants %>%
  mutate(song_name = tolower(str_replace_all(song, "[\\?\\!]$", ""))) %>%
  group_by(song_name) %>%
  mutate(num_duplicates = n())

# Warn if there are duplicate titles
if (length(participants$song_name) != length(unique(participants$song_name))) {
  warning("There are duplicate song titles! This might corrupt the lyrics dataset.")
}

# Join with song_lyrics_db
participants <- participants %>%
  left_join(song_link_db, copy = TRUE) %>%
  # Where there are duplicates, keep only the rows where
  # the artist info from both data sets is the same
  filter(
    num_duplicates == 1 |
      num_duplicates == 2 & artist == song_artist
  ) %>%
  # Remove intermediary dupicate marker
  select(-num_duplicates)

# Intermediate save
save(participants, file="data/participants_with_links.Rdata")

# Cleanup
rm(song_nodes, song_names, song_artists, song_links, song_list, base_url, webpage)

## Scrape lyrics data ----
session <- html_session(lyrics_url)

lyrics_list <- list()

# Only look at lyrics between 2002 and 2011 (Lumi will do the latest years)
participants_02_11 <- participants %>% filter(year < 2012)

# Find lyrics
for (rownum in 1:nrow(participants_02_11)) {
  song <- participants_02_11[rownum, "song_name"][[1]]
  artist <- participants_02_11[rownum, "artist"][[1]]
  lyriclink <- participants_02_11[rownum, "song_link"][[1]]
  
  if(is.na(lyriclink)) next()
  
  cat("Following link: ", lyriclink, "...\n")
  lyricpage <- session %>% jump_to(lyriclink) %>% html()
  
  lyrics <- lyricpage %>%
    html_node("#lyrics") %>%
    html_text()
  
  if (str_detect(lyrics, "^Unfortunately we don't have the lyrics of this song"))
    lyrics <- "null"
  
  participants_02_11$lyrics[[rownum]] <- lyrics
  
  lyrics_list[[rownum]] <- list(
    artist = artist,
    song = song,
    url = lyriclink,
    lyrics = lyrics
  )
}

## Analytical munging ----
# Guess language
# Analysis
# table(textcat(participants_02_11$lyrics))
# for (i in which(!textcat(participants_02_11$lyrics) %in% c("swedish", "english", "scots"))) {
# # for (i in 1:30) {
#   rows <- paste((str_split(participants_02_11$lyrics[i], "\n")[[1]][1:4]), collapse="\n")
#   lang <- textcat(participants_02_11$lyrics[i])
#   
#   cat("Text:\n", rows, "\n")
#   cat("Language: ", lang, "\n")
#   cat("*******************************\n\n")
# }
# table(participants_02_11$language)


# Guess language and save it to the participants data set
participants_02_11$language <- textcat(participants_02_11$lyrics)
participants_02_11[participants_02_11$language %in% c("scots", "middle_frisian", "french"),]$language <- "english"

# Save the lyrics separately
lyrics_json <- jsonlite::toJSON(lyrics_list, pretty = TRUE)
cat(lyrics_json, file = "data/lyrics.json")

# Save lyrics paired together with the songs
participant_db_json <- jsonlite::toJSON(participants_02_11, pretty = TRUE)
cat(participant_db_json, file = "data/participants_with_lyrics.json")

## TODO:
#' - Define JSON structure with the entire dataset
#' - Save everything to a mongoDB database

