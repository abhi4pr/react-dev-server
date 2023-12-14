import axios from "axios";
import { useEffect } from "react";
import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import CircularWithValueLabel from "./CircularWithValueLabel";
import ScreenshotView from "./ScreenshotView";
import ScreenShotSideview from "./ScreenShotsideview";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PostGrid from "./PostGrid";
import NocontentAlertDialog from "./NocontentAlertDialog";

const now = new Date();
// let step = localStorage.getItem("userlevel");
const InstaPostDashboard = () => {
  const { creatorName } = useParams();
  const { shortCode } = useParams();
  const [rows, setRows] = useState([]);
  const [isLoadiing, setLoading] = useState(false);
  const [ind, setInd] = useState(0);
  const [status, setStatus] = useState(false);

  let lvl = 0;
  useEffect(() => {
    axios
      .post("http://34.93.221.166:3000/api/get_posts_from_name", {
        creatorName: creatorName,
      })
      .then((res) => {
        const ftrarr = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].posttype_decision == 0) {
            // console.log("pushed in arr");
            ftrarr.push(res.data[i]);
          }
        }
        setRows(ftrarr);
        setLoading(true);
      });
  }, [status]);

  const handleincindex = () => {
    if (ind == rows.length - 1) {
      setInd(0);
    } else {
      setInd(ind + 1);
    }
  };
  const handledecindex = () => {
    if (ind == 0) {
      setInd(rows.length - 1);
    } else {
      setInd(ind - 1);
    }
  };
  const handlekey = (event) => {
    // console.log(" key pressed", event);
    if (event.code === "ArrowRight" || event.key === "ArrowRight") {
      // console.log("Forward key pressed");
      handleincindex();
    } else if (event.code === "ArrowLeft" || event.key === "ArrowLeft") {
      handledecindex();
    }
  };
  return (
    <>
      <Box
        component="main"
        // "#98fb98"
        sx={{
          backgroundColor: "rgb(245,245,245)",
        }}
        onKeyDown={handlekey}
        tabIndex={0}
      >
        {isLoadiing ? (
          <>
            {rows.length == 0 ? (
              <>
                <NocontentAlertDialog creatorName={creatorName} lvl={lvl} />
              </>
            ) : (
              <>
                <Container
                  maxWidth="xl"
                  sx={{
                    flexWrap: "wrap",
                    flexDirection: "row",
                    mb: 4,
                    // backgroundColor: "lightgreen",
                  }}
                >
                  <Link
                    to={`/admin/instaapi/${creatorName}/${
                      rows[(rows.length - (rows.length - ind)) % rows.length]
                        .shortCode
                    }`}
                  >
                    <Typography
                      sx={{
                        position: "relative",
                        top: "35vh",
                        left: "-2%",
                        // bgcolor: "red",
                        width: 25,
                      }}
                      onClick={handledecindex}
                    >
                      <ArrowBackIosIcon />
                    </Typography>
                  </Link>

                  <Link
                    to={`/admin/instaapi/${creatorName}/${
                      rows[(ind + 1) % rows.length].shortCode
                    }`}
                  >
                    <Typography
                      sx={{
                        position: "relative",
                        left: "98%",
                        top: "35vh",
                        // bgcolor: "red",
                        width: 25,
                      }}
                      onClick={handleincindex}
                    >
                      <ArrowForwardIosIcon />
                    </Typography>
                  </Link>
                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={6} lg={7} sx={{ mr: 2, mb: 2 }}>
                      <Paper>
                        {/* {console.log(isLoadiing, ind, rows[ind])} */}

                        <ScreenshotView
                          post={rows[ind % rows.length]}
                          setInd={setInd}
                          ind={ind}
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4.5} sx={{ mr: 2, mb: 2 }}>
                      <Paper>
                        {/* {console.log(rows)} */}
                        <ScreenShotSideview
                          setInd={setInd}
                          ind={ind}
                          post={rows[ind % rows.length]}
                          pagepostslength={rows.length}
                          status={status}
                          setStatus={setStatus}
                          lvl={lvl}
                        />
                      </Paper>
                    </Grid>
                  </Grid>
                </Container>
                <Divider />
                <PostGrid rows={rows} />
              </>
            )}
          </>
        ) : (
          <CircularWithValueLabel />
        )}
      </Box>
    </>
  );
};

export default InstaPostDashboard;
