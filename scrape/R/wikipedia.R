## An attempt to scrape Wikipedia using Hadley's rvest package

library(rvest)

# Scrape data
url_14 <- "http://sv.wikipedia.org/wiki/Melodifestivalen_2014"
contents <- html(url_14)

# Find structured data
tables <- html_nodes(contents, ".wikitable")
