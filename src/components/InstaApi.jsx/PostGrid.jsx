import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid, Paper, Button } from "@mui/material";
import { useState } from "react";

export default function PostGrid({ rows }) {
  const [cardsToShow, setCardsToShow] = useState(20);

  const loadMoreCards = () => {
    // Increase the number of cards to display by 20
    setCardsToShow(cardsToShow + 20);
  };

  return (
    <div>
      <Grid container spacing={0.5} sx={{ mt: 5, justifyContent: "center" }}>
        {rows.slice(0, cardsToShow).map((ele, index) => (
          <Grid item key={index}>
            <Paper
              sx={{
                width: 300,
                // p: 1,
                // bgcolor: ele.posttype_decision != 0 ? "lightgreen" : "white",
              }}
            >
              <Card>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    sx={{ objectFit: "fill", height: 300 }}
                    image={ele.postImage}
                    alt="Post Img"
                  />
                  <CardContent>
                    <Typography variant="body2">{ele.postTitle}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {cardsToShow < rows.length && (
        <Button
          variant="contained"
          sx={{ position: "relative", left: "45%" }}
          onClick={loadMoreCards}
        >
          Load More...
        </Button>
      )}
    </div>
  );
}
