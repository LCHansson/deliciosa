## Libraries ----
library("dplyr")
library("jsonlite")
library(stringr)

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


## read csv with location data ----
artists.loc <- as.tbl(read.csv("data/artists.csv", stringsAsFactors = FALSE)) %>% filter(birthplace != "")

# replace backslashes 
artists.loc$birth_osm <- str_replace_all(artists.loc$birth_osm, "\\\\", "")
artists.loc$res_osm <- str_replace_all(artists.loc$res_osm, "\\\\", "")

artists.loc$birth_json = rep(list(list()), nrow(artists.loc))
artists.loc$birth_lat = NA
artists.loc$birth_lon = NA
artists.loc$res_json = rep(list(list()), nrow(artists.loc))
artists.loc$res_lat = NA
artists.loc$res_lon = NA

for (i in 1:nrow(artists.loc)) {
  if (artists.loc$birth_osm[i] != "") {
    json <- fromJSON(artists.loc$birth_osm[i])
    artists.loc$birth_json[[i]] <- json
    artists.loc$birth_lat[i] = json$lat
    artists.loc$birth_lon[i] = json$lon
  }
  if (artists.loc$res_osm[i] != "") {
    json <- fromJSON(artists.loc$res_osm[i])
    artists.loc$res_json[[i]] <- json
    artists.loc$res_lat[i] = json$lat
    artists.loc$res_lon[i] = json$lon
  }
}

## export artists with places to json ----
artists.export <- artists.loc %>% filter(!is.na(birth_lat) & !is.na(res_lat)) %>% select(id, artist, birth_json, res_json, birthyear)

features <- list()

for (i in 1:nrow(artists.export)) {
  feature <- list(type = "Feature", 
                  geometry = list(type = "Point", 
                                  coordinates = c(as.numeric(artists.export[i, ]$birth_json[[1]]$lon), 
                                                  as.numeric(artists.export[i, ]$birth_json[[1]]$lat))
                                  ), 
                  properties = list(title = artists.export[i, ]$artist, 
                                    id = artists.export[i, ]$id,
                                    birthyear = artists.export[i, ]$birthyear, 
                                    place = "birth")
                  )
  features <- c(features, list(feature))
  
  feature <- list(type = "Feature", 
                  geometry = list(type = "Point", 
                                  coordinates = c(as.numeric(artists.export[i, ]$res_json[[1]]$lon), 
                                                  as.numeric(artists.export[i, ]$res_json[[1]]$lat))
                  ), 
                  properties = list(title = artists.export[i, ]$artist, 
                                    id = artists.export[i, ]$id,
                                    birthyear = artists.export[i, ]$birthyear, 
                                    place = "residence")
  )
  features <- c(features, list(feature))
  
}

export <- list(type = "FeatureCollection", features = features)

cat(RJSONIO::toJSON(export), file = "frontend/data/artists_locations.geojson")
