import axios from "axios";
import { useContext, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CircularWithValueLabel from "../CircularWithValueLabel";
import ScreenShotSideview from "../ScreenShotsideview";
import ScreenshotView from "../ScreenshotView";
import InterpretorPage from "./InterpretorPage";
import NocontentAlertDialog from "../NocontentAlertDialog";

const now = new Date();
let step = 1;
const InterpretorPostDashboard = ({
  rows,
  promotionalpost,
  isLoadiing,
  setLoading,
  setPageview,
  pageview,
  setRows,
}) => {
  const { shortCode } = useParams();
  const { creatorName } = useParams();
  // const [rows, setRows] = useState([]);
  // const [isLoadiing, setLoading] = useState(true);
  const [ind, setInd] = useState(0);
  const [status, setStatus] = useState(false);
  const [ftrtype, setFtrtype] = useState(1);
  let lvl = 1;
  console.log("work from post dashboard");
  // useEffect(() => {
  //   axios
  //     .post("http://34.93.221.166:3000/api/get_posts_from_name", {
  //       creatorName: creatorName,
  //     })
  //     .then((res) => {
  //       const ftrarr = [];
  //       for (let i = 0; i < res.data.length; i++) {
  //         if (
  //           res.data[i].posttype_decision == 1 &&
  //           res.data[i].selector_decision == 1
  //         ) {
  //           ftrarr.push(res.data[i]);
  //         }
  //       }
  //       setRows(ftrarr);
  //       // console.log(ftrarr[0]);
  //       if (ftrarr != []) {
  //         setLoading(true);
  //       }
  //     });
  // }, [status]);

  function extractHashtagsAndMentions(inputString) {
    const hashtags = [];
    const mentions = [];
    if (inputString != null) {
      const words = inputString.split(/\s+/); // Split the input string into words
      words.forEach((word) => {
        if (word.startsWith("#")) {
          const hashtag = word.replace(/[^a-zA-Z0-9_]+$/, ""); // Remove special characters from the end
          hashtags.push(hashtag.slice(1)); // Remove the '#' symbol and add to the array
        } else if (word.startsWith("@")) {
          const mention = word.replace(/[^a-zA-Z0-9_]+$/, ""); // Remove special characters from the end
          mentions.push(mention.slice(1)); // Remove the '@' symbol and add to the array
        }
      });
    }
    return { hashtags, mentions };
  }
  if (isLoadiing && rows.length > 0) {
    var { hashtags, mentions } = extractHashtagsAndMentions(
      rows[ind % rows.length].title
    );
  }

  const handleincindex = () => {
    console.log("function call");
    if (ind == rows.length - 1) {
      console.log("index end");
      setLoading(!isLoadiing);
      setPageview(!pageview);
    } else {
      setInd(ind + 1);
    }
  };
  // const handledecindex = () => {
  //   if (ind == 0) {
  //     setInd(rows.length - 1);
  //   } else {
  //     setInd(ind - 1);
  //   }
  // };
  const handlebackbutton = () => {
    // setReloadpage(false);
    setPageview(!pageview);
    setLoading(!isLoadiing);
  };
  return (
    <>
      <Box component="main">
        {/* {isLoadiing ? ( */}
        <Button onClick={handlebackbutton}>Back</Button>
        <>
          {rows.length == 0 ? (
            <>
              {console.log("no content reach")}
              <NocontentAlertDialog creatorName={creatorName} lvl={lvl} />
            </>
          ) : (
            <>
              {promotionalpost && (
                <InterpretorPage
                  post={rows[ind]}
                  status={status}
                  setStatus={setStatus}
                  hashtags={hashtags}
                  mentions={mentions}
                  handleincindex={handleincindex}
                />
              )}
              <Container
                maxWidth="xl"
                sx={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                  mb: 4,
                }}
              >
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={6} lg={7} sx={{ mr: 2, mb: 2 }}>
                    <Paper>
                      <ScreenshotView
                        post={rows[ind % rows.length]}
                        setInd={setInd}
                        ind={ind}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4.5} sx={{ mr: 2, mb: 2 }}>
                    <Paper>
                      <ScreenShotSideview
                        setInd={setInd}
                        ind={ind}
                        post={rows[ind % rows.length]}
                        status={status}
                        setStatus={setStatus}
                        lvl={lvl}
                        handleincindex={handleincindex}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
              <Divider />
            </>
          )}
        </>
        {/* // ) : ( // <CircularWithValueLabel />
        // )} */}
      </Box>
    </>
  );
};

export default InterpretorPostDashboard;
