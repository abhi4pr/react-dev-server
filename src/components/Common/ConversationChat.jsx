import React, { useEffect, useState } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";
import axios from "axios";
import { baseUrl } from "../../utils/config";
import jwtDecode from "jwt-decode";
import ScrollableChat from "./ScrollableChat";

const ENDPOINT = "http://192.168.1.45:8098";
var socket, selectedChatCompare;

const ConversationChat = (props) => {
  const { selectedItem, chatIdData } = props;
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginObjId = decodedToken._id;

  const [message, setMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [dataChat, setDataChat] = useState([]);

  useEffect(() => {
    if (chatIdData) {
      getChatData();
    }
  }, [chatIdData]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSend = async () => {
    if (!socketConnected) {
      console.log("Socket not connected");
      return;
    }
    if (!message.trim()) {
      console.log("Message is empty");
      return;
    }

    // sending message post data----->
    const chatPostApi = await axios.post(`${baseUrl}message`, {
      chatId: chatIdData,
      content: message,
      currentUserId: loginObjId,
    });
    console.log(chatPostApi, "chatPostApi");

    if (chatPostApi.status === 200) {
      socket.emit("new-message", chatPostApi.data.data);
    }
    setDataChat((prevDataChat) => [...prevDataChat, chatPostApi.data.data]);
    setMessage("");
    getChatData();
  };

  // const scrollToBottom = () => {
  //   if (messagesEndRef.current) {
  //     console.log("Scrolling to bottom");
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  // While Pressing Enter Key :-

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend(); // Call handleSend function when Enter key is pressed
    }
  };

  useEffect(() => {
    // Directly assign to the outer `socket` variable without `const`
    socket = io(ENDPOINT, {
      transports: ["polling"],
    });

    socket.on("connect", () => {
      setSocketConnected(true); // Set connection status
    });

    socket.emit("amanSocket", {
      name: "palak",
      email: "palak@gmail.com",
      age: "24",
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

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      setDataChat((prevDataChat) => [...prevDataChat, newMessageReceived]);
      // if (
      //   !selectedChatCompare ||
      //   selectedChatCompare._id !== newMessageReceived.chatId._id
      // ) {
      //   if (!notification.includes()) {
      //     console.log("in if !notification.includes() 11");
      //     setNotification([newMessageReceived, ...notification]);
      //     setFetchAgain(!fetchAgain);
      //   }
      // } else {
      //   console.log("in else 111");
      //   setMessages([...messages, newMessageReceived]);
      // }
    });
  }, []);

  const getChatData = async () => {
    try {
      const response = await axios.get(`${baseUrl}message/${chatIdData}`);
      console.log(response, "response>>> ");
      if (response.status === 200) {
        setDataChat(response.data.data);
      }
      socket.emit("join chat", chatIdData);
    } catch (error) {
      console.error("Error fetching chat data", error);
    }
  };

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
      {/* <div>{selectedItem?.user_name}</div>
      <div style={{ overflowY: "auto" }}>
        {dataChat?.map((msg) => (
          <div key={msg._id}>
            <strong>{msg?.content}</strong>
          </div>
        ))}
      </div> */}
      <div className="message">
        <ScrollableChat dataChat={dataChat} selectedItem={selectedItem} />
        {/* <div ref={messagesEndRef} /> */}
      </div>
      <TextField
        fullWidth
        placeholder="Type Message here ....."
        variant="outlined"
        value={message}
        onKeyDown={handleKeyPress}
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
