import React, { useState } from "react";
import FormContainer from "../FormContainer";
import { DataGrid } from "@mui/x-data-grid";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";

import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  OutlinedInput,
  Paper,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from "@mui/material";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import { useEffect } from "react";
import axios from "axios";
import { Page } from "@react-pdf/renderer";
import {baseUrl} from '../../../utils/config'

export default function RegisteredCampaign() {
  const navigate = useNavigate();
  const params = useParams();
  const [reload, setReload] = useState(false);
  const [contentTypeList, setContentTypeList] = useState([]);
  const [formData, setFormData] = useState({
    videoCount: "",
    campaignBrief: "",
    fields: [
      { selectValue: null, textValue: "", brief: "", uploadLink: "", file: "" },
    ],
  });
  const [errors, setErrors] = useState({});

  const [commits, setCommits] = useState([]);
  const [table1Data, setTable1Data] = useState([{}]);
  const [table2Data, setTable2Data] = useState([{}]);
  const [loadTable1, SetLoadTable1] = useState(false);
  const [table1Data2, setTable1Data2] = useState(false);
  const [brandName, setBrandName] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [commitmentModalData, setCommitmentModalData] = useState([{}]);
  const [campaignId, setCampaignId] = useState("");
  const [campignData, setCampignData] = useState([{}]);
  const [deleteRowModal, setDeleteRowModal] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState("");

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    const updatedFields = [...formData.fields];
    updatedFields[index].file = file;
    setFormData((prevData) => ({
      ...prevData,
      fields: updatedFields,
    }));
  };

  const handleDeleteRowConfirm = () => {
    axios
      .delete(`${baseUrl}`+`register_campaign/${deleteRowId}`)
      .then((res) => {
        console.log(res);
        setReload(!reload);
        setDeleteRowModal(false);
      });
  };

  const handleDeleteRow = (params) => {
    console.log(
      params.row.register_campaign_id,
      "params.row.register_campaign_id"
    );
    setDeleteRowModal(true);
    setDeleteRowId(params.row.register_campaign_id);
  };

  const handleOpen = (params) => {
    setCampaignId(params.row.register_campaign_id);
    // console.log(params.row.register_campaign_id,"params.row.register_campaign_id")
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = (params) => {
    setCommitmentModalData(params.row.commitment);
    setOpen2(true);
  };
  const handleClose2 = () => setOpen2(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const [fields, setFields] = useState([
    { selectValue: null, textValue: "", brief: "" },
  ]);

  const handleSelectChange = (event, index) => {
    const newValue = event.target.value;
    const updatedFields = [...formData.fields];
    updatedFields[index].selectValue = newValue;
    setFormData((prevData) => ({
      ...prevData,
      fields: updatedFields,
    }));
  };

  const handleTextChange = (event, index) => {
    const newTextValue = event.target.value;
    const updatedFields = [...formData.fields];
    updatedFields[index].textValue = newTextValue;

    // Use setFormData to update the state
    setFormData((prevData) => ({
      ...prevData,
      fields: updatedFields,
    }));
  };

  const handleUploadLinkChange = (event, index) => {
    const newUploadLink = event.target.value;
    const updatedFields = [...formData.fields];
    updatedFields[index].uploadLink = newUploadLink;
    // Use setFormData to update the state
    setFormData((prevData) => ({
      ...prevData,
      fields: updatedFields,
    }));
  };

  const handleBriefChange = (event, index) => {
    const newBriefValue = event.target.value;
    console.log(newBriefValue, "newBriefValue");
    const updatedFields = [...formData.fields];
    updatedFields[index].brief = newBriefValue;

    // Use setFormData to update the state
    setFormData((prevData) => ({
      ...prevData,
      fields: updatedFields,
    }));
  };

  const handleAddField = () => {
    const newField = { selectValue: null, textValue: "" };

    // Use setFormData to update the state
    setFormData((prevData) => ({
      ...prevData,
      fields: [...prevData.fields, newField],
    }));
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...formData.fields];
    updatedFields.splice(index, 1);

    // Use setFormData to update the state
    setFormData((prevData) => ({
      ...prevData,
      fields: updatedFields,
    }));
  };

  // Function to validate the form data
  const validateForm = (data) => {
    let errors = {};

    if (!data.videoCount.trim()) {
      errors.videoCount = "Video Count is required";
    }

    if (!data.campaignBrief.trim()) {
      errors.campaignBrief = "Campaign Brief is required";
    }

    data.fields.forEach((field, index) => {
      if (!field.selectValue) {
        errors[`contentType${index}`] = "Content Type is required";
      }
      if (!field.textValue) {
        errors[`value${index}`] = "Value is required";
      }
    });

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendData = async (data) => {
    console.log(data, "data");
    for (const field of data.fields) {
      for (let i = 0; i < field.textValue; i++) {
        const formData = new FormData();
        formData.append("content_type_id", field.selectValue);
        formData.append("register_campaign_id", campaignId);
        formData.append("content_brief", field.brief);
        formData.append("est_static_vedio", data.videoCount);
        formData.append("status", "1");
        formData.append("stage", "1");
        formData.append("campaign_brief", data.campaignBrief);

        formData.append("cmpAdminDemoLink", field.uploadLink);
        // Append your file here (assuming `field.file` contains the file object)
        formData.append("cmpAdminDemoFile", field.file);

        try {
          const response = await axios
            .post(baseUrl+"contentSectionReg", formData, {
              headers: {
                "Content-Type": "multipart/form-data", // Important for file uploads
              },
            })
            .then((response) => {
              axios
                .put(baseUrl+"register_campaign", {
                  register_campaign_id: campaignId,
                  status: 1,
                })
                .then((res) => {
                  console.log(res);
                  handleClose();
                  // formData.contentCount = "";
                  formData.videoCount = "";
                  formData.campaignBrief = "";
                  formData.fields = [
                    { selectValue: null, textValue: "", brief: "" },
                  ];
                  setFormData(formData);
                });
              console.log(response);
              setReload(!reload);
            })
            .catch((error) => {
              console.log(error);
            });

          // Handle the response as needed
          if (response.status === 200) {
            console.log(`Successfully sent data for ${field.brief}`);
          } else {
            console.error(`Error sending data for ${field.brief}`);
          }
        } catch (error) {
          console.error(
            `Error sending data for ${field.brief}: ${error.message}`
          );
        }
      }
    }
  };

  const handlePlan = (event) => {
    const path = `/admin/planCreation/${event._id}`;
    navigate(path);
  };
  const handleShowPlan = (event) => {
    const path = `/admin/planOverview/${event._id}`;
    navigate(path);
  };
  handleShowPlan;
  const handlePhase = (event) => {
    // console.log(event);
    const path = `/admin/phase/${event._id}`;
    navigate(path);
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(formData);
    console.log(validationErrors, "validationErrors");
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("form is valid");
      sendData(formData);
      // console.log(formData, "formData");
    } else {
      console.log("Form is invalid");
      // Form is invalid, update the errors state
      setErrors(validationErrors);
    }
  };
  useEffect(() => {
    axios
      .get(baseUrl+"register_campaign")
      .then((response) => {
        // console.log(response.data.data, "response");
        SetLoadTable1(true);
        const table1Data = response.data.data
          .filter((element) => element.status === 0)
          .map((element, index) => {
            return { ...element, count: index + 1 };
          })
          .sort((a, b) => b.register_campaign_id - a.register_campaign_id);

        // console.log(table1Data);
        setTable1Data(table1Data);
        setTable2Data(
          response.data.data
            .filter((e) => e.status == 1)
            .map((element, i) => {
              return { ...element, count: i + 1 };
            })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl+"get_brands")
      .then((response) => {
        console.log(response.data.data, "response");
        setBrandName(response.data.data);
        setTable1Data2(true);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl+"get_all_commitments")
      .then((response) => {
        const data = response.data.data;
        console.log(data, "<--------");

        setCommits(data);
      });
    axios.get(baseUrl+"content").then((response) => {
      setContentTypeList(response.data.data);
    });

    axios
      .get(baseUrl+"exe_campaign")
      .then((response) => {
        const data = response.data.data;
        console.log(data, "<----data");
        setCampignData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    axios
      .get(baseUrl+"register_campaign")
      .then((response) => {
        console.log(response.data.data, "response");
        SetLoadTable1(true);
        const table1Data = response.data.data
          .filter((element) => element.status === 0)
          .map((element, index) => {
            return { ...element, count: index + 1 };
          })
          .sort((a, b) => b.register_campaign_id - a.register_campaign_id);
        console.log(table1Data);
        setTable1Data(table1Data);
        setTable2Data(
          response.data.data
            .filter((e) => e.status == 1)
            .map((element, i) => {
              return { ...element, count: i + 1 };
            })
            .sort((a, b) => b.register_campaign_id - a.register_campaign_id)
        );
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl+"get_brands")
      .then((response) => {
        console.log(response.data.data, "response");
        setBrandName(response.data.data);
        setTable1Data2(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reload]);

  const tab1Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = table1Data.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "exeCmpId",
      headerName: "Campaign Name",
      width: 170,
      renderCell: (params) => {
        return campignData.filter((e) => {
          return e.exeCmpId == params.row.exeCmpId;
        })[0]?.exeCmpName;
      },
    },
    {
      field: "brand_id",
      headerName: "Brand Name",
      width: 150,
      renderCell: (params) => {
        return brandName.filter((e) => {
          return e.brand_id == params.row.brand_id;
        })[0]?.brand_name;
      },
    },
    {
      field: "brnad_dt",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => {
        const inputDate = params.row.brnad_dt;
        const formattedDate = new Date(inputDate).toLocaleString("en-GB", {
          timeZone: "UTC",
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        return formattedDate;
      },
    },
    {
      field: "agency",
      headerName: "Agency",
      width: 200,
    },
    {
      field: "goal",
      headerName: "Goal",
      width: 200,
    },
    {
      field: "industry",
      headerName: "Industry",
      width: 200,
    },
    {
      field: "hashtags",
      headerName: "Hashtag",
      width: 200,
    },
    {
      field: "captions",
      headerName: "Caption",
      width: 200,
    },
    {
      field: "detailing",
      headerName: "Detail",
      width: 200,
    },
    {
      field: "commits",
      headerName: "Commits",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => handleOpen2(params)} variant="text">
              <ModeCommentTwoToneIcon />
            </Button>
          </div>
        );
      },
    },
    // {
    //   field: "download_excel_file",
    //   headerName: "Excel Action",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <a href={params.row.download_excel_file} download="excel.xlsx">
    //           <Button variant="text">
    //             <DownloadTwoToneIcon />
    //           </Button>
    //         </a>
    //       </div>
    //     );
    //   },
    // },
    {
      field: "send_for_content_creation",
      headerName: "Content Creation",
      renderCell: (params) => {
        return (
          <div className="d-flex text-center align-item-center justify-content-center">
            <Button type="button" onClick={() => handleOpen(params)}>
              <SendTwoToneIcon />
            </Button>
          </div>
        );
      },
      width: 200,
    },
    {
      field: "plan_creation",
      headerName: "Plan Creation",
      renderCell: (params) => (
        <PlanCreationComponent
          {...params}
          handlePlan={handlePlan}
          handleShowPlan={handleShowPlan}
        />
      ),
      width: 200,
    },
    {
      field: "phase_creation",
      headerName: "Phase Creation",
      renderCell: (params) => (
        <PhaseCreationComponent {...params} handlePhase={handlePhase} />
      ),
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <div>
            <Button type="button" color="error" onClick={() => handleDeleteRow(params)}>
              <DeleteIcon />
            </Button>
          </div>
        );
      },
    },
  ];
  const tab2Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = table2Data.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "brand_id",
      headerName: "Brand Name",
      width: 150,
      renderCell: (params) => {
        return brandName.filter((e) => {
          return e.brand_id == params.row.brand_id;
        })[0]?.brand_name;
      },
    },
    {
      field: "brnad_dt",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => {
        return new Date(params.row.brnad_dt)
          .toLocaleString("en-GB", { timeZone: "UTC" })
          .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+).*/, "$3/$2/$1 $4");
      },
    },
    {
      field: "commits",
      headerName: "Commits",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => handleOpen2(params)} variant="text">
              <ModeCommentTwoToneIcon />
            </Button>
          </div>
        );
      },
    },
    {
      field: "download_excel_file",
      headerName: "Excel Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <a href={params.row.download_excel_file} download="excel.xlsx">
              <Button variant="text">
                <DownloadTwoToneIcon />
              </Button>
            </a>
          </div>
        );
      },
    },
  ];
  const videoType = [
    "2D Animation",
    "3D Animation",
    "Live Action",
    "Stop Motion",
    "Whiteboard Animation",
    "Typography Animation",
    "Motion Graphics",
    "Infographics",
    "GIF",
    "Cinemagraph",
    "Screencast",
    "Product Animation",
    "Product Demo",
    "Product Unboxing",
    "Product Review",
    "Product Comparison",
    "Product Explainer",
    "Product Tutorial",
    "Product How-To",
    "Product Testimonial",
    "Product Showcase",
    "Product Launch",
    "Product Promotion",
    "Product Advertisement",
    "Product Announcement",
    "Product Teaser",
    "Product Update",
    "Product Release",
    "Product Demo",
    "Product Unboxing",
    "Product Review",
    "Product Comparison",
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "60%",
    borderRadius: "10px",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const commitColumns = [
    {
      field: "selectValue",
      headerName: "Commits",
      width: 200,
      renderCell: (params) => {
        return commits.filter((e) => {
          return e.cmtId == params.row.selectValue;
        })[0]?.cmtName;
      },
    },
    {
      field: "textValue",
      headerName: "Value",
      width: 150,
    },
  ];
  const tab1 = (
    <div>
      {loadTable1 && table1Data2 && (
        <DataGrid
          rows={table1Data}
          columns={tab1Columns}
          getRowId={(row) => row?.count}
        />
      )}
      <Modal
        open={deleteRowModal}
        onClose={() => setDeleteRowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "60%",
            borderRadius: "10px",
            transform: "translate(-50%, -50%)",
            width: "40%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 1,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this row?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="d-flex justify-content-between">
              <Button
                variant="contained"
                onClick={() => setDeleteRowModal(false)}
                color="primary"
              >
                Cancle
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteRowConfirm}
              >
                Delete
              </Button>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );

  const tab2 = (
    <div>
      {loadTable1 && table1Data2 && (
        <DataGrid
          rows={table2Data}
          columns={tab2Columns}
          // pageSize={10}

          getRowId={(row) => row.count}
        />
      )}
    </div>
  );

  const accordionButtons = ["Pending", "Sent for Content Creation"];
  return (
    <div>
      <FormContainer
        submitButton={false}
        mainTitle="Registered Campaign"
        title="Registered Campaign"
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
      >
        {activeAccordionIndex === 0 && tab1}
        {activeAccordionIndex === 1 && tab2}
      </FormContainer>

      {/* Modal section */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ padding: "2px" }}
          >
            Content Section
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 3 }}>
            <Paper sx={{ padding: "10px" }}>
              <div className="d-flex justify-content-between">
                <TextField
                  sx={{ width: "100%" }}
                  label="Estimate Static & Video"
                  name="videoCount"
                  type="number"
                  onChange={handleInputChange}
                  error={!!errors.videoCount}
                  helperText={errors.videoCount}
                />
              </div>
              <TextField
                aria-label="minimum height"
                minRows={5}
                name="campaignBrief"
                value={formData.campaignBrief}
                sx={{ width: "100%", marginTop: "10px", marginBottom: "10px" }}
                placeholder="Campaign Brief"
                onChange={handleInputChange}
                error={!!errors.campaignBrief}
                helperText={errors.campaignBrief}
              />

              <Paper sx={{ padding: "10px", marginBottom: "10px" }}>
                <FormControl>
                  {formData.fields.map((field, index) => (
                    <>
                      <Page sx={{ mt: 1 }}>
                        <div className="d-flex">
                          <div>
                            <div key={index} className="mt-2 mb-2 d-flex">
                              <FormControl
                                sx={{ width: "300px", marginRight: "10px" }}
                              >
                                <Autocomplete
                                  disablePortal
                                  value={formData.fields.selectValue}
                                  name="contentType"
                                  onChange={(event, newValue) => {
                                    console.log(newValue.value, "newValue"),
                                      handleSelectChange(
                                        { target: { value: newValue.value } },
                                        index
                                      );
                                  }}
                                  options={contentTypeList
                                    .filter(
                                      (option) =>
                                        !fields
                                          .map((field) => field.selectValue)
                                          .includes(option.value)
                                    )
                                    .map((option) => ({
                                      label: option.content_type,
                                      value: option.content_type_id,
                                    }))}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Content Type"
                                    />
                                  )}
                                  error={!!errors.fields?.selectValue}
                                  helperText={errors.fields?.selectValue}
                                />
                              </FormControl>
                              <TextField
                                label="Content Count"
                                type="number"
                                value={formData.fields.textValue}
                                onChange={(event) =>
                                  handleTextChange(event, index)
                                }
                                name="value"
                                error={!!errors.fields?.textValue}
                                helperText={errors.fields?.textValue}
                              />
                              <TextField
                                sx={{ ml: 1, width: "50%" }}
                                label="Upload Link"
                                value={formData.fields.uploadLink}
                                onChange={(event) =>
                                  handleUploadLinkChange(event, index)
                                }
                              />
                              <OutlinedInput
                                // variant="outlined"
                                type="file"
                                accept="image/png, image/jpeg, video/mp4, video/avi, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                inputProps={{
                                  accept:
                                    ".pdf, .doc, .docx, .mp4, .avi, .png, .jpeg",
                                }}
                                sx={{ width: "50%", ml: 1 }}
                                onChange={(event) =>
                                  handleFileChange(event, index)
                                }
                              />
                            </div>
                            <TextField
                              label="Brief"
                              sx={{ width: "100%" }}
                              value={formData.fields.brief}
                              onChange={(event) =>
                                handleBriefChange(event, index)
                              }
                              name="brief"
                              error={!!errors.fields?.brief}
                              helperText={errors.fields?.brief}
                            />
                          </div>
                          <>
                            {" "}
                            <Button
                              onClick={(e) => handleRemoveField(e, index)}
                            >
                              <i className="fas fa-close"></i>
                            </Button>
                          </>
                        </div>
                      </Page>
                    </>
                  ))}
                </FormControl>
              </Paper>
              <div className="d-flex justify-content-between">
                <div>
                  {videoType.filter(
                    (e) => !fields.map((e) => e.selectValue).includes(e)
                  ).length > 0 && (
                    <Button
                      variant="outlined"
                      sx={{ marginBottom: "10px", marginRight: "10px" }}
                      color="primary"
                      onClick={handleAddField}
                    >
                      Add Row
                    </Button>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <Button variant="contained" onClick={handleClose} color="error">
                  Cancle
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    handleSubmit();
                  }}
                  variant="contained"
                  sx={{ marginLeft: "10px" }}
                  color="primary"
                >
                  Submit
                </Button>
              </div>
            </Paper>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ padding: "2px" }}
          >
            Commits
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 3 }}>
            <Paper sx={{ padding: "10px" }}>
              <div className="d-flex justify-content-between">
                <DataGrid
                  rows={commitmentModalData}
                  columns={commitColumns}
                  pageSize={10}
                  getRowId={(row) => row.selectValue}
                />
              </div>
              <Button
                sx={{ marginTop: "10px" }}
                variant="contained"
                onClick={handleClose2}
                color="primary"
              >
                Cancle
              </Button>
            </Paper>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

