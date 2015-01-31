# Radius of points
radius <- 5 # circle radius
canvas_width <- 800 # canvas width
margin <- 25 # canvas margins

scatter_data <- mello_data %>%
  select(id, lovecount, godcount, partycount, seasoncount, sent_score, year,
         artist, song_name) %>%
  arrange(year, sent_score) %>%
  mutate(x = (year - 2002) * (canvas_width - 2 * margin)/12 + margin,
              y = -sent_score,
              r = radius)
              
for (i in 2:nrow(scatter_data)) {
  if (scatter_data$year[i-1] != scatter_data$year[i])
    next()
  
  # Get coords of this and prior point
  x <- scatter_data$x[i]
  y <- scatter_data$y[i]
  x_prior <- scatter_data$x[i-1]
  y_prior <- scatter_data$y[i-1]
  located_right_of_prior <- scatter_data$x[i-1] - x_prior
  point_distance <- sqrt((x - x_prior)^2 + (y - y_prior)^2)
  
  # If points are too close, move the next point a bit to the left or right
  cat("ID:", scatter_data$id[i], "Distance:", point_distance)
  if (point_distance < 2*radius) {
    # This is all about solving for one of the sides in a right triangle. We
    # already know the vertical edge (i.e. the difference in sent_score) and the
    # hypothenuse (2*radius), so we can find the final side using the
    # Pythagorean formula.
    skew = sqrt((2*radius)^2 - (y - y_prior)^2)
    direction = located_right_of_prior >= 0
    skew = skew * direction
    scatter_data$x[i] <- x + skew
    cat(", old x:", x, ", new x:", x + skew, "\n")
  } else {
    cat("\n")
  }
}


ggplot(scatter_data, aes(x = x, y = y)) + geom_point(size = radius)
