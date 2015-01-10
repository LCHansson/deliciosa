## Variable selection using Random Forest ##

## Libraries ----
library("dplyr")
library("stringr")
library("tm")
library("ggplot2")
library("scales")
library("randomForest")

## Munge ----
# Data is fetched from analysis/read_json.R
feature_data <- mello_data %>%
  # Select potential predictor variables
  select(
    final_placing,
    final_tel_points,
    final_jury_points,
    final_start_position,
    echonest_mode,
    echonest_tempo,
    echonest_song_type,
    echonest_duration,
    echonest_time_signature,
    prel_votes1,
    prel_placing,
    prel_start_position,
    language,
    year
  ) %>%
  filter(echonest_mode > -1000)

feature_data <- feature_data %>%
  mutate(start_batch = cut(prel_start_position, c(0, 2, 6, 8)))


## Feature engineering ----

## Prediction ----
fit <- randomForest(
  prel_placing ~ echonest_mode +
    echonest_tempo +
    echonest_duration +
    echonest_time_signature +
    start_batch +
    as.factor(feature_data$language) +
    year,
  data = feature_data,
  ntree = 2000,
  importance = TRUE,
  na.action = na.roughfix)



