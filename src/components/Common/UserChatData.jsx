import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ConversationChat from "./ConversationChat";
import axios from "axios";
import jwtDecode from "jwt-decode";

const UserChatData = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [chatIdData, setChatIdData] = useState(null); // Explicitly set to null for clarity
  
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleItemClick = async (item) => {
    try {
      const response = await axios.post(`http://192.168.1.45:3005/api/chat`, {
        userFromChatId: loginUserId,
        userToChatId: item?.user_id,
      });
      if (response.status === 200) {
        setChatIdData(response.data._id);
        setSelectedItem(item);
      } else {
        console.error("Failed to post chat data");
      }
    } catch (error) {
      console.error("Error posting chat data", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Box>
        <div style={{ maxHeight: "390px", overflowY: "scroll" }}>
          {data.map((item, index) => (
            <div
              key={index}
              style={{ padding: "10px", color: "#fff", cursor: "pointer" }}
              onClick={() => handleItemClick(item)}
            >
              <b>{item?.user_name}</b>
              <hr style={{ width: "30%", background: "orange" }} />
            </div>
          ))}
        </div>
      </Box>
      <ConversationChat selectedItem={selectedItem} chatIdData={chatIdData}  />
    </div>
  );
};

export default UserChatData;
