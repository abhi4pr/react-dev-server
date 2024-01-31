import { useEffect, useState } from "react";
import "./UserView.css";
import Logo from "../../../assets/img/logo/logo.png";
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

const UserSingle = () => {
  const whatsappApi = WhatsappAPI();
  const [KRIData, setKRIData] = useState([]);
  const { id } = useParams();
  const [subDeptId, setSubDeptId] = useState([]);
  const [subDept, setSubDept] = useState();
  const [otherDocuments, setOtherDocuments] = useState("");
  const [defaultSeatData, setDefaultSeatData] = useState([]);
  const [roomId, setRoomId] = useState();

  //documents Reason
  // const [panReason, setPanReason] = useState("");
  // const [panReasonActive, setPanReasonActive] = useState(false);

  // const [uidReason, setUidReason] = useState("");
  // const [uidReasonActive, setUidReasonActive] = useState(false);

  // const [tenthMarksheetReason, setTenthMarksheetReason] = useState("");
  // const [tenthMarksheetReasonActive, setTenthMarksheetReasonActive] =
  //   useState(false);

  // const [twelfthMarksheetReason, setTwelfthMarksheetReason] = useState("");
  // const [twelfthMarksheetReasonActive, setTwelfthMarksheetReasonActive] =
  //   useState(false);

  // const [UGMarksheetReason, setUGMarksheetReason] = useState("");
  // const [UGMarksheetReasonActive, setUGMarksheetReasonActive] = useState(false);

  // const [passportReason, setPassportReason] = useState("");
  // const [passportReasonActive, setPassportReasonActive] = useState(false);

  // const [preOfferLetterReason, setPreviousOfferLetterReason] = useState("");
  // const [preOfferLetterReasonActive, setPreviousOfferLetterReasonActive] =
  //   useState(false);

  // const [preExpLetterReason, setPreExpLetterReason] = useState("");
  // const [preExpLetterReasonActive, setPreExpLetterReasonActive] =
  //   useState(false);

  // const [preRelievingLetterReason, setPreRelievingLetter] = useState("");
  // const [preRelievingLetterReasonActive, setPreRelievingLetterActive] =
  //   useState(false);

  // const [bankPassChequeReason, setBankPassChequeReason] = useState("");
  // const [bankPassChequeReasonActive, setBankPassChequeReasonActive] =
  //   useState(false);
  //documents reason End

  const KRAAPI = (userId) => {
    axios
      .get(`${baseUrl}`+`get_single_kra/${userId}`)
      .then((res) => {
        setKRIData(res.data);
      });
  };
  function userOtherDocuments() {
    axios
      .get(`${baseUrl}`+`get_user_other_fields/${id}`)
      .then((res) => {
        setOtherDocuments(res.data.data);
      });
  }
  // const subDep = async (dept_id) => {
  //   await axios
  //     .get(`${baseUrl}`+`subdept/${dept_id}`)
  //     .then((res) => {
  //       setSubDept(res.data);
  //     });
  // };
  useEffect(() => {
    axios.get(baseUrl+"get_all_sittings").then((res) => {
      setDefaultSeatData(res.data.data);
    });
    KRAAPI(id);
  }, []);

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const [user, setUser] = useState([]);
  let fetchedData;
  const getData = () => {
    axios
      .get(`${baseUrl}`+`get_single_user/${id}`)
      .then((res) => {
        fetchedData = res.data;
        const { dept_id } = fetchedData;
        setUser(fetchedData);
        setSubDeptId(dept_id);
      });
  };

  useEffect(() => {
    getData();
    // subDep(subDeptId);
    userOtherDocuments();
  }, [id]);

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  useEffect(() => {
    const selectedOption = defaultSeatData.find(
      (option) => option?.sitting_id === Number(user?.sitting_id)
    );
    setRoomId(selectedOption);
  }, [defaultSeatData, user?.sitting_id]);
  const accordionButtons = [
    "Genral",
    "Professional",
    "KRA",
    "Documents",
    // "Documents",
  ];

  const handleVerification = (
    e,
    fieldName,
    action,
    reasonField,
    reason,
    emptyState,
    hideField
  ) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("user_id", Number(id));
    formData.append(fieldName, action);
    if (emptyState && hideField) {
      formData.append(reasonField, reason);
    }

    axios({
      method: "put",
      url: baseUrl+"update_user",
      data: formData,
    }).then(() => {
      if (emptyState) emptyState("");
      if (hideField) hideField(false);
    });
    const constaWhatsapp = user.user_contact_no + "";
    whatsappApi
      .callWhatsAPI("CF_Upload_verification", constaWhatsapp, user.user_name, [
        user.user_name,
      ])
      .then(() => getData())
      .then(() => {
        axios
          .post(baseUrl+"add_send_user_mail", {
            email: fetchedData[0].user_email_id,
            subject: "User Onboard",
            text: "Your Some Document is not clear Plzz Upload Again",
            attachment: "profile",
            login_id: user.user_login_id,
            name: user.user_name,
            password: user.user_login_password,
          })
          .then((res) => {
            console.log("Email sent successfully:", res.data);
          })
          .catch((error) => {
            console.log("Failed to send email:", error);
          });
      });
  };

  // const tab3 = (
  //   <>
  //     <DataTable
  //       columns={[
  //         {
  //           name: "s.no",
  //           cell: (row, index) => <div>{index + 1}</div>,
  //         },
  //         { name: "Name", selector: "user_name" },
  //         { name: "Department", selector: "department_name" },
  //         {
  //           name: "Job Responsibility",
  //           selector: "sjob_responsibility",
  //         },
  //       ]}
  //       data={KRIData}
  //       highlightOnHover
  //     />
  //   </>
  // );

  // const tab4 = (
  //   <>
  //     <div className="documentCard_view">
  //       <div className="row align-items-baseline">
  //         {user.image_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     className="img-fluid"
  //                     src={user.image_url}
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>Image</h3>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //         {user.pan_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     className="img-fluid"
  //                     src={user.pan_url}
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>PAN</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.pan_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(e, "pan_validate", "Approve")
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setPanReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject data={user?.pan_validate} />
  //                 </div>

  //                 {panReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={panReason}
  //                       onChange={(e) => setPanReason(e.target.value)}
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "pan_validate",
  //                           "Reject",
  //                           "pan_remark",
  //                           panReason,
  //                           setPanReason,
  //                           setPanReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //         {/* {user.other_upload_url && (
  //         <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //             <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     className="img-fluid"
  //                     src={user.other_upload_url}
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //               <div className="d-flex justify-content-between mb-4">
  //                 <h3 className="fs-4 mt-2">Other</h3>
  //                 <a
  //                   className="fs-4 mb-2"
  //                   href={user.other_upload_url}
  //                   download
  //                 >
  //                   <FcDownload />
  //                 </a>
  //               </div>
  //               <div className="d-flex">
  //                 <button
  //                   type="button"
  //                   onClick={(e) =>
  //                     handleVerification(e, "pan_validate", "Approve")
  //                   }
  //                 >
  //                   Approve
  //                 </button>
  //                 <button
  //                   type="button"
  //                   onClick={(e) =>
  //                     handleVerification(e, "pan_validate", "Reject")
  //                   }
  //                 >
  //                   Reject
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )} */}
  //         {/* {user.highest_upload_url && (
  //         <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //             <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.highest_upload_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //               <div className="d-flex justify-content-between">
  //                 <h3 className="fs-4 mt-2">Higest Qualification</h3>
  //                 <a
  //                   className="fs-4 mb-2"
  //                   href={user.highest_upload_url}
  //                   download
  //                 >
  //                   <FcDownload />
  //                 </a>
  //               </div>
  //               <div className="d-flex">
  //                 <button
  //                   type="button"
  //                   onClick={(e) =>
  //                     handleVerification(e, "pan_validate", "Approve")
  //                   }
  //                 >
  //                   Approve
  //                 </button>
  //                 <button
  //                   type="button"
  //                   onClick={(e) =>
  //                     handleVerification(e, "pan_validate", "Reject")
  //                   }
  //                 >
  //                   Reject
  //                 </button>
  //               </div>
  //               <h5 className="fs-6">
  //                 <span className="text-black-50 ">
  //                   Higest Qualification :-
  //                 </span>
  //                 {user.highest_qualification_name
  //                   ? user.highest_qualification_name
  //                   : "NA"}
  //               </h5>
  //             </div>
  //           </div>
  //         </div>
  //       )} */}
  //         {user.uid_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.uid_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>UID</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.uid_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(e, "uid_validate", "Approve")
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setUidReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject data={user?.UG_Marksheet_validate} />
  //                 </div>
  //                 {uidReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={uidReason}
  //                       onChange={(e) => uidReason(e.target.value)}
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "uid_validate",
  //                           "Reject",
  //                           "uid_remark",
  //                           uidReason,
  //                           setUidReason,
  //                           setUidReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //                 {/* <h2 className="fs-6 ">
  //                 <span className="lead text-black-50 fs-6">UID No :-</span>
  //                 {user.uid_no}
  //               </h2> */}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {/* rest */}
  //         {user.tenth_marksheet_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.tenth_marksheet_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>X Marksheet</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.tenth_marksheet_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(
  //                         e,
  //                         "tenth_marksheet_validate",
  //                         "Approve"
  //                       )
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setTenthMarksheetReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject data={user?.tenth_marksheet_validate} />
  //                 </div>
  //                 {tenthMarksheetReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={tenthMarksheetReason}
  //                       onChange={(e) =>
  //                         setTenthMarksheetReason(e.target.value)
  //                       }
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "tenth_marksheet_validate",
  //                           "Reject",
  //                           "tenth_marksheet_validate_remark",
  //                           tenthMarksheetReason,
  //                           setTenthMarksheetReason,
  //                           setTenthMarksheetReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {user.twelveth_marksheet_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.twelveth_marksheet_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>XII Marksheet</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.twelveth_marksheet_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(
  //                         e,
  //                         "twelveth_marksheet_validate",
  //                         "Approve"
  //                       )
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setTwelfthMarksheetReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject data={user?.twelveth_marksheet_validate} />
  //                 </div>
  //                 {twelfthMarksheetReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={twelfthMarksheetReason}
  //                       onChange={(e) =>
  //                         setTwelfthMarksheetReason(e.target.value)
  //                       }
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "twelveth_marksheet_validate",
  //                           "Reject",
  //                           "twelveth_marksheet_validate_remark",
  //                           twelfthMarksheetReason,
  //                           setTwelfthMarksheetReason,
  //                           setTwelfthMarksheetReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //                 {/* <h2 className="fs-6 ">
  //                 <span className="lead text-black-50 fs-6">UID No :-</span>
  //                 {user.uid_no}
  //               </h2> */}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {user.UG_Marksheet_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.UG_Marksheet_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>UG Marksheet</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.UG_Marksheet_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(
  //                         e,
  //                         "UG_Marksheet_validate",
  //                         "Approve"
  //                       )
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setUGMarksheetReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject data={user?.UG_Marksheet_validate} />
  //                 </div>
  //                 {UGMarksheetReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={UGMarksheetReason}
  //                       onChange={(e) => setUGMarksheetReason(e.target.value)}
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "UG_Marksheet_validate",
  //                           "Reject",
  //                           "UG_Marksheet_validate_remark",
  //                           UGMarksheetReason,
  //                           setUGMarksheetReason,
  //                           setUGMarksheetReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //                 {/* <h2 className="fs-6 ">
  //                 <span className ="lead text-black-50 fs-6">UID No :-</span>
  //                 {user.uid_no}
  //               </h2> */}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {user.pasport_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.pasport_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>Passport</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.pasport_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(e, "passport_validate", "Approve")
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setPassportReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject data={user?.passport_validate} />
  //                 </div>
  //                 {passportReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={passportReason}
  //                       onChange={(e) => setPassportReason(e.target.value)}
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "passport_validate",
  //                           "Reject",
  //                           "passport_validate_remark",
  //                           passportReason,
  //                           setPassportReason,
  //                           setPassportReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //                 {/* <h2 className="fs-6 ">
  //                 <span className ="lead text-black-50 fs-6">UID No :-</span>
  //                 {user.uid_no}
  //               </h2> */}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {user.pre_off_letter_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.pre_off_letter_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>Previous Company Offer Letter</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.pre_off_letter_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(
  //                         e,
  //                         "pre_off_letter_validate",
  //                         "Approve"
  //                       )
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setPreviousOfferLetterReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject data={user?.pre_off_letter_validate} />
  //                 </div>
  //                 {preOfferLetterReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={preOfferLetterReason}
  //                       onChange={(e) =>
  //                         setPreviousOfferLetterReason(e.target.value)
  //                       }
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "pre_off_letter_validate",
  //                           "Reject",
  //                           "pre_off_letter_validate_remark",
  //                           preOfferLetterReason,
  //                           setPreviousOfferLetterReason,
  //                           setPreviousOfferLetterReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //                 {/* <h2 className="fs-6 ">
  //                 <span className ="lead text-black-50 fs-6">UID No :-</span>
  //                 {user.uid_no}
  //               </h2> */}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {user.pre_expe_letter_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.pre_expe_letter_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>Experience Letter</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.pre_expe_letter_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(
  //                         e,
  //                         "pre_expe_letter_validate",
  //                         "Approve"
  //                       )
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setPreExpLetterReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject data={user?.pre_expe_letter_validate} />
  //                 </div>
  //                 {preExpLetterReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={preExpLetterReason}
  //                       onChange={(e) => setPreExpLetterReason(e.target.value)}
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "pre_expe_letter_validate",
  //                           "Reject",
  //                           "pre_expe_letter_validate_remark",
  //                           preExpLetterReason,
  //                           setPreExpLetterReason,
  //                           setPreExpLetterReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //                 {/* <h2 className="fs-6 ">
  //                 <span className ="lead text-black-50 fs-6">UID No :-</span>
  //                 {user.uid_no}
  //               </h2> */}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {user.Pre_relieving_letter_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.Pre_relieving_letter_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>Relieving Letter</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.Pre_relieving_letter_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(
  //                         e,
  //                         "pre_relieving_letter_validate",
  //                         "Approve"
  //                       )
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setPreRelievingLetterActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject
  //                     data={user?.pre_relieving_letter_validate_remark}
  //                   />
  //                 </div>
  //                 {preRelievingLetterReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={preRelievingLetterReason}
  //                       onChange={(e) => setPreRelievingLetter(e.target.value)}
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "pre_relieving_letter_validate",
  //                           "Reject",
  //                           "pre_relieving_letter_validate_remark",
  //                           preRelievingLetterReason,
  //                           setPreRelievingLetter,
  //                           setPreRelievingLetterActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //                 {/* <h2 className="fs-6 ">
  //                 <span className ="lead text-black-50 fs-6">UID No :-</span>
  //                 {user.uid_no}
  //               </h2> */}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {user.bankPassBook_Cheque_url && (
  //           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
  //             <div className="card documentCard_bx">
  //               <div className="card-body">
  //                 <div className="img-thumbnail">
  //                   <img
  //                     src={user.bankPassBook_Cheque_url}
  //                     className="img-fluid"
  //                     alt="user_photo"
  //                   />
  //                 </div>
  //                 <div className="documentCard_text">
  //                   <h3>Bank Passbook/Cheque</h3>
  //                   <div className="documentCard_download">
  //                     <a href={user.bankPassBook_Cheque_url} download>
  //                       <FcDownload />
  //                     </a>
  //                   </div>
  //                 </div>
  //                 <div className="documentCard_action">
  //                   <button
  //                     className="btn btn-sm btn-success"
  //                     type="button"
  //                     onClick={(e) =>
  //                       handleVerification(
  //                         e,
  //                         "bankPassBook_Cheque_validate",
  //                         "Approve"
  //                       )
  //                     }
  //                   >
  //                     Approve
  //                   </button>
  //                   <button
  //                     className="btn btn-sm btn-danger"
  //                     type="button"
  //                     onClick={() => setBankPassChequeReasonActive(true)}
  //                   >
  //                     Reject
  //                   </button>
  //                   <ApproveReject
  //                     data={user?.bankPassBook_Cheque_validate_remark}
  //                   />
  //                 </div>
  //                 {bankPassChequeReasonActive && (
  //                   <div className="documentCard_input">
  //                     <input
  //                       className="form-control"
  //                       type="text"
  //                       value={bankPassChequeReason}
  //                       onChange={(e) =>
  //                         setBankPassChequeReason(e.target.value)
  //                       }
  //                     />
  //                     <button
  //                       className="btn btn-sm btn-primary"
  //                       type="button"
  //                       onClick={(e) =>
  //                         handleVerification(
  //                           e,
  //                           "bankPassBook_Cheque_validate",
  //                           "Reject",
  //                           "bankPassBook_Cheque_validate_remark",
  //                           bankPassChequeReason,
  //                           setBankPassChequeReason,
  //                           setBankPassChequeReasonActive
  //                         )
  //                       }
  //                     >
  //                       Submit
  //                     </button>
  //                   </div>
  //                 )}
  //                 {/* <h2 className="fs-6 ">
  //                 <span className ="lead text-black-50 fs-6">UID No :-</span>
  //                 {user.uid_no}
  //               </h2> */}
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {otherDocuments &&
  //           otherDocuments.map((item, i) => {
  //             return (
  //               <div
  //                 key={i}
  //                 className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
  //               >
  //                 <div className="card documentCard_bx">
  //                   <div className="card-body">
  //                     {/* <h2>{item.field_name}</h2> */}
  //                     <div className="img-thumbnail">
  //                       <img
  //                         src={item.field_value}
  //                         className="img-fluid"
  //                         alt="user_photo"
  //                       />
  //                     </div>
  //                     <div className="documentCard_text">
  //                       <h3>{item.field_name}</h3>
  //                       <div className="documentCard_download">
  //                         <a
  //                           className="fs-4 mb-2"
  //                           href={item.field_value}
  //                           download
  //                         >
  //                           <FcDownload />
  //                         </a>
  //                       </div>
  //                     </div>

  //                     {/* <h2 className="fs-6 "><span className="lead text-black-50 fs-6">UID No :-</span>{user.uid_no}</h2> */}
  //                   </div>
  //                 </div>
  //               </div>
  //             );
  //           })}
  //       </div>
  //     </div>
  //   </>
  // );

  return (
    <>
      <div className="box">
        <div id="content">
          <div className="profileInfo_imgbox">
            <img src={Logo} alt="Circular Image" className="img-fluid" />
          </div>
          <FormContainer
            submitButton={false}
            mainTitle="User"
            title="User Registration"
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          >
            {activeAccordionIndex === 0 && <UserSingleTab1 user={user} />}
            {activeAccordionIndex === 1 && <UserSingleTab2 user={user} />}
            {activeAccordionIndex === 2 && <UserSingleTab3 KRIData={KRIData} />}
            {/* {activeAccordionIndex === 3 && (
              <UserSingleTab4 user={user} id={id} getData={getData} />
            )} */}
            {activeAccordionIndex == 3 && <DocumentTabUserSingle id={id} />}
          </FormContainer>
        </div>
      </div>
    </>
  );
};

export default UserSingle;
