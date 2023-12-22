import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditEmailTemp = () => {
  const { id } = useParams();
  const [emailFor, setEmailFor] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  useEffect(() => {
    axios.get(`http://34.93.221.166:3000/api/get_single_email_content/${id}`).then((res) => {
      const fetchedData = res.data.data;
      setEmailFor(fetchedData.email_for);
      setEmailContent(fetchedData.email_content);
      setRemarks(fetchedData.remarks);
    });
  }, []);  

  const handleSubmit = async (e) => {
    e.preventDefault();
                
      await axios.post("http://34.93.221.166:3000/api/update_email_content",{
        _id: id,
        email_for: emailFor,
        email_content: emailContent,
        remarks: remarks,
        updated_by: loginUserId
      });

      toastAlert("Email templated updated");
      setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/all-email-templates" />;
  }

    return (
      <>
      <FormContainer
        mainTitle="Email Template"
        title="Edit Template"
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
          onChange={(e)=> setRemarks(e.target.value)}
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
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'color': []}, {'background': []}], 
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image'],
              ['clean']
            ],
          }}
          formats={[
            'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent',
            'link', 'image', 'color', 'background' 
          ]}
          style={{marginBottom:"5%"}}
        />

      </FormContainer>
      </>  
    );
};

export default EditEmailTemp;