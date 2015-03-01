## Dependencies ----
source("data/get_echonest_data_15.R")

## Libraries ----
library("textcat")
library("httr")
library("jsonlite")
library("rvest")

## Language ----
mello15_all <- mello15_a_l_en

mello15_all <- mello15_all %>% 
  mutate(language = textcat(lyrics),
         language = ifelse(language == "scots", "english", language))

## Lyric cleaning ----
## Do we need this?

## Translation ----
## Authorisation
app_ID <- 20150208L
app_secret <- "allTheTranslationsForMelloAreAwesome"
scope <- "http://api.microsofttranslator.com"
grant_type <- "client_credentials"
token_access_uri <- "https://datamarket.accesscontrol.windows.net/v2/OAuth2-13"

access_token_json <- POST(
  token_access_uri,
  body = list(
    grant_type = grant_type,
    client_id = app_ID,
    client_secret = app_secret,
    scope = scope
  ),
  encode = "form"
)

token_content <- access_token_json$content %>% rawToChar() %>% fromJSON()

auth_token = paste("Bearer", token_content$access_token)

## API calls
base_url <- "http://api.microsofttranslator.com/v2/Http.svc/Translate?text="
# sample_text <- "Hej!\nHur är läget?"
# encoded_text <- URLencode(sample_text)

from = "sv"
to = "en"

translations <- list()
for (i in 1:nrow(mello15_all)) {
  if (mello15_all$language[i] != "swedish")
    next()
  
  # Lyric to translate
  lyric <- mello15_all$lyrics[i]
  encoded_lyric <- URLencode(lyric)
  
  # Call
  translate_call <- paste0(
    paste0(base_url, encoded_lyric),
    "&from=", from,
    "&to=", to
  )
  
  # Translation
  translation <- GET(translate_call, add_headers(Authorization = auth_token))
  
  # Raw text
  translations[[mello15_all$id[i]]] <- translation$content %>%
    rawToChar() %>%
    xml() %>%
    xml_node("string") %>%
    xml_text()
}


# Store translations in mello15_all
for (i in 1:nrow(mello15_all)) {
  if (!is.null(translations[[mello15_all$id[i]]])) {
    mello15_all$translated_lyric_cleaned[i] <- translations[[mello15_all$id[i]]]
  } else {
    mello15_all$translated_lyric_cleaned[i] <- mello15_all$lyrics[i]
  }
}


## Words and sentiment ----
lyrdata <- mello15_all %>%
  select(translated_lyric_cleaned, artist, id, language, song_name, year)


## Sentiment data ----
sentwords <- read.table(
  "data/sentiment_scores_en.txt",
  sep = "\t", col.names = c("word", "score")) %>% tbl_df()

scores = sapply(lyrdata$translated_lyric_cleaned, function(lyric, sentwords) {
  
  # clean up lyrics with R's regex-driven global substitute, gsub():
  lyric = gsub('[[:punct:]]', '', lyric)
  lyric = gsub('[[:cntrl:]]', ' ', lyric)
  lyric = gsub('\\d+', '', lyric)
  # and convert to lower case:
  lyric = tolower(lyric)
  
  # split into words. str_split is in the stringr package
  word.list = str_split(lyric, '\\s+')
  # sometimes a list() is one level of hierarchy too much
  words = unlist(word.list)
  
  matches <- match(words, sentwords$word)
  
  scores <- sentwords[matches[!is.na(matches)],]$score
  
  score <- sum(scores)
  
  return(score)
}, sentwords, USE.NAMES = FALSE)

lyrdata$sent_score <- scores
mello15_all$sent_score <- lyrdata$sent_score


## Save data ----
save(mello15_all, file = "data/mello15_all.Rdata")

json <- toJSON(mello15_all, pretty = TRUE)
cat(json, file = "data/mellodata_15.json")
