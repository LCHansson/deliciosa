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
  cat(sprintf("Parsing participant JSON for %s... ", year))
  participants_df <- sprintf("./data/history_participants/Melodifestivalen_%s.json", year) %>%
    readLines(encoding = "UTF-8") %>%
    fromJSON() %>%
    tbl_df %>%
    mutate(year = year)
  cat(sprintf("found %s participants\n", nrow(participants_df)))
  
  cat(sprintf("Parsing finals JSON for %s... ", year))
  finals_df <- sprintf("./data/history_participants//Melodifestivalen_%s_result.json", year) %>%
    readLines(encoding = "UTF-8") %>% 
    fromJSON %>%
    tbl_df
  cat(sprintf("found %s finalists\n", nrow(finals_df)))
  
  participants_list[[length(participants_list) + 1]] <-  participants_df %>% left_join(finals_df)
}

# Merge data
participants <- rbind_all(participants_list)

# Cleanup
rm(participants_df, finals_df, year, participants_list)

