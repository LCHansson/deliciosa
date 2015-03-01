## Libraries ----
library("httr")
library("jsonlite")
library("dplyr")

## Dependencies ----
source("scrape/R/lyrics_15.R")
mello15_a_l_en <- mello15_a_l

## Run variables ----
api_key <- "9YUIT9IOBZSZHWJGD"


## Construct API call
# artist <- "Ace Wilder"
# song <- "Busy Doin' Nothin'"

buckets <- c("audio_summary", "artist_location", "song_type", "song_currency", "tracks")

# api_call <- paste(
#   "http://developer.echonest.com/api/v4/song/search?",
#   sprintf("api_key=%s", api_key),
#   sprintf("format=%s","json"),
#   sprintf("results=%d",1),
#   sprintf("artist=%s", URLencode(artist)),
#   sprintf("title=%s", URLencode(song)),
#   sprintf("bucket=id:7digital-US"),
#   paste(sprintf("bucket=%s", buckets), collapse="&"),
#   sep = "&"
# )
# rawdata <- GET(api_call)
# metadata <- fromJSON(content(rawdata, as = "text"))

metadatalist <- list()
songnum <- 0
for (i in 1:nrow(mello15_a_l_en)) {
# for (i in 1:5) {
  artist <- mello15_a_l_en$artist[i]
  song <- mello15_a_l_en$song_name[i]
  id <- mello15_a_l_en$id[i]
  
  cat("**************************\nGetting data for", song, "by", artist, "with id", id, "\n")
  
  api_call <- paste(
    "http://developer.echonest.com/api/v4/song/search?",
    sprintf("api_key=%s", api_key),
    sprintf("format=%s","json"),
    sprintf("results=%d",1),
    sprintf("artist=%s", URLencode(artist)),
    sprintf("title=%s", URLencode(song)),
    sprintf("bucket=id:7digital-US"),
    paste(sprintf("bucket=%s", buckets), collapse="&"),
    sep = "&"
  )
  
  cat("API call: \n", api_call, "\n\n")
  
  rawdata <- GET(api_call)
  metadata <- fromJSON(content(rawdata, as = "text"))
  
  if (length(metadata$response$songs) == 0) {
    message("Couldn't find a matching song. Check the spelling!\n")
  } else {
    songnum <- songnum + 1
    metadata$response$external_id <- id
    metadatalist[songnum] <- metadata
  }
  
  Sys.sleep(3.5)
}


## Write data to mello15_a_l_en
mello15_a_l_en$echonest_acousticness <- character(1)
mello15_a_l_en$echonest_artist_id <- character(1)
mello15_a_l_en$echonest_audio_md5 <- character(1)
mello15_a_l_en$echonest_danceability <- character(1)
mello15_a_l_en$echonest_duration <- character(1)
mello15_a_l_en$echonest_energy <- character(1)
mello15_a_l_en$echonest_instrumentalness <- character(1)
mello15_a_l_en$echonest_liveness <- character(1)
mello15_a_l_en$echonest_loudness <- character(1)
mello15_a_l_en$echonest_mode <- character(1)
mello15_a_l_en$echonest_song_currency <- character(1)
mello15_a_l_en$echonest_speechiness <- character(1)
mello15_a_l_en$echonest_tempo <- character(1)
mello15_a_l_en$echonest_time_signature <- character(1)
mello15_a_l_en$echonest_valence <- character(1)

for (j in seq_along(metadatalist)) {
  el <- metadatalist[[j]]
  
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_acousticness <- echonest_acousticness <- el$songs$audio_summary$acousticness
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_artist_id <- echonest_artist_id <- el$songs$artist_id
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_audio_md5 <- echonest_audio_md5 <- el$songs$audio_md5
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_danceability <- echonest_danceability <- el$songs$audio_summary$danceability
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_duration <- echonest_duration <- el$songs$audio_summary$duration
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_energy <- echonest_energy <- el$songs$audio_summary$energy
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_instrumentalness <- echonest_instrumentalness <- el$songs$audio_summary$instrumentalness
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_liveness <- echonest_liveness <- el$songs$audio_summary$liveness
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_loudness <- echonest_loudness <- el$songs$audio_summary$loudness
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_mode <- echonest_mode <- el$songs$audio_summary$mode
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_song_currency <- echonest_song_currency <- el$songs$song_currency
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_speechiness <- echonest_speechiness <- el$songs$audio_summary$speechiness
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_tempo <- echonest_tempo <- el$songs$audio_summary$tempo
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_time_signature <- echonest_time_signature <- el$songs$audio_summary$time_signature
  mello15_a_l_en[mello15_a_l_en$id == el$external_id,]$echonest_valence <- echonest_valence <- el$songs$audio_summary$valence
}

## Write files ----
save(metadatalist, file="metadatalist15.Rdata")
save(mello15_a_l_en, file = "data/mello15_a_l_en_en.Rdata")

json <- toJSON(mello15_a_l_en, pretty = TRUE)
cat(json, file = "data/mellodata_15.json")







