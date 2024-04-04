import React from "react";

const Interactions = ({ announcement }) => {
  return (
    <>
      <p className="bold">Interactions</p>
      <br />
      <div className="d-flex flex-row " style={{ gap: "50px" }}>
        <div
          className="d-flex flex-column"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <h5>👍</h5>
          <p className="rec-com">{announcement.reactions.like.length}</p>
        </div>
        <div
          className="d-flex flex-column"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <h5>👏</h5>
          <p className="rec-com">{announcement.reactions.clap.length}</p>
        </div>
        <div
          className="d-flex flex-column"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <h5>😍</h5>
          <p className="rec-com">{announcement.reactions.love.length}</p>
        </div>
        <div
          className="d-flex flex-column"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <h5>😂</h5>
          <p className="rec-com">{announcement.reactions.haha.length}</p>
        </div>
        <div
          className="d-flex flex-column"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <h5>😔</h5>
          <p className="rec-com">{announcement.reactions.sad.length}</p>
        </div>
      </div>
    </>
  );
};

export default Interactions;
