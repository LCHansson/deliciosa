## Data ----
load("data/mello15_all.Rdata")

writers <- mello15_all$tm %>%
  str_split(",") %>% 
  sapply(function(x) str_trim(x))

writer_data <- lapply(writers, function(tm) {
  name <- str_extract(tm, perl(".*(?=(\\())")) %>% str_trim()
  textmusic <- str_extract(tm, perl("(?<=(\\()).*(?=(\\)))"))
  text <- str_detect(textmusic, "t")
  music <- str_detect(textmusic, "m")
  
  gender <- sapply(name, function(n) {
    readline(paste0("Gender of ", n," (0 = kvinna, 1 = man): "))
  })
  
  return(list(name = name, gender = gender, text = text, music = music))
})

save(writer_data, file = "data/songwriters15_gender.Rdata")


songquotas <- sapply(writer_data, function(song) {
  mean(as.integer(song$gender))
})

tm_bins <- cut(songquotas, breaks = c(-Inf, 0.1, 0.51, 0.99, Inf), labels = c("Enbart kvinnor", "Blandad grupp", "Mansdominerad grupp", "Enbart män"))

# writer_data[sapply(writer_data, function(song) {
#   num_females <- sum(as.integer(song$gender) == 0)
#   num_females == 1
# })]

sapply(writer_data, function(song) {
  song$name
}) %>% unlist %>% table
