## Participant analysis ----

## Libraries ----
library(dplyr)
library(tidyr)
library(jsonlite)
library(digest)

## Funcs ----
setEncoding <- function(data, ..., encoding = "UTF-8") {
  .dots <- c(...)
  for (variable in .dots) {
    Encoding(data[[variable]]) <- encoding
  }
  
  data
}

## Data ----
years <- 2002:2014
participants_list <- list()

for (year in years) {
  participants_df <- sprintf("./data/history_participants/Melodifestivalen_%s.json", year) %>%
    readLines(encoding = "UTF-8") %>%
    fromJSON() %>%
    tbl_df %>%
    mutate(year = year)
  
  finals_df <- sprintf("./data/history_participants//Melodifestivalen_%s_result.json", year) %>%
    readLines(encoding = "UTF-8") %>% 
    fromJSON %>%
    tbl_df
  
  participants_list[[length(participants_list) + 1]] <-  participants %>% left_join(finals)
}

participants <- rbind_all(participants_list)

