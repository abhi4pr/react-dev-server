import React from "react";

const CocTabPreonboarding = ({ cocData }) => {
  console.log(cocData, "coc data");
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: cocData }}></div>
    </>
  );
};

export default CocTabPreonboarding;
