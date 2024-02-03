import React from "react";

const CocTabPreonboarding = ({ cocData }) => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: cocData }}></div>
    </>
  );
};

export default CocTabPreonboarding;
