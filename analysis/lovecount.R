## Libraries ----
library("dplyr")
library("stringr")
library("ggplot2")
library("ggthemes")

## Data ----
# Data: "wl" from read_json.R

## Unique words ----
lyrics <- lapply(mello_data$lyrics_cleaned, function(lyric) {
  lyric <- gsub('[[:punct:]]', ' ', lyric)
  lyric <- gsub('[[:cntrl:]]', ' ', lyric)
  lyric <- gsub('\\d+', '', lyric)
  lyric <- tolower(lyric)
  # split into words
  word.list = str_split(lyric, '\\s+')
  # sometimes a list() is one level of hierarchy too much
  # words = unlist(word.list)
})

lovewords <- c(
  "kärlek", "kär", "kära", "käresta", "käraste",
  "kärleks", "kärleksfull", "kärleksfullt", "kärleksambassad", "kärleken", "kärlekens",
  "älska", "älskar", "älskad", "älskade", "älskas", "älskare", "älskarinna", "älskat",
  "älskling", "älskade", "älskats",
  "förälska", "förälskad", "förälskar", "förälskas", "förälskats",
  "love", "lover", "loved", "loves", "loving", "lovers",
  "romance", "romans", "romantik", "romantisk", "romantic", "romancer",
  "kvinnokarl", "womanizer", "womaniser", "casanova",
  "amour", "amourous", "amore", "amor", "taime",
  "hjärta", "heart", "hearts", "hjärtat", "hjärtan", "hjärtats",
  "sex", "sexual", "sexuell", "sexig", "sexy",
  # "själ", "soul",
  # Udda ord
  # "natten", "snälla", "varann", "varandra", "skilja",
  "baby","kiss"
)

lovecount <- sapply(lyrics, function(lyric) {
  if (length(lyric[[1]]) == 1) return(-1)
  matches <- match(lyric[[1]], lovewords) %>% is.na() %>% `!`() %>% sum()
  matches
})

lovefreqs <- sapply(lyrics, function(lyric) {
  loveindexes <- match(lyric[[1]], lovewords)
  loveindexes
}) %>% unlist()
lovefreqs <- lovefreqs[!is.na(lovefreqs)]
# table(lovewords[lovefreqs])
# plot(table(lovewords[lovefreqs]))

lovecount[order(lovecount)]

lovebins <- cut(lovecount, breaks = c(-Inf, -1, 0, 2, Inf), labels = c(NA, "Inte kärlek", "Lite kärlek", "Kärlek"))

mello_data$lovecount <- lovecount
mello_data$lovebins <- lovebins

## Word frequencies ----
plotdata_texter <- data_frame(
  freqs = as.vector(table(lovewords[lovefreqs])),
  words = table(lovewords[lovefreqs]) %>% names
)
plotdata_texter <- plotdata_texter %>%
  mutate(wordfac = factor(words, levels = words[order(freqs)]))


## What are the songs about that are *not* about love??
l <- mello_data %>% filter(lovecount == 0)


## Other topics ----

## Seasons
seasonwords <- c(
  # Svenska månader
  "januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti",
  "september", "oktober", "november", "december",
  # Engelska månader som inte heter samma sak på svenska
  "january", "february", "march", "may", "june", "july", "august", "october",
  # Säsonger
  "vinter", "sommar", "höst", "vintern", "våren", "sommaren", "hösten",
  "winter", "spring", "summer", "autumn", "springtime",
  # Tid
  "år", "year", "års", "years", "åratal", "året", "åren",
  "igår", "yesterday", "imorgon", "tomorrow",
  "vecka", "veckan", "veckor", "veckorna", "week", "weeks",
  "månad", "månaden", "månaderna", "månader", "month", "months",
  "eternity", "evighet", "evigheten", "evigheter", "evigt", "eviga"
)

seasonindexes <- sapply(lyrics, function(lyric) {
  indexes <- match(lyric[[1]], seasonwords)
  indexes
})

seasoncounts <- sapply(seasonindexes, function(matches) {
  num_matches <- length(matches[!is.na(matches)])
  num_matches
})

seasoncounts[order(seasoncounts)]

seasonfreqs <- seasonindexes %>% unlist()
seasonfreqs <- seasonfreqs[!is.na(seasonfreqs)]
# table(seasonwords[seasonfreqs])
# plot(table(seasonwords[seasonfreqs]))

seasonbins <- cut(seasoncounts, breaks = c(-Inf, 0, Inf), labels = c("Inte tid", "Tid"))
mello_data$seasoncount <- seasoncounts
mello_data$seasonbins <- seasonbins

## Religion
godwords <- c(
  "gud", "jesus", "christ", "kristus", "allah", "jehova", "lord", "gods",
  "halleluja", "hallelujah", "haleluja", "halelujah",
  "religion", "tro", "faith",
  "kyrka", "kyrkan", "church",
  "himmel", "heaven", "helvete", "hell", "helvetet", "himlisk", "heavenly", "helvetisk",
  "nirvana",
  "ängel", "änglar", "ängeln", "änglarna", "änglarnas", "änglars", "angel", "angels"
)

godindexes <- sapply(lyrics, function(lyric) {
  indexes <- match(lyric[[1]], godwords)
  indexes
})

godcounts <- sapply(godindexes, function(matches) {
  num_matches <- length(matches[!is.na(matches)])
  num_matches
})

godcounts[order(godcounts)]

godfreqs <- godindexes %>% unlist()
godfreqs <- godfreqs[!is.na(godfreqs)]
# table(godwords[godfreqs])
# plot(table(godwords[godfreqs]))

godbins <- cut(godcounts, breaks = c(-Inf, 0, Inf), labels = c("Ej religion", "Religion"))
mello_data$godcount <- godcounts
mello_data$godbins <- godbins


## Party och äventyr
partywords <- c(
  "fest", "festa", "festar", "fester", "festande",
  "party", "parties", "partying",
  "klubb", "club",
  "dans", "dance", "disco", "disko", "discotheque",
  "äventyr", "adventure", "adventures", "adventuring",
  "längta", "längtar", "longing", "long",
  "night", "nights", "natt", "nattliv", "natten", "nätter"
)

partyindexes <- sapply(lyrics, function(lyric) {
  indexes <- match(lyric[[1]], partywords)
  indexes
})

partycounts <- sapply(partyindexes, function(matches) {
  num_matches <- length(matches[!is.na(matches)])
  num_matches
})

partycounts[order(partycounts)]

partyfreqs <- partyindexes %>% unlist()
partyfreqs <- partyfreqs[!is.na(partyfreqs)]
# table(partywords[partyfreqs])
# plot(table(partywords[partyfreqs]))

partybins <- cut(partycounts, breaks = c(-Inf, 0, Inf), labels = c("Ingen fest", "Fest!"))
mello_data$partycount <- partycounts
mello_data$partybins <- partybins
