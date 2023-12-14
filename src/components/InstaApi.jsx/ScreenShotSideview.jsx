import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Chip, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import CustomizedSteppers from "./Auditor/CustomizedSteppers";
import { useContext } from "react";
import { InstaContext } from "./InstaApiContext";
import PostGrid from "./PostGrid";
import InterpretorPage from "./Interpretor/InterpretorPage";
import ConfirmationButton from "./ConfirmationButton";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
// let userlevel = localStorage.getItem("userlevel");
export default function ScreenShotSideview({
  post,
  lvl,
  setInd,
  status,
  setStatus,
  handleincindex,
}) {
  const { users, contextData, userID } = useContext(InstaContext);
  const [confirmation, setConfirmation] = useState(0);
  let step = post.posttype_decision;

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
  const { hashtags, mentions } = extractHashtagsAndMentions(post.title);

  let isButtonDisabled = false;
  // console.log(lvl);
  if (lvl == 1) {
    isButtonDisabled = true;
  }

  return (
    <>
      {users != [] && (
        <Paper sx={{ height: 650, justifyContent: "center" }}>
          {confirmation != 0 && (
            <ConfirmationButton
              confirmation={confirmation}
              setConfirmation={setConfirmation}
              status={status}
              setStatus={setStatus}
              lvl={lvl}
              post={post}
              setInd={setInd}
              handleincindex={handleincindex}
            />
          )}
          <Grid sx={{ justifyContent: "center" }}>
            <Paper sx={{ p: 2 }}>
              <Typography textAlign="center">
                {/* {console.log(post)} */}
                {post.posttype_decision == 0 ? (
                  <Button variant="contained" color="error" size="small">
                    Pending...
                  </Button>
                ) : (
                  <CustomizedSteppers
                    step={step}
                    users={users}
                    post={post}
                    contextData={contextData}
                  />
                )}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            container
            justifyContent="center"
            sx={{ pt: 2, pb: 2, bgcolor: "#90caf9" }}
          >
            <Grid>
              <Paper>
                <Stack
                  flexDirection="row"
                  sx={{
                    p: 1,
                    // bgcolor: "#b39ddb",
                    mb: 1,
                    minWidth: 200,
                    justifyContent: "space-around",
                    alignContent: "center",
                  }}
                >
                  <Typography sx={{ pt: 1 }}>Views</Typography>
                  <Stack>
                    {/* <Avatar>{post.allView}</Avatar> */}
                    <Chip
                      avatar={<Avatar alt="Natacha" src={post.postImage} />}
                      label={post.allView}
                      variant="outlined"
                      color="success"
                    />
                  </Stack>
                </Stack>
              </Paper>

              <Paper>
                <Stack
                  flexDirection="row"
                  sx={{
                    p: 1,
                    // bgcolor: "#9fa8da",
                    mb: 1,
                    minWidth: 200,
                    justifyContent: "space-around",
                    alignContent: "center",
                  }}
                >
                  <Typography sx={{ pt: 1 }}>Likes</Typography>
                  <Stack>
                    {/* <Avatar>{post.allLike}</Avatar> */}
                    <Chip
                      avatar={<Avatar alt="Natacha" src={post.postImage} />}
                      label={post.allLike}
                      variant="outlined"
                      color="success"
                    />
                  </Stack>
                </Stack>
              </Paper>

              <Paper>
                <Stack
                  flexDirection="row"
                  sx={{
                    p: 1,
                    // bgcolor: "#90caf9",
                    mb: 1,
                    minWidth: 200,
                    justifyContent: "space-around",
                    alignContent: "center",
                  }}
                >
                  <Typography sx={{ pt: 1 }}>Comments</Typography>
                  <Stack>
                    {/* <Avatar>{post.allComments}</Avatar> */}
                    <Chip
                      avatar={<Avatar alt="Natacha" src={post.postImage} />}
                      label={post.allComments}
                      variant="outlined"
                      color="success"
                    />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container justifyContent="space-evenly" sx={{ mb: 2 }}>
            <Paper sx={{ p: 1, width: "100%" }}>
              <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                HashTags :
                {/* <Button variant="outlined" size="small">
                  View
                </Button> */}
              </Typography>

              <Grid container spacing={1}>
                {hashtags.map((tag) => {
                  return (
                    <Grid>
                      <Chip label={tag} variant="outlined" />
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
          <Grid container justifyContent="space-evenly" sx={{ mb: 2 }}>
            <Paper sx={{ p: 1, width: "100%" }}>
              <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                Mention :
                {/* <Button variant="outlined" size="small">
                  View
                </Button> */}
              </Typography>
              <Grid container spacing={1}>
                {mentions.map((tag) => {
                  return (
                    <Grid>
                      <Chip label={tag} variant="outlined" />
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>

          {lvl != 3 && (
            <Grid container justifyContent="space-evenly" sx={{ pb: 2 }}>
              <Button
                variant="contained"
                disabled={isButtonDisabled}
                onClick={() => setConfirmation(1)}
              >
                Yes
              </Button>
              <Button variant="contained" onClick={() => setConfirmation(2)}>
                No
              </Button>
              <Button variant="contained" onClick={() => setConfirmation(3)}>
                May be
              </Button>
            </Grid>
          )}
        </Paper>
      )}
    </>
  );
}
