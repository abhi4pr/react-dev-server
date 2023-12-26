import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddEmailTemp = () => {
  const [emailFor, setEmailFor] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://34.93.221.166:3000/api/add_email_content", {
      email_for: emailFor,
      email_content: emailContent,
      remarks: remarks,
      created_by: loginUserId,
    });

    toastAlert("Email templated created");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/all-email-templates" />;
  }

  return (
    <>
      <div class="alert alert-danger">
        <strong>
          Use {`{{user_name}}`} for user name, use {`{{user_email}}`} for user
          email, use {`{{user_password}}`} for user password, use{" "}
          {`{{designation}}`} for user designation, use {`{{user_address}}`} for
          user address, use {`{{user_login_id}}`} for user login id, use{" "}
          {`{{sitting_area}}`} for user sitting area, use {`{{sitting_ref}}`}{" "}
          for user sitting reference number, use {`{{user_contact}}`} for user
          contact, use {`{{user_reportTo}}`} for user report to whom. use{" "}
          {`{{asset_name}}`} for asset name.
        </strong>
      </div>

      <FormContainer
        mainTitle="Email Template"
        title="Add Template"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Email Template for"
          type="text"
          fieldGrid={6}
          value={emailFor}
          onChange={(e) => setEmailFor(e.target.value)}
        />

        <FieldContainer
          label="Remarks"
          fieldGrid={6}
          value={remarks}
          required={false}
          onChange={(e) => setRemarks(e.target.value)}
        />

        {/* <FieldContainer
          label="Email Content"
          fieldGrid={12}
          required={false}
          value={emailContent}
          onChange={(e)=> setEmailContent(e.target.value)}
        /> */}

        <ReactQuill
          theme="snow"
          value={emailContent}
          onChange={setEmailContent}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ color: [] }, { background: [] }],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "color",
            "background",
          ]}
          style={{ marginBottom: "5%" }}
        />
      </FormContainer>
    </>
  );
};

export default AddEmailTemp;
