## Libraries ----
library("dplyr")
library("jsonlite")

## Get raw JSON ----
con <- file.path("./data/all_participants_all_data_2002_2014_2.json")
data <- fromJSON(con)

## Convert to data.frame ----
mello_data <- as_data_frame(data)

## only keep one row per artist ----
artists <- mello_data %>% select(id, artist, artist_wikilink) %>% group_by(artist) %>% filter(row_number() == 1)

## remove edit links ----
artists[grepl("&action=edit&redlink=1", artists$artist_wikilink), ]$artist_wikilink <- ""

## add variables 

artists <- artists %>% mutate(birthplace = "", residence = "", birthyear = "")


## export to csv ----
write.csv(artists, file = "data/artists_links.csv", row.names = FALSE)
