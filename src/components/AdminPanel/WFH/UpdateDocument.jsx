import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";
import DocumentTab from "../../PreOnboarding/DocumentTab";
import { useParams } from "react-router-dom";

const UpdateDocument = () => {
  const [documentData, setDocumentData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { user_id } = useParams();

  async function getDocuments() {
    const response = await axios.post(baseUrl + "get_user_doc", {
      user_id: user_id,
    });
    setDocumentData(response.data.data);
    
    axios.put(baseUrl+'update_user',{
      user_id: user_id,
      att_status: 'document_upload'
    })
  }

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <DocumentTab
      documentData={documentData}
      setDocumentData={setDocumentData}
      getDocuments={getDocuments}
      submitButton={true}
      normalUserLayout={true}
    />
  );
};

export default UpdateDocument;
