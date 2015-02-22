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


## read csv with location data ----
artists.loc <- as.tbl(read.csv("data/artists.csv", stringsAsFactors = FALSE)) %>% filter(birthplace != "")

gender <- fromJSON("posts/tm/data/all_participants_data_2002_2014_gender_curated.json")


get_nearest_big_city <- function (latlon) {
  
  #test Örebro
  #latlon <- c(59.37791, 14.98793)
  
  stockholm <- c(18.0710935, 59.3251172)
  goteborg <- c(11.9670171, 57.7072326)
  malmo <- c(13.0001566, 55.6052931)
  
  lonlat <- latlon[c(2,1)]
  
  dist_sthlm <- distMeeus(lonlat, stockholm)
  dist_gb <- distMeeus(lonlat, goteborg)
  dist_mal <- distMeeus(lonlat, malmo)
  
  if (dist_sthlm <= dist_gb & dist_sthlm <= dist_mal) {
    return(list("Stockholm", dist_sthlm))
  } else if (dist_gb <= dist_mal) {
    return(list("Göteborg", dist_gb))
  } else {
    return(list("Malmö", dist_mal))
  }
  
}

# replace backslashes 
artists.loc$birth_osm <- str_replace_all(artists.loc$birth_osm, "\\\\", "")
artists.loc$res_osm <- str_replace_all(artists.loc$res_osm, "\\\\", "")
artists.loc$birthplace <- str_trim(artists.loc$birthplace)
artists.loc$residence <- str_trim(artists.loc$residence)

artists.loc$birth_json = rep(list(list()), nrow(artists.loc))
artists.loc$birth_lat = NA
artists.loc$birth_lon = NA
artists.loc$res_json = rep(list(list()), nrow(artists.loc))
artists.loc$res_lat = NA
artists.loc$res_lon = NA
artists.loc$gender = NA
artists.loc$nearest_birth_city = ""
artists.loc$nearest_birth_distance = NA
artists.loc$nearest_res_city = ""
artists.loc$nearest_res_distance = NA

for (i in 1:nrow(artists.loc)) {
  if (artists.loc$birth_osm[i] != "") {
    json <- fromJSON(artists.loc$birth_osm[i])
    artists.loc$birth_json[[i]] <- json
    artists.loc$birth_lat[i] = as.numeric(json$lat)
    artists.loc$birth_lon[i] = as.numeric(json$lon)
    nearest <- get_nearest_big_city(c(as.numeric(json$lat), as.numeric(json$lon)))
    artists.loc$nearest_birth_city[i] = nearest[[1]]
    artists.loc$nearest_birth_distance[i] = nearest[[2]]/1000
  }
  if (artists.loc$res_osm[i] != "") {
    json <- fromJSON(artists.loc$res_osm[i])
    artists.loc$res_json[[i]] <- json
    artists.loc$res_lat[i] = as.numeric(json$lat)
    artists.loc$res_lon[i] = as.numeric(json$lon)
    nearest <- get_nearest_big_city(c(as.numeric(json$lat), as.numeric(json$lon)))
    artists.loc$nearest_res_city[i] = nearest[[1]]
    artists.loc$nearest_res_distance[i] = nearest[[2]]/1000
  }
  if (artists.loc$band[i] == 0) {
    if (gender[[artists.loc$id[i]]]$artist_gender[1] == "F") {
      artists.loc$gender[i] = 1
    } else {
      artists.loc$gender[i] = 2
    }
    
  } else {
    artists.loc$gender[i] = 3
  }
}

## export artists with places to json ----
artists.export <- artists.loc %>% 
  filter(!is.na(birth_lat) | !is.na(res_lat)) %>% 
  select(id, artist, birthyear, birthplace, birth_lat, birth_lon, 
         residence, res_lat, res_lon, band, gender, 
         nearest_birth_city, nearest_birth_distance, 
         nearest_res_city, nearest_res_distance)



artists.export <- artists.export %>% 
  mutate(delta_lat = ifelse(!is.na(res_lat) & !is.na(birth_lat), 
                            res_lat - birth_lat, 0), 
         delta_lon = ifelse(!is.na(res_lon) & !is.na(birth_lon), 
                            res_lon - birth_lon, 0), 
         gender = as.numeric(as.factor(gender)), # M = 2, F = 1, bands = 3
         age = 2015 - as.numeric(birthyear)
         )


cat(toJSON(artists.export), file = "frontend/data/artists.json")



# features <- list()
# 
# for (i in 1:nrow(artists.export)) {
#   feature <- list(type = "Feature", 
#                   geometry = list(type = "Point", 
#                                   coordinates = c(as.numeric(artists.export[i, ]$birth_json[[1]]$lon), 
#                                                   as.numeric(artists.export[i, ]$birth_json[[1]]$lat))
#                                   ), 
#                   properties = list(title = artists.export[i, ]$artist, 
#                                     id = artists.export[i, ]$id,
#                                     birthyear = artists.export[i, ]$birthyear, 
#                                     place = "birth")
#                   )
#   features <- c(features, list(feature))
#   
#   feature <- list(type = "Feature", 
#                   geometry = list(type = "Point", 
#                                   coordinates = c(as.numeric(artists.export[i, ]$res_json[[1]]$lon), 
#                                                   as.numeric(artists.export[i, ]$res_json[[1]]$lat))
#                   ), 
#                   properties = list(title = artists.export[i, ]$artist, 
#                                     id = artists.export[i, ]$id,
#                                     birthyear = artists.export[i, ]$birthyear, 
#                                     place = "residence")
#   )
#   features <- c(features, list(feature))
#   
# }
# 
# export <- list(type = "FeatureCollection", features = features)

cat(RJSONIO::toJSON(export), file = "frontend/data/artists_locations.geojson")
