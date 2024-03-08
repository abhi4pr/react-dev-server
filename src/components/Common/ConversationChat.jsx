import React, { useEffect, useState } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";
import axios from "axios";
import { baseUrl } from "../../utils/config";
import jwtDecode from "jwt-decode";

const ENDPOINT = "http://192.168.1.45:8098";
var socket;
const ConversationChat = ({ selectedItem, chatIdData,dataChat }) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginObjId = decodedToken._id;
  const [message, setMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  // const [messages, setMessages] = useState([]); // New state for storing messages

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSend = async () => {
    if (!socketConnected) {
      console.log("Socket not connected");
      return;
    }
    // sending message post data----->
    const chatPostApi = await axios.post(`${baseUrl}message`, {
      chatId: chatIdData,
      content: message,
      currentUserId: loginObjId,
    });

    // if (message.trim()) {
    //   // Ensure that the message is not just whitespace
    //   const newMessage = {
    //     id: messages.length + 1, // Simple ID (you might want to use something more sophisticated)
    //     text: message,
    //     sender: "You", // You can replace this with dynamic sender info if needed
    //   };
    //   setMessages([...messages, newMessage]); // Add the new message to the messages state
    //   setMessage(""); // Clear the input field
    // }
    console.log(chatPostApi, "Response data");

    socket.emit("new-message", chatPostApi);
    console.log("Saimyual calls");
    setMessage("");
  };

 


  useEffect(() => {
    // Directly assign to the outer `socket` variable without `const`
    socket = io(ENDPOINT, {
      transports: ["polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setSocketConnected(true); // Set connection status
    });

    socket.emit("setup", decodedToken);
    // socket.on("typing", () => setIsTyping(true));
      // socket.on("stop typing", () => setIsTyping(false));
        // Cleanup on component unmount
    return () => {
      socket.disconnect();
      setSocketConnected(false);
    };
  }, []);

  if (!selectedItem) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: 3,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: "25px" }}>
          Select a user to start a conversation.
        </div>
      </Box>
    );
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#fff",
        width: "100%",
        height: "390px",
      }}
    >
      <div>{selectedItem?.user_name}</div>
      <div style={{ overflowY: "auto" }}>
        {dataChat?.data?.map((msg) => (
          <div key={msg._id}>
            <strong>{msg?.content}</strong>
          </div>
        ))}
      </div>
      <TextField
        fullWidth
        placeholder="Type Message here ....."
        variant="outlined"
        value={message}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mt: "auto", mr: 4 }}
      />
    </Box>
  );
};

export default ConversationChat;
