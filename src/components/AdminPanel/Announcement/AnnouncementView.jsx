import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import getDecodedToken from "../../../utils/DecodedToken";
import { useGlobalContext } from "../../../Context/Context";
import Announcement from "./Announcement";

const AnnouncementView = () => {
  const { toastError } = useGlobalContext();
  const loginUserId = getDecodedToken().id;
  const [announcements, setAnnouncements] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const getAnnouncementData = async () => {
      try {
        const res = await axios.get(`${baseUrl}get_all_user_announcement`);
        setAnnouncements(res.data.userAnnouncementList);
      } catch (error) {
        toastError(
          error.response?.data?.error || "Error fetching announcements"
        );
      }
    };
    getAnnouncementData();
  }, []);

  const handleReaction = async (announcementId, reaction) => {
    try {
      await axios.put(`${baseUrl}announcement_post_like`, {
        announcement_id: announcementId,
        user_id: loginUserId,
        reaction: reaction,
      });
    } catch (error) {
      toastError(
        error.response?.data?.error || "Error reacting to announcement"
      );
    }
  };

  const handlePostComment = async (announcementId, commentText) => {
    try {
      const response = await axios.post(`${baseUrl}announcement_post_comment`, {
        announcement_id: announcementId,
        user_id: loginUserId,
        comment: commentText,
      });

      if (response.status === 200) {
        const newComment = response.data.data;

        setComments((prevComments) => {
          const updatedComments = prevComments[announcementId]
            ? [newComment, ...prevComments[announcementId]]
            : [newComment];
          return { ...prevComments, [announcementId]: updatedComments };
        });
      }
    } catch (error) {
      toastError(error.response?.data?.error || "Error posting comment");
    }
  };

  const fetchComments = async (announcementId) => {
    try {
      const commentsRes = await axios.get(
        `${baseUrl}get_announcement_comments/${announcementId}`
      );
      setComments((prevComments) => ({
        ...prevComments,
        [announcementId]: commentsRes.data.data,
      }));
    } catch (error) {
      toastError(error.response?.data?.error || "Error fetching comments");
    }
  };

  return (
    <div>
      {announcements.map((announcement) => (
        <Announcement
          key={announcement._id}
          announcement={announcement}
          comments={comments[announcement._id] || []}
          handleReaction={handleReaction}
          handlePostComment={handlePostComment}
          fetchComments={() => fetchComments(announcement._id)}
        />
      ))}
    </div>
  );
};

export default AnnouncementView;
