import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../utils/config";

const AnnouncementView = () => {
  const [annoucements, setAmmouncements] = useState([]);
  useEffect(() => {
    const getAnnoucementData = async () => {
      const res = await axios.get(
        `http://192.168.29.163:8080/api/get_all_user_announcement`
      );
      setAmmouncements(res.data.userAnnouncementList);
    };
    getAnnoucementData();
  }, []);
  return (
    <div>
      {annoucements.map((announcement) => (
        <>
          <div>{announcement.post_subject}</div>
          <div
            dangerouslySetInnerHTML={{ __html: announcement.post_content }}
          />
        </>
      ))}
    </div>
  );
};

export default AnnouncementView;
