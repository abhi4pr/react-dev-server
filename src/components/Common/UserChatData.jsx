import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ConversationChat from "./ConversationChat";
import axios from "axios";
import jwtDecode from "jwt-decode";

const UserChatData = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [chatIdData, setChatIdData] = useState();
  const [dataChat, setDataChat] = useState([]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
console.log(dataChat,"00000000");




  const handleItemClick = async (item) => {
    const PostUserChat = await axios.post(`http://192.168.1.45:3005/api/chat`, {
      userFromChatId: loginUserId,
      userToChatId: item?.user_id,
    });
   
    const ids = PostUserChat?.data?._id;
    setChatIdData(ids);
    setSelectedItem(item);
    if(PostUserChat.status == 200){
      getChatData()
    }
  };

  const getChatData = async () => {
    const getData = await axios.get(
      `http://192.168.1.45:3005/api/message/${chatIdData}`
    );
    console.log(getData?.data,"getData>>")
    setDataChat(getData)
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
              <b> {item?.user_name}</b>
              <hr style={{ width: "30%", background: "orange" }} />
            </div>
          ))}
        </div>
      </Box>
      <ConversationChat selectedItem={selectedItem} chatIdData={chatIdData} dataChat={dataChat} />
    </div>
  );
};

export default UserChatData;
