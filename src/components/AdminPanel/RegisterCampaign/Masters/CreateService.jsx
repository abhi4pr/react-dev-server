import React, { useState } from "react";
import CreateMaster from "./CreateMaster";
const CreateService = () => {

  return (
    <>
      <CreateMaster name={"Service"}
      data ={[{label:"name",payload:"name"},
      {label:"description",payload:"description"}
      ]}/>
    </>
  );
};

export default CreateService;
