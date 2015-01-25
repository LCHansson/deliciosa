score.sentiment = function(lyrics, sentwords) {
  library("stringr")
  # we got a vector of lyrics. plyr will handle a list
  # or a vector as an "l" for us
  # we want a simple array ("a") of scores back, so we use
  # "l" + "a" + "ply" = "laply":
  scores = sapply(lyrics, function(lyric, sentwords) {
    
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
  }, sentwords)
  
  return(scores)
}
