import React, { useState } from "react";
import CreateMaster from "./CreateMaster";
const CreateAgency = () => {

  return (
    <>
      <CreateMaster
        name={'Agency'}
        data={[
            {label:"Name",payload:"name"},{label:"Mobile",payload:"mobile"},{label:"Alternate Mobile",payload:"alternateMobile"},
            {label:"City",payload:"city"}, {label:"Instagram",payload:"instagram"}, {label:"Email",payload:"email"}, {label:"Remark",payload:"remark"}
        ]}
      />
    </>
  );
};

export default CreateAgency;
