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

for (yr in years) {
  cat(sprintf("Parsing participant JSON for %s... ", yr))
  participants_df <- sprintf("./data/history_participants/Melodifestivalen_%s.json", yr) %>%
    readLines(encoding = "UTF-8") %>%
    jsonlite::fromJSON() %>%
    tbl_df() %>%
    mutate(year = yr)
  cat(sprintf("found %s participants\n", nrow(participants_df)))
  
  cat(sprintf("Parsing finals JSON for %s... ", yr))
  finals_df <- sprintf("./data/history_participants//Melodifestivalen_%s_result.json", yr) %>%
    readLines(encoding = "UTF-8") %>% 
    jsonlite::fromJSON() %>%
    tbl_df()
  cat(sprintf("found %s finalists\n", nrow(finals_df)))
  
  participants_list[[length(participants_list) + 1]] <-  participants_df %>% left_join(finals_df)
}

# Merge data
participants <- rbind_all(participants_list)

# Check data integrity
# participants %>% group_by(year) %>% mutate(finalist = !is.na(final_place)) %>% summarise(finalists = sum(finalist))

# Cleanup
rm(participants_df, finals_df, yr, participants_list)

