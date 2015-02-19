library("dplyr")

edges <- read.csv("posts/tm/data/edges.csv") %>% tbl_df()
nodes <- read.csv("posts/tm/data/nodes.csv") %>% tbl_df()

nodes <- nodes %>%
  mutate(id = paste0('a', 1:n()) %>% as.character(),
         match = 1,
         playcount = 1,
         artist = group %>% as.character()) %>% 
  select(match, name, artist, id, playcount)

edges <- edges %>% 
  select(-value) %>% 
  mutate(source = paste0('a',source),
         target = paste0('a', target))

json <- jsonlite::toJSON(
  list(
    nodes = nodes,
    links = edges
  ),
  pretty = TRUE
)

cat(json, file = "posts/tm/interactive_network_demo/data/coffee.json")
