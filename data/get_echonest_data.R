## Libraries ----
library("httr")
library("jsonlite")
library("dplyr")

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
for (i in 1:nrow(mello_data)) {
# for (i in 1:5) {
  artist <- mello_data$artist[i]
  song <- mello_data$song_name[i]
  id <- mello_data$id[i]
  
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


## Write files ----
save(metadatalist, file="metadatalist.Rdata")

json <- toJSON(metadatalist, pretty = TRUE)
cat(json, file = "data/echonest_metadata.json")
