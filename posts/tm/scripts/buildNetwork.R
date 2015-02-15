nodes <- read.csv("/Users/luminitamoruz/work/deliciosa/posts/tm/data/nodes.csv")
edges <- read.csv("/Users/luminitamoruz/work/deliciosa/posts/tm/data/edges.csv")

forceNetwork(edges, nodes, Source = "source",
             Target = "target", Value = "value", NodeID = "name",
             Group = "group", opacity = 0.7, fontsize=12, 
             linkWidth="function(d) { return 0.8*Math.sqrt(d.value); }", 
             colourScale="d3.scale.category10()")