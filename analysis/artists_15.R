## Libraries ----
library(fastread)
library(dplyr)
library(stringr)

## Data ----
artist_data <- read.csv("data/artists.csv") %>% tbl_df()
artists15 <- artist_data %>% filter(str_detect(id, "2015"))
