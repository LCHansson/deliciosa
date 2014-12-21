## Preprocessing ----
source("data//load_participants.R")

## Libraries ----
library(stringr)
library(rvest)

## Scraping base data ----
songs <- participants$song
# Warn if there are duplicate titles
if (length(songs) != length(unique(songs)))
  warning("There are duplicate song titles! This might corrupt the lyrics dataset.")

base_url <- "http://artists.letssingit.com/melodifestivalen-olcr2/lyrics"


# Get song links
song_list <- list()

webpage <- html(base_url)

song_nodes <- webpage %>%
  html_nodes("#sortme") %>%
  html_node("tbody") %>%
  html_nodes("tr") %>%
  html_node("td")

song_names <- song_nodes %>%
  html_attr("data-sort-value") %>%
  tolower()

# Due to the DOM, we have to find artist names by substracting song titles and
# the " lyrics" substring from the <td> content
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
  song_names,
  song_artists,
  song_links
)


# Merge to data frame
save(song_link_db, file = "data/song_link_db.Rdata")

## Get lyrics

