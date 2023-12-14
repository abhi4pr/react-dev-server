import React from "react";

const ReadyToOnboardContent = ({ handleIamReady, closeModal }) => {
  return (
    <>
      🚀 Welcome to CreativeFuel! 🚀 Hey there, a new star! 🌟 As you log in to
      your dashboard today, remember that you're not just joining a team; you're
      joining a mission to the creative cosmos! 🌌 You've just opened the door
      to a world where creativity knows no bounds. Here, we paint outside the
      lines and dream in every rainbow colour. Let's unleash the power of
      imagination together! P.S.: Watch out for flying ideas and spontaneous
      brainstorming showers! Keep your wit umbrella handy! ☔️
      <button
        className="btn btn-primary"
        onClick={() => {
          handleIamReady(), closeModal();
        }}
      >
        I am ready to get onboard
      </button>
    </>
  );
};

export default ReadyToOnboardContent;
