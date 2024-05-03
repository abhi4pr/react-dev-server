import React from "react";

const CocTabPreonboarding = ({ cocData }) => {
  return (
    <>
      <div
        style={{ color: "white" }}
        dangerouslySetInnerHTML={{ __html: cocData }}
      ></div>
    </>
  );
};

export default CocTabPreonboarding;
