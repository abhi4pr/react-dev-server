// Announcement.js
import React, { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import ReactionButton from "./ReactionButton";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";

const Announcement = ({
  announcement,
  comments,
  handleReaction,
  handlePostComment,
  fetchComments,
}) => {
  const [loginUserData, setLoginUserData] = useState([])
  const [showCommentlist, setShowCommentlist] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const reactionObj = {
    like: "👍", haha: "😂", love: "😍", sad: "😔", clap: "👏"
  }
  const reactionTypes = ["like", "haha", "love", "sad", "clap"];
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const loginUserId = decodedToken.id;
  const handleReactionClick = (reactionType) => {
    handleReaction(announcement._id, reactionType);
  };

  const toggleCommentForm = () => {
    if (!showCommentlist)
      setShowCommentForm(!showCommentForm);

  };
  const toggleCommentList = () => {
    if (showCommentForm === true && showCommentlist === true) {
      setShowCommentlist(!showCommentlist);

      setShowCommentForm(!showCommentForm);
    }
    else
      if (showCommentForm === true && showCommentlist === false) {
        setShowCommentlist(true);
      }
      else if (showCommentForm === false && showCommentlist === true) {
        setShowCommentForm(true);
      }
      else {
        setShowCommentlist(!showCommentlist);

        setShowCommentForm(!showCommentForm);
      }




    if (!showCommentlist) fetchComments(); // Fetch comments when the comment form is shown
  };
  console.log(announcement);
  document.querySelectorAll('.card .emoji').forEach((emoji, index) => {
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
              <div data-bs-toggle="collapse" data-bs-target="#Notificationbar" aria-expanded="false" aria-controls="Notificationbar" alt="" width={20} >
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

        </div>
        <div className="card-foot">
          <div className="pack w-100 sb">

            <div className="d-flex flex-row gap4">
              <p className="rec-btn" style={{ cursor: "pointer", position: "relative" }}>👍Like
                <div className="card d-flex flex-row p-2 justify-content-center align-items-center" style={{ position: "absolute", left: "-10px", top: "-47px", width: "250px", gap: "20px", fontSize: "20px" }}>
                  {reactionTypes.map((type, index) => (<span key={index} className="emoji" onClick={()=>{handleReactionClick(type)}}>{reactionObj[type]}</span>))}
                </div>
              </p> &nbsp; &nbsp; &nbsp;
              <p style={{ cursor: "pointer" }} onClick={toggleCommentForm} >🗨️ Comments</p>
            </div>
            <div className="pack d-flex flex-row gap4 rec-com" >
              <p className="rec-com">{announcement.reactions.like.length + announcement.reactions.clap.length + announcement.reactions.haha.length + announcement.reactions.sad.length + announcement.reactions.love.length} Reactions</p> <i className="bi bi-dot"></i> <p className="rec-com" style={{ cursor: "pointer" }} onClick={toggleCommentList}>{comments.length} Comments</p>
            </div>
          </div>
          &nbsp;
          <div className="pack w-100">


          </div>
          {
            showCommentlist && (
              <div className="pack w-100">
                <p className="bold">Interactions</p>
                <br />
                <div className="d-flex flex-row " style={{ gap: "50px" }}>
                  <div className="d-flex flex-column" style={{ justifyContent: "center", alignItems: "center" }}>
                    <h5>👍</h5>
                    <p className="rec-com">{announcement.reactions.like.length}</p>
                  </div>
                  <div className="d-flex flex-column" style={{ justifyContent: "center", alignItems: "center" }}>
                    <h5>👏</h5>
                    <p className="rec-com">{announcement.reactions.clap.length}</p>
                  </div>
                  <div className="d-flex flex-column" style={{ justifyContent: "center", alignItems: "center" }}>
                    <h5>😍</h5>
                    <p className="rec-com">{announcement.reactions.love.length}</p>
                  </div>
                  <div className="d-flex flex-column" style={{ justifyContent: "center", alignItems: "center" }}>
                    <h5>😂</h5>
                    <p className="rec-com">{announcement.reactions.haha.length}</p>
                  </div>
                  <div className="d-flex flex-column" style={{ justifyContent: "center", alignItems: "center" }}>
                    <h5>😔</h5>
                    <p className="rec-com">{announcement.reactions.sad.length}</p>
                  </div>
                </div>
                <br />
                    <div className="pack">
                      <p className="bold">Comments</p>
                      <br />
                {
                  comments.map((comment, index) => (
                    <>
                      <div className="pack d-flex flex-row gap4 sb align-items-start" key={index}>
                        <div className="pack d-flex flex-row gap4">

                          <div className="profile-sec" style={{ alignItems: "flex-start" }}>
                            {loginUserData[0]?.image == null ? (
                              <div className="profile-img">
                                <img src={imageTest1} alt="" width={40} />
                              </div>
                            ) : (
                              
                              <img
                              key={1}
                                className="img-profile"
                                src={loginUserData[0]?.image}
                                alt="user"
                              />

                              )}
                          </div>
                          &nbsp;
                          <div className="d-flex flex-column">
                            <p className="bold">{comment.user_name}</p>
                            <br />
                            <p>{comment.comment}</p>
                            <br />
                            <p className="rec-com"> {new Date(comment.createdAt).toLocaleString('en-US', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}</p>
                          </div>
                        </div>
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
                            <div data-bs-toggle="collapse" data-bs-target="#Notificationbar" aria-expanded="false" aria-controls="Notificationbar" alt="" width={20} >
                              <i class="bi bi-three-dots-vertical"></i>
                            </div>

                          </div>
                          <div className="dropdown-menu notification  dropdown-menu-right shadow animated--grow-in mt1" style={{ border: "1px solid var(--border)" }}>
                            <div className="pack d-flex flex-column">
                              <div className="d-flex flex-row w-100 gap4">
                                <i class="bi bi-pencil"></i>
                                <p>Edit</p>
                              </div>

                              <div className="pro-btn d-flex flex-row w-100 gap4">
                                <i class="bi bi-trash"></i>
                                <p>Delete</p>
                              </div>
                            </div>
                          </div>
                        </div>



                      </div>
                      <br />
                </>
                  ))
                }

                    </div>

                <br />
              </div>

            )
          }

          {showCommentForm && (
            <div className="pack d-flex flex-row gap4 w-100" style={{ alignItems: "center" }} >
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
      </div>

  );
};

export default Announcement;
