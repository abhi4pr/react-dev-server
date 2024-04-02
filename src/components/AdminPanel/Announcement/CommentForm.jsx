import { useState } from "react";

const CommentForm = ({ announcementId, handlePostComment, isSubmitting }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePostComment(announcementId, comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        disabled={isSubmitting} // Disable textarea when submitting
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};
export default CommentForm;
