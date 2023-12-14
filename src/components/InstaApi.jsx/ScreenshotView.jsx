import { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
let iind = 0;
export default function ScreenshotView({ post }) {
  const [expanded, setExpanded] = useState(false);
  const [objfit, setObjfit] = useState("contain");
  const imageratio = ["scale-down", "cover", "contain", "fill", "none"];

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  // console.log(post);
  // ✅ Format a date to YYYY-MM-DD (or any other format)
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-");
  }
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const newdate = formatDate(new Date(post.postedOn));
  const monthname = month[new Date(post.postedOn).getMonth()];
  // console.log(month[new Date(post.postedOn).getMonth()]);
  return (
    <Card sx={{ minHeight: 650 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        // aria-label="settings"
        action={
          <Button variant="contained" size="small">
            {post.postType}
          </Button>
        }
        title={post.creatorName}
        subheader={monthname + " " + newdate}
        // subheader={new Date(postdate)}
      />
      <CardMedia
        component="img"
        sx={{ objectFit: objfit, height: 400 }}
        image={post.postImage}
        alt="Post Img"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.title}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* {console.log(post.postUrl)} */}
        <Link to={post.postUrl} target="_blank">
          <IconButton aria-label="add to favorites">
            <InstagramIcon />
          </IconButton>
        </Link>
        <IconButton
          aria-label="share"
          onClick={() => {
            setObjfit(imageratio[(iind = (iind + 1) % imageratio.length)]);
            console.log(iind);
          }}
        >
          <AspectRatioIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Page Bio:</Typography>
          <Typography paragraph></Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
