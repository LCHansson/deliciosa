
## Libraries ----
library(stringr)
library(rvest)


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
  )


# Cleanup
rm(song_nodes, song_names, song_artists, song_links, song_list, base_url, webpage)

## Scrape lyrics data ----
test_data <- participants[1,]

for (lyriclink in participants$song_link) {
  cat("Following link: ", lyriclink, "...\n")
  lyricpage <- follow_link(lyriclink)
}

## TODO:
#' - Follow links to song titles and scrape text
#' - Define JSON structure with the entire dataset
#' - Save everything to a mongoDB database
#'  
