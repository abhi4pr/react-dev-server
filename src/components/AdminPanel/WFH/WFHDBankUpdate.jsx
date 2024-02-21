import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";

const WFHDBankUpdate = () => {
  
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { user_id } = useParams();
  const [user, setUser] = useState({});
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();

  const [isUpdaing, setIsUpdating] = useState(false);

  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${user_id}`).then((res) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
  
      
  
      navigate("/admin/wfhd-overview");
      toastAlert("Documents Updated");
      getDocuments();
    } catch (error) {
      console.error("Error submitting documents", error);
    } finally {
      setIsUpdating(false);
    }
  };
  

  useEffect(() => {
    
  }, []);

  return (
    <>
      <div
        className={`documentarea`}
      >
        <div className="document_box">
          <h2>Documents</h2>
          
          <FieldContainer
            label="Alternate Contact"
            type="number"
            fieldGrid={3}
            value={'contact'}
            required={false}
            onChange={'handleContactChange'}
          />
        </div>
      </div>
    </>
  );
};

export default WFHDBankUpdate;