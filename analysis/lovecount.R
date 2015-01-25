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
  "kärleks", "kärleksfull", "kärleksfullt", "kärleksambassad", "kärleken", "kärlekens", "kärlekssång",
  "älska", "älskar", "älskad", "älskade", "älskas", "älskare", "älskarinna", "älskat",
  "älskling", "älskade", "älskats",
  "förälska", "förälskad", "förälskar", "förälskas", "förälskats",
  "love", "lover", "loved", "loves", "loving", "lovers", "lovin",
  "romance", "romans", "romantik", "romantisk", "romantic", "romancer",
  "kvinnokarl", "womanizer", "womaniser", "casanova",
  "amour", "amourous", "amore", "amor", "taime", "quiero",
  "hjärta", "heart", "hearts", "hjärtat", "hjärtan", "hjärtats",
  "sex", "sexual", "sexuell", "sexig", "sexy",
  "själ", "soul",
  # Udda ord
  # "natten", "snälla", "varann", "varandra", "skilja",
  "baby","kiss", "skiljas", "kyss", "kyssa", "kyssas", "kyssas", "kysser", "kyssar",
  "attraktion", "addraherad", "attrahera", "attraction", "attraheras",
  "kissing", "kisses",
  "begär", "passionerad"
)

lovecount <- sapply(lyrics, function(lyric) {
  if (length(lyric[[1]]) == 1) return(-1)
  matches <- match(lyric[[1]], lovewords) %>% is.na() %>% `!`() %>% sum()
  matches
})

lovephrases <- c(
  "i miss you",
  # "bara du",
  "jag och du",
  "du och jag",
  "ha dig",
  "förlorat dig",
  "här för dig",
  "me and you",
  "jag tar dig",
  "ger dig allt",
  "right for each other",
  "lämna dig",
  "hålla dig",
  "wants you",
  "minnen utav dig"
)

for (i in 1:nrow(mello_data)) {
  if (lovecount[i] < 0) {
    phrase_matches <- 0
  } else {
    phrase_matches <- str_count(mello_data$lyrics_cleaned[i] %>% tolower(), lovephrases) %>% sum()
  }
  lovecount[i] <- lovecount[i] + phrase_matches
  # if(phrase_matches > 5) cat(i, phrase_matches, "\n")
}

lovewords_phrases <- append(lovewords, lovephrases)

lovefreqs <- sapply(lyrics, function(lyric) {
  loveindexes <- match(lyric[[1]], lovewords)
  loveindexes
}) %>% unlist()
lovefreqs <- lovefreqs[!is.na(lovefreqs)]
# table(lovewords[lovefreqs])
# plot(table(lovewords[lovefreqs]))

lovecount[order(lovecount)]

lovebins <- cut(lovecount, breaks = c(-Inf, -1, 0, 2, Inf), labels = c(NA, "Inte kärlek", "Lite kärlek", "Mycket kärlek"))
table(lovebins)
table(lovebins)[2]/(416-25)

mello_data$lovecount <- lovecount
mello_data$lovebins <- lovebins

## Word frequencies ----
lovecategories <- list(
  "kärlek" = c("kärlek", "kärleks", "kärleken", "kärlekens"),
  "kär" = c("kär", "kära"),
  "käresta" = c("käresta", "käraste"),
  "kärleksfull" = c("kärleksfull", "kärleksfullt"),
  "kärleksambassad" = c("kärleksambassad"),
  "kärlekssång" = c("kärlekssång"),
  "älska" = c("älska", "älskar", "älskad", "älskade", "älskas", "älskat", "älskade", "älskats"),
  "älskare" = c("älskare", "älskarinna"),
  "älskling" = c("älskling"),
  "förälskad" = c("förälska", "förälskad", "förälskar", "förälskas", "förälskats"),
  "love" = c("love", "lover", "loved", "loves", "loving", "lovers", "lovin"),
  "romance" = c("romance", "romantic", "romancer"),
  "romans" = c("romans", "romantik", "romantisk"),
  "kvinnokarl" = c("kvinnokarl"),
  "womaniser" = c("womanizer", "womaniser"),
  "casanova" = c("casanova"),
  "amour" = c("amour", "amourous", "amore", "amor"),
  "t'aime" = c("taime"), 
  "quiero" = c("quiero"),
  "hjärta" = c("hjärta", "hjärtat", "hjärtan", "hjärtats"),
  "heart" = c("heart", "hearts"),
  "sex" = c("sex", "sexual", "sexuell", "sexig", "sexy"),
  "själ" = c("själ"),
  "soul" = c("soul"),
  # Udda ord
  "baby" = c("baby"),
  "kiss" = c("kiss", "kissing", "kisses"),
  "skiljas" = c("skiljas"), 
  "kyss" = c("kyss", "kyssa", "kyssas", "kyssas", "kysser", "kyssar"),
  "attraktion" = c("attraktion", "attraherad", "attrahera", "attraheras"),
  "attraction" = c("attraction"),
  "begär" = c("begär", "begära"),
  "passionerad" = c("passionerad")
)
lovecatmatches <- sapply(lovecategories, function(category) { lovewords[lovefreqs] %in% category %>% sum})
plotdata_texter <- data_frame(
  freqs = lovecatmatches,
  words = names(lovecatmatches)
) %>% arrange(desc(freqs))
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

