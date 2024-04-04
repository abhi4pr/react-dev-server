// Announcement.js
import React, { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import ReactionButton from "./ReactionButton";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import AnnoucementComments from "./AnnoucementComments";
import Interactions from "./Interactions";
import { Drawer, Modal } from "@mui/material";
import AnnoucementReactionView from "./AnnoucementReactionView";

const Announcement = ({
  announcement,
  comments,
  handleReaction,
  handlePostComment,
  fetchComments,
}) => {
  const [loginUserData, setLoginUserData] = useState([]);
  const [showCommentlist, setShowCommentlist] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [reactionData, setReactionData] = useState({});
  const reactionObj = {
    like: "👍",
    haha: "😂",
    love: "😍",
    sad: "😔",
    clap: "👏",
  };
  const reactionTypes = ["like", "haha", "love", "sad", "clap"];
  const [isOpen, setIsOpen] = React.useState(false);
  const [idsToShow, setIdsToShow] = useState(
    Object.values(announcement.reactions).flat()
  );

  const handleFilter = (reaction) => {
    if (reaction === "all") {
      // Flatten all ID arrays into one
      setIdsToShow(Object.values(announcement.reactions).flat());
    } else {
      setIdsToShow(announcement.reactions[reaction]);
    }
  };
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const [selectedReaction, setSelectedReaction] = useState("");

  const loginUserId = decodedToken.id;
  const handleReactionClick = (reactionType) => {
    handleReaction(announcement._id, reactionType);
    setSelectedReaction(reactionType);
  };

  const toggleCommentForm = () => {
    if (!showCommentlist) setShowCommentForm(!showCommentForm);
  };

  const toggleCommentList = () => {
    if (showCommentForm === true && showCommentlist === true) {
      setShowCommentlist(!showCommentlist);

      setShowCommentForm(!showCommentForm);
    } else if (showCommentForm === true && showCommentlist === false) {
      setShowCommentlist(true);
    } else if (showCommentForm === false && showCommentlist === true) {
      setShowCommentForm(true);
    } else {
      setShowCommentlist(!showCommentlist);
      setShowCommentForm(!showCommentForm);
    }
    if (!showCommentlist) fetchComments();
  };

  document.querySelectorAll(".card .emoji").forEach((emoji, index) => {
    emoji.style.animation = `moveUp 0.3s ease forwards ${index * 0.1}s`;
  });

  useEffect(() => {
    axios
      .post(baseUrl + "login_user_data", {
        user_id: loginUserId,
      })
      .then((res) => setLoginUserData(res.data));
  }, []);
  return (
    <div className="card">
      <div className="card-header sb">
        <h5> {announcement.post_subject}</h5>
        <div className="nav-item dropdown">
          <div
            className="i"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <div
              data-bs-toggle="collapse"
              data-bs-target="#Notificationbar"
              aria-expanded="false"
              aria-controls="Notificationbar"
              alt=""
              width={20}
            >
              <i class="bi bi-three-dots-vertical"></i>
            </div>
          </div>
          <div className="dropdown-menu notification  dropdown-menu-right shadow animated--grow-in mt1">
            <div className="pack d-flex flex-column">
              <div className="d-flex flex-row w-100 gap4">
                <i class="bi bi-pencil"></i>
                <p>Edit</p>
              </div>
              <div className="pro-btn d-flex flex-row w-100 gap4">
                <i class="bi bi-clipboard"></i>
                <p>Copy URL</p>
              </div>
              <div className="pro-btn d-flex flex-row w-100 gap4">
                <i class="bi bi-trash"></i>
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div dangerouslySetInnerHTML={{ __html: announcement.post_content }} />
        <br />
        <p className="rec-com">Published by {announcement.created_by}</p>
      </div>
      <div className="card-foot">
        <div className="pack w-100 sb">
          <div className="d-flex flex-row gap4">
            <span
              className="rec-btn"
              style={{ cursor: "pointer", position: "relative" }}
            >
              {selectedReaction ? (
                <div onClick={() => setSelectedReaction("")}>
                  {reactionObj[selectedReaction]} {selectedReaction}
                </div>
              ) : (
                "👍🏼 Like"
              )}

              <div
                className="card d-flex flex-row p-2 justify-content-center align-items-center"
                style={{
                  position: "absolute",
                  left: "-10px",
                  top: "-47px",
                  width: "250px",
                  gap: "20px",
                  fontSize: "20px",
                }}
              >
                {reactionTypes.map((type, index) => (
                  <span
                    key={index}
                    className="emoji"
                    onClick={() => {
                      handleReactionClick(type);
                    }}
                  >
                    {reactionObj[type]}
                  </span>
                ))}
              </div>
            </span>{" "}
            &nbsp; &nbsp; &nbsp;
            <p style={{ cursor: "pointer" }} onClick={toggleCommentForm}>
              🗨️ Comments
            </p>
          </div>
          <div className="pack d-flex flex-row gap4 rec-com">
            <p
              className="rec-com"
              style={{ cursor: "pointer" }}
              onClick={toggleDrawer(true)}
            >
              {announcement.reactions.like.length +
                announcement.reactions.clap.length +
                announcement.reactions.haha.length +
                announcement.reactions.sad.length +
                announcement.reactions.love.length}{" "}
              Reactions
            </p>{" "}
            <i className="bi bi-dot"></i>{" "}
            <p
              className="rec-com"
              style={{ cursor: "pointer" }}
              onClick={toggleCommentList}
            >
              {comments.length} Comments
            </p>
          </div>
        </div>
        &nbsp;
        <div className="pack w-100"></div>
        {showCommentlist && (
          <div className="pack w-100">
            <Interactions announcement={announcement} />
            <br />

            <AnnoucementComments
              comments={comments}
              loginUserData={loginUserData}
            />
            <br />
          </div>
        )}
        {showCommentForm && (
          <div
            className="pack d-flex flex-row gap4 w-100"
            style={{ alignItems: "center" }}
          >
            <div className="profile-sec" style={{ alignItems: "center" }}>
              <div className="profile-img">
                <img src={imageTest1} alt="" width={40} />
              </div>
            </div>
            &nbsp;
            <CommentForm
              announcementId={announcement._id}
              handlePostComment={handlePostComment}
            />
          </div>
        )}
      </div>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <div
          className="card h-100"
          style={{ width: "500px", borderRadius: "0px" }}
        >
          <div
            className="d-flex p-1 flex-row sb pr-3 pl-3"
            style={{ background: "var(--gray-900)", height: "50px" }}
          >
            <h4 style={{ color: "var(--white)" }}>Reactions</h4>
            <h4
              style={{ color: "var(--white)", cursor: "pointer" }}
              onClick={toggleDrawer(false)}
            >
              x
            </h4>
          </div>

          <AnnoucementReactionView
            announcementId={announcement._id}
            isOpen={isOpen}
            reactionType={reactionTypes}
            reactionObj={reactionObj}
            reactionData={reactionData}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default Announcement;
