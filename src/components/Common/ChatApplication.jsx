import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import UserChatData from "./UserChatData";
import jwtDecode from "jwt-decode";

const style = {
  position: "relative",
  top: "63%",
  left: "80%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  height: 500,
  p: 4,
  mb: 4,
  mr: 2,
  borderRadius: "50px",
  backgroundImage: `linear-gradient(to left, darkblue, lightblue)`,
};

const ChatApplication = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const chatUserData = async () => {
    const res = await axios.get(
      `http://192.168.1.45:3005/api/get_chating_users/${loginUserId}`
    );
    setData(res?.data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterRows = () => {
    const filtered = data.filter((row) =>
      row.user_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, data]);

  return (
    <>
      {!open && (
        <div style={{ position: "fixed", right: 20, bottom: 50 }}>
          <Button
            sx={{
              color: "#141452",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderRadius: "10px",
                background: "#e6e698",
                transform: "scale(1.05)",
              },
            }}
            onClick={() => {
              chatUserData();
              handleOpen();
            }}
          >
            <ChatOutlinedIcon />
          </Button>
        </div>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <TextField
                placeholder="Search user"
                variant="outlined"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{ background: "#fff", borderRadius: "10px",width:"180px" }}
              />
            </Box>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {data.length > 0 && <UserChatData data={filteredRows} />}
          {/* <UserChatData data={filteredRows} /> */}
          {/* < */}
        </Box>
      </Modal>
    </>
  );
};

export default ChatApplication;