const PlanCreationComponent = ({ row, handlePlan, handleShowPlan }) => {
  const [planData, setPlanData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await axios.get(
          `${baseUrl}`+`campaignplan/${row._id}`
        );
        setPlanData(newData);
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };

    fetchData();
  }, [row._id]);

  return (
    <div className="d-flex text-center align-item-center justify-content-center">
      {!planData?.data?.data.length > 0 ? (
        <Button type="button" onClick={() => handlePlan(row)}>
          <SendTwoToneIcon />
        </Button>
      ) : (
        <Button variant="outlined" onClick={() => handleShowPlan(row)}>
          Show plan
        </Button>
      )}
    </div>
  );
};

const PhaseCreationComponent = ({ row, handlePhase }) => {
  const [planData, setPlanData] = useState([]);
  const rowId = row._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await axios.get(
          `${baseUrl}`+`campaignplan/${rowId}`
        );
        setPlanData(newData);
      } catch (error) {
        console.error("Error fetching plan data:", error);
      }
    };

    fetchData();
  }, [rowId]);

  return (
    <div className="d-flex text-center align-item-center justify-content-center">
      {planData?.data?.data.length > 0 ? (
        <Button type="button" onClick={() => handlePhase(row)}>
          <SendTwoToneIcon />
        </Button>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ width: "5em", color: "red" }}>N/A</span>
        </div>
      )}
    </div>
  );
};
