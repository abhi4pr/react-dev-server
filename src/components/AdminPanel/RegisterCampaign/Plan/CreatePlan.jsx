import { useState } from "react";
import PageDetailingForDirect from "./PageDetailingForDirect";



const CreatePlan = () => {
  return (
    <>
      <div>
        <div className="form_heading_title">
          <h2 className="form-heading">Plan Creation</h2>
        </div>
      </div>


      <PageDetailingForDirect
        pageName={"planCreation"}
      />
    </>
  )
}

export default CreatePlan
