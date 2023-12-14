import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useContext } from "react";
import { useState } from "react";
import { InstaContext } from "./InstaApiContext";
import axios from "axios";

const ConfirmationButton = ({
  confirmation,
  setConfirmation,
  setStatus,
  status,
  lvl,
  post,
  setInd,
  handleincindex,
}) => {
  const [open, setOpen] = useState(true);
  const { users, contextData, userID } = useContext(InstaContext);
  // const [confirmation, setConfirmation] = useState(0);
  let step = lvl;
  console.log(step);
  const handlesubmit = () => {
    let btn = confirmation;
    console.log(confirmation);
    try {
      if (step == 0) {
        let tab = 1;
        if (post.posttype_decision != 0) {
          tab = post.posttype_decision;
        }
        axios.put("http://34.93.221.166:3000/api/instaupdate", {
          _id: post._id,
          posttype_decision: tab,
          selector_decision: btn,
          selector_name: userID,
        });
      } else if (step == 1) {
        let tab = 2;
        if (post.posttype_decision > 2) {
          tab = post.posttype_decision;
        }
        axios.put("http://34.93.221.166:3000/api/instaupdate", {
          _id: post._id,
          posttype_decision: tab,
          interpretor_decision: btn,
          interpretor_name: userID,
        });
      } else if (step == 2) {
        axios.put("http://34.93.221.166:3000/api/instaupdate", {
          _id: post._id,
          posttype_decision: 3,
          auditor_decision: btn,
          auditor_name: userID,
        });
      }
    } catch (error) {
      console.log(error);
    }
    // setInd((ind + 1) % pagepostslength);
    setOpen(false);
    setConfirmation(0);
    setStatus(!status);
    handleincindex();
  };
  const handleNo = () => {
    setOpen(false);
    setConfirmation(false);
  };
  return (
    <Dialog
      maxWidth="xs"
      open={open}
      // TransitionProps={{ onEntered: handleEntered }}
      // open={!!promiseArguments}
    >
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent dividers>
        {`Are you sure with your decision.`}
      </DialogContent>
      <DialogActions>
        <Button onClick={handlesubmit}>Confirm</Button>
        <Button onClick={handleNo}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationButton;
