import { useEffect, useState } from "react";
import "./UserView.css";
import blankProfilePic from "../../../assets/img/product/blankProfilePic.webp";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { FcDownload } from "react-icons/fc";
import DateFormattingComponent from "../../DateFormator/DateFormared";
import { get } from "jquery";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import UserSingleTab1 from "./UserSingleTab1";
import UserSingleTab2 from "./UserSingleTab2";
import UserSingleTab4 from "./UserSingleTab4";
import UserSingleTab3 from "./UserSingleTab3";
import DocumentTabUserSingle from "./DocumentTabUserSingle";
import { baseUrl } from "../../../utils/config";
import UserSingleTab5 from "./UserSingle5";
import UserSingleTab6 from "./UserSingle6";

const UserSingle = () => {
  const whatsappApi = WhatsappAPI();
  const [KRIData, setKRIData] = useState([]);
  const { id } = useParams();
  const [subDeptId, setSubDeptId] = useState([]);
  const [subDept, setSubDept] = useState();
  const [otherDocuments, setOtherDocuments] = useState("");
  const [defaultSeatData, setDefaultSeatData] = useState([]);
  const [roomId, setRoomId] = useState();
  const [userProfileImage, setUserProfileImage] = useState(null);

  const [educationData, setEducationData] = useState([]);

  const KRAAPI = (userId) => {
    axios.get(`${baseUrl}` + `get_single_kra/${userId}`).then((res) => {
      setKRIData(res.data);
    });
  };
  function userOtherDocuments() {
    axios.get(`${baseUrl}` + `get_user_other_fields/${id}`).then((res) => {
      setOtherDocuments(res.data.data);
    });
  }

  const [familyData, seFamilyData] = useState([]);
  useEffect(() => {
    axios.get(baseUrl + "get_all_sittings").then((res) => {
      setDefaultSeatData(res.data.data);
    });
    axios.get(baseUrl + `get_single_education/${id}`).then((res) => {
      setEducationData(res.data.data);
    });
    axios.get(baseUrl + `get_single_family/${id}`).then((res) => {
      seFamilyData(res.data.data);
    });
    KRAAPI(id);
  }, []);

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const [user, setUser] = useState([]);
  let fetchedData;
  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${id}`).then((res) => {
      fetchedData = res.data;
      const { dept_id } = fetchedData;
      setUser(fetchedData);
      setSubDeptId(dept_id);
      console.log(fetchedData);
      setUserProfileImage(fetchedData.image_url);
    });
  };

  useEffect(() => {
    getData();
    userOtherDocuments();
  }, [id]);

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  useEffect(() => {
    const selectedOption = defaultSeatData?.find(
      (option) => option?.sitting_id === Number(user?.sitting_id)
    );
    setRoomId(selectedOption);
  }, [defaultSeatData, user?.sitting_id]);
  const accordionButtons = [
    "General",
    "Professional",
    "KRA",
    "Documents",
    "Family",
    "Education",
    // "Documents",
  ];

  return (
    <>
      <div className="box">
        <div id="content">
          <div className="profileInfo_imgbox">
            {user.image ? (
              <img
                src={userProfileImage}
                alt="Circular Image"
                className="img-fluid"
              />
            ) : (
              <img
                src={blankProfilePic}
                alt="Circular Image"
                className="img-fluid"
              />
            )}
          </div>
          <FormContainer
            submitButton={false}
            mainTitle="User"
            title="User Registration"
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          >
            {activeAccordionIndex === 0 && (
              <UserSingleTab1 user={user} roomId={roomId} />
            )}
            {activeAccordionIndex === 1 && <UserSingleTab2 user={user} />}
            {activeAccordionIndex === 2 && <UserSingleTab3 KRIData={KRIData} />}
            {activeAccordionIndex == 3 && <DocumentTabUserSingle id={id} />}
            {activeAccordionIndex == 4 && (
              <UserSingleTab5 familyData={familyData} />
            )}
            {activeAccordionIndex == 5 && (
              <UserSingleTab6 educationData={educationData} />
            )}
          </FormContainer>
        </div>
      </div>
    </>
  );
};

export default UserSingle;
