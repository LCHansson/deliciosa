library("httr")
library("jsonlite")
library("rvest")

## Authorisation ----
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

## Translations ----
base_url <- "http://api.microsofttranslator.com/v2/Http.svc/Translate?text="
# sample_text <- "Hej!\nHur är läget?"
# encoded_text <- URLencode(sample_text)

from = "sv"
to = "en"

translations <- list()
for (i in 1:nrow(mello_data)) {
  if (mello_data$language[i] != "swedish")
    next()
  
  # Lyric to translate
  lyric <- mello_data$lyrics_cleaned[i]
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
  translations[[mello_data$id[i]]] <- translation$content %>%
    rawToChar() %>%
    xml() %>%
    xml_node("string") %>%
    xml_text()
}


# Store translations in mello_data
for (i in 1:nrow(mello_data)) {
  if (!is.null(translations[[mello_data$id[i]]])) {
    mello_data$translated_lyric_cleaned[i] <- translations[[mello_data$id[i]]]
  } else {
    mello_data$translated_lyric_cleaned[i] <- mello_data$lyrics_cleaned[i]
  }
}





