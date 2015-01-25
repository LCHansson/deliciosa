for (i in 1:100) {
  if ((mello_data$lovecount[i] !=0) || (mello_data$lyrics_cleaned == "")) next()
  cat("*******************************\n")
  cat(i, ":", mello_data$artist[i],":", mello_data$song_name[i], "\n\n")
  cat(mello_data$lyrics_cleaned[i], "\n\n")
}


for (i in 1:nrow(mello_data)) {
  if ((mello_data$lovecount[i] !=0) || !str_detect(mello_data$lyrics_cleaned[i], "[Ww]ant you")) next()
  cat("*******************************\n")
  cat(i, ":", mello_data$artist[i],":", mello_data$song_name[i], "\n\n")
  cat(mello_data$lyrics_cleaned[i], "\n\n")
}



# bara du
# I miss you
# jag och du
# du och jag
# förlorat dig
# här för dig
# me and you
# jag tar dig
# ger dig allt
# right for each other
# lämna dig
# there with you
