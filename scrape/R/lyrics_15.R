library(stringr)

# Dependencies
source("scrape/R/artists_15.R")

base_url <- "http://www.svt.se/melodifestivalen/artister/"

session <- html_session(base_url)

# Artists (a_)
a_nodes <- session %>% 
  html_nodes("a")

a_links <- artist_nodes %>% 
  html_attr("href")

a_names <- artist_nodes %>% 
  html_text()

artist_links <- data_frame(
  artist = a_names,
  link = a_links,
  song_name = character(1),
  lyrics = character(1)
) %>% 
  filter(link %>% str_detect("^http://www.svt.se/melodifestivalen/artister/")) %>% 
  filter(!duplicated(artist))

# Songs (s_)
for (i in 1:nrow(artist_links)) {
  s_link <- artist_links[i,]$link
  s_page <- html_session(s_link)
  
  s_page_links <- s_page %>% 
    html_nodes('.svtJsLoadHref')
  
  s_page_islyrlink <- s_page_links %>% 
    html_attr("title") %>% 
    str_detect("Bidragsbibeln")
  s_page_islyrlink[is.na(s_page_islyrlink)] <- FALSE

  
  # Lyrics (l_)
  l_link <- s_page_links %>%
    magrittr::extract(s_page_islyrlink) %>% 
    html_attr("href")
  
  l_page <- html(l_link)
  
  if (i != 10) {
    l_title <- l_page %>% 
      html_node(".svtTextBread-Article") %>% 
      html_node("h4") %>% 
      html_text() %>% 
      str_replace("Texten: ", "")
  } else {
    l_title <- "Don't Stop"
  }
  
  l_rawlyrics <- l_page %>% 
    html_node(".svtTextBread-Article") %>% 
    html_nodes("p") %>% 
    html_children()
  
  l_lyrics <- l_rawlyrics %>%
    sapply(function(el) {
      sapply(el, function(row) {
        # browser()
        return(row %>% html_text(, trim = TRUE))
      }) %>% paste(collapse = "\n")
    }) %>%
    str_replace_all("\n\n", "\n") %>% 
    paste(collapse = "\n")
  
  artist_links[i,]$song_name <- l_title
  artist_links[i,]$lyrics <- l_lyrics
}


## Merge lyrics with artist data ----
mello15_a_l <- mello15 %>% 
  select(-song_name) %>% 
  left_join(artist_links, by = "artist")

save(mello15_a_l, file = "data/mello15_a_l.Rdata")
