## Libraries ----
library("dplyr")
library("jsonlite")

## Data ---- 
# Data: "mello_data" from load(".RData") <--

## Lyrics ----
lyrics_export <- mello_data %>% 
  select(id, artist, year, song_name, lyrics, lyrics_cleaned)

# JSON
json <- jsonlite::toJSON(
  lyrics_export,
  pretty = TRUE
)
cat(json, file = "mellodata_repo/texterna.json")

# CSV
write.csv2(lyrics_export, "mellodata_repo/texterna.csv", row.names = FALSE,
           fileEncoding = "UTF-8", qmethod = "escape")
