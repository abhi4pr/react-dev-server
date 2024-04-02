// Announcement.js
import React, { useState } from "react";
import CommentForm from "./CommentForm";
import ReactionButton from "./ReactionButton";

const Announcement = ({
  announcement,
  comments,
  handleReaction,
  handlePostComment,
  fetchComments,
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const reactionTypes = ["like", "haha", "love", "sad", "clap"];

  const handleReactionClick = (reactionType) => {
    handleReaction(announcement._id, reactionType);
  };

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
    if (!showCommentForm) fetchComments(); // Fetch comments when the comment form is shown
  };

  return (
    <>
      <div>{announcement.post_subject}</div>
      <div dangerouslySetInnerHTML={{ __html: announcement.post_content }} />
      {reactionTypes.map((type) => (
        <ReactionButton
          key={type}
          reactionType={type}
          handleReactionClick={handleReactionClick}
        />
      ))}
      <button onClick={toggleCommentForm}>Comment</button>
      {showCommentForm && (
        <>
          <CommentForm
            announcementId={announcement._id}
            handlePostComment={handlePostComment}
          />
          <div>
            {comments.map((comment, index) => (
              <h1 key={index}>{comment.comment}</h1>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Announcement;
