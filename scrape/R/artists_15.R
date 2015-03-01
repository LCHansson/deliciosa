## Libraries ----

library(rvest)
library(dplyr)
library(tidyr)

## Scrape -----

base_url <- "http://sv.wikipedia.org/wiki/Melodifestivalen_2015"

doc <- html(base_url)

# Hard coded table extraction - don't do this at home, kids!
tables <- doc %>% 
  html_nodes(".sortable")
tables <- tables[1:4]

# Column extraction
mello15 <- data_frame(
  id = character(),
  prel_round = integer(),
  artist = character(),
  song_name = character(),
  tm = character(),
  year = integer(),
  prel_placing = integer(),
  prel_remark = character(),
  artist_wikilink = character()
)

prel_round <- 0L
song_data <- sapply(tables, function(tab) {
  rows <- (tab %>% html_nodes("tr"))[2:8]
  prel_round <<- prel_round + 1
  
  start_position <<- 0
  song_data <- sapply(rows, function(row) {
    start_position <<- start_position + 1
    data <- row %>% html_nodes("td")
    
    artist <- data[2] %>% html_text()
    artist_wikilink <- data[2] %>% html_nodes('a') %>% html_attr("href") %>% paste0("http://sv.wikipedia.org", ., collapse="; ")
    song_name <- data[3] %>% html_text()
    tm <- data[4] %>% html_text()
    prel_placing <- data[8] %>% html_text()
    remark <- data[9] %>% html_text()
    
    song_row <- list(
      prel_round = prel_round,
      artist = artist,
      artist_wikilink = artist_wikilink,
      song_name = song_name,
      tm = tm,
      year = 2015L,
      start_position = start_position,
      prel_placing = prel_placing %>% as.integer,
      prel_remark = remark
    )
    song_row$id <- paste(song_row$year, song_row$prel_round, song_row$start_position, sep="_")
    
    #     song_row_bk <<- song_row
    #     cat(paste(song_row, collapse="\n"))
    #     cat("\n\n")
    
    mello15 <<- mello15 %>% 
      bind_rows(as_data_frame(song_row))
  })
})

## Manual corrections ----
pattern = c("Behrang Miri feat.Victor Crone", "Rickard Söderberg &Elize Ryd", "Marie Bergman &Sanne Salomonsen")
names(pattern) <- c("Behrang Miri feat. Victor Crone", "Elize Ryd & Rickard Söderberg", "Marie Bergman & Sanne Salomonsen")

sapply(pattern, function(char) {
  mello15[mello15$artist == char,]$artist <<- names(pattern)[pattern == char]
})

## Save data ----
save(mello15, file="data/mello15.Rdata")


