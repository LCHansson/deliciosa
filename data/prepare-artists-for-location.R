## Libraries ----
library("dplyr")
library("jsonlite")
library(stringr)
library(geosphere)

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


## 2015 -----
artists_2015 <- fromJSON("data/mellodata_15.json") %>% 
  select(id, artist, artist_wikilink) %>% 
  mutate(birthplace = "", birth_osm = "", residence = "", res_osm = "", birthyear = "", band = 0)
write.csv(artists_2015, file = "data/artists_2015_links.csv", row.names = FALSE)
