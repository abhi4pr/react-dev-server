import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import Select from "react-select";
import FormContainer from "../../FormContainer";
import CampaignExecutionSummary from "./CampaignExecutionSummary";
import ScreenRotationAltRoundedIcon from '@mui/icons-material/ScreenRotationAltRounded';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CampaignExecutions = () => {
  const [shortcode, setShortcode] = useState([]);
  const [pageDetails, setPageDetails] = useState([]);
  const [assignData, setAssignData] = useState([]);
  const [allCampData, setAllCampData] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [shiftPages, setShiftPages] = useState("");
  const [allPhaseData, setAllPhaseData] = useState([]);
  const [allExecutedData, setAllExecutedData] = useState([]);
  const [allPhaseCommitCount, setAllPhaseCommitCount] = useState([]);
  const [overviewCommitData, setOverviewCommitData] = useState([]);
  const [phases, setphases] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [assId, setAssId] = useState("");
  const [phaseId, setPhaseId] = useState();

  const openModal = (phase_id) => {
    setIsModalOpen(true);
    setPhaseId(phase_id); 
  };

  const openModal2 = (phase_id) => {
    setIsModalOpen2(true);
    setPhaseId(phase_id); 
  };

  const openModal3 = (phase_id) => {
    setIsModalOpen3(true);
    setPhaseId(phase_id); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };

  const closeModal3 = () => {
    setIsModalOpen3(false);
  };

  const getAllAssignments = async () => {
    const res = await axios.get(`${baseUrl}assignments`);
    setAssignData(res.data.data);
  };
  const getCampaign = async () => {
    const res = await axios.get(`${baseUrl}register_campaign`);
    setAllCampData(res.data.data);
  };
  const getAllPhases = async () => {
    const res = await axios.get(
      `${baseUrl}assignment/get_all_phases_by_campid/${selectedCampaign}`
    );
    setAllPhaseData(res.data.data);
  };
  const allCommitInOverview = async () => {
    const res = await axios.get(
      `${baseUrl}assignment/get_camp_commitments/${selectedCampaign}`
    );
    setOverviewCommitData(res.data);
  };

  const handleAllCampaign = async () => {
    const res = await axios.get(
      `${baseUrl}assignment/get_all_exe_phases_by_campid/${selectedCampaign}`
    );
    setphases("all");
    setAllExecutedData(res?.data?.data);
  };

  useEffect(() => {
    getAllAssignments();
    getCampaign();
  }, []);

  useEffect(() => {
    getAllPhases();
    handleAllCampaign();
    allCommitInOverview();
  }, [selectedCampaign]);

  useEffect(() => {
    const fetchPageDetails = async (index) => {
      if (shortcode) {
        const regex = /\/(reel|p)\/([A-Za-z0-9-_]+)/;
        const match = shortcode?.match(regex);
        try {
          const payload = {
            shortCode: match[2],
            department: "660ea4d1bbf521bf783ffe18",
            userId: 15,
          };
          const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.post(
            `http://35.200.154.203:8080/api/v1/getpostDetailFromInsta`,
            payload,
            config
          );

          if (response.data.success == true) {
            const res = await axios.put(
              `${baseUrl}assignment/post/details/update`,
              {
                ass_id: assId,
                post_link: shortcode,
                post_date: response.data.data?.postedOn,
                post_type: response.data.data?.postType,
                post_like: response.data.data?.like_count,
                post_comment: response.data.data?.comment_count,
                post_views: response.data.data?.play_count,
                post_captions: response.data.data?.post_caption,
                post_media: response.data.data?.postImage,
                last_link_hit_date: new Date(),
              }
            )
            setAssId("")
            setPageDetails((prevPageDetails) => {
              let updatedPageDetails;
              if (Array.isArray(prevPageDetails)) {
                updatedPageDetails = [...prevPageDetails];
              } else {
                updatedPageDetails = { ...prevPageDetails };
              }
              updatedPageDetails = response?.data?.data;
              return updatedPageDetails;
            });
          }else if(response.data.success == false){
            setTimeout(fetchPageDetails, 1000);
          }
        } catch (error) {
          console.error("Error fetching page details:", error);
        }
      } else {
        console.log("No match found or invalid shortcode.");
      }
    };
    fetchPageDetails();
  }, [shortcode]);

  //  filter hashtags and tags -->
  const extractTags = (caption) => {
    if (!caption)
      return { tags: [], hashtags: [], tagCount: 0, hashtagCount: 0 };

    const tagRegex = /@(\w+)/g;
    const tagMatches = caption.match(tagRegex);
    const tags = tagMatches
      ? tagMatches.map((match) => match.substring(1))
      : [];
    const tagCount = tags?.length;
    const hashtagRegex = /#(\w+)/g;
    const hashtagMatches = caption.match(hashtagRegex);
    const hashtags = hashtagMatches
      ? hashtagMatches.map((match) => match.substring(1))
      : [];
    const hashtagCount = hashtags?.length;

    return { tags, hashtags, tagCount, hashtagCount };
  };

  const { tags, hashtags, tagCount, hashtagCount } = extractTags(
    pageDetails?.post_captions
  );

  const Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = allExecutedData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    phases === "all" ? "" : {
      field: "Shifting",
      headerName: "Shifting",
      width: 120,
      renderCell: (params) => {
        return (
          <Button variant="text" onClick={() => openModal(params.row.phase_id)}>
          <ScreenRotationAltRoundedIcon color="secondary" sx={{ fontSize: "1.5rem" }} />
        </Button>
        );
      },
    },
    {
      field: "last_link_hit_date",
      headerName: " Fetched D|T",
      width: 180,
      
    },
    
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
    },
    {
      field: "postPerPage",
      headerName: "Post",
      width: 150,
    },
    {
      field: "storyPerPage",
      headerName: "Story",
      width: 150,
    },
    {
      field: "replacement",
      headerName: "Replacement",
      width: 150,
      renderCell: (params, i) => (
        <button className="btn btn-danger" onClick={() => openModal3(params.row.phase_id)}>Replace page</button>
      ),
    },
    {
      field: "Story link",
      headerName: "Story Link",
      width: 150,
      renderCell: (params, i) => (
        <TextField
          className="form-control"
          placeholder="Story Link"
          type="text"
        />
      ),
    },
    {
      field: "Post link",
      headerName: "Post Link",
      width: 150,
      renderCell: (params) => (
        <>
          <TextField
            className="form-control"
            placeholder="Post Link"
            type="text"
            value={shortcode[params.row._id]}
            onChange={(event) => {
              setShortcode(event.target.value);
              setAssId(params.row.ass_id);
            }}
          />
        </>
      ),
    },
    {
      field: "Post Image",
      headerName: "Post Image",
      width: 150,
      renderCell: (params) => (
        <img
          src={params.row.post_media}
          alt="Post Image"
          style={{ width: "100%", height: "auto" }}
        />
      ),
    },

    {
      field: "post_date",
      headerName: "Post Date",
      width: 150,
    },
    {
      field: "post_type",
      headerName: "Post Type",
      width: 150,
    },

    {
      field: "post_like",
      headerName: "Like",
      width: 150,
    },
    {
      field: "post_comment",
      headerName: "Comments",
      width: 150,
    },
    {
      field: "post_views",
      headerName: "Views",
      width: 150,
    },
    // {
    //   field: "Post",
    //   headerName: "Post",
    //   width: 150,
    //   valueGetter: () => pageDetails?.owner_info?.post_count,
    // },
    {
      field: "post_captions",
      headerName: "Caption",
      width: 150,
    },
    {
      field: "Tags",
      headerName: "Tags",
      width: 150,
      valueGetter: () => tags.join(", "),
    },
    {
      field: "Tag Count",
      headerName: "Tag Count",
      width: 150,
      valueGetter: () => tagCount,
    },
    {
      field: "Hashtags",
      headerName: "Hashtags",
      width: 150,
      valueGetter: () => hashtags.join(", "),
    },
    {
      field: "Hashtag Count",
      headerName: "Hashtag Count",
      width: 150,
      valueGetter: () => hashtagCount,
    },
  ];
  const handleClick = async (phase_id) => {
    setphases(phase_id);
    const res = await axios.get(
      `${baseUrl}assignment/get_all_phases/${phase_id}`
    );
    setAllExecutedData(res.data.data);
    const response = await axios.get(
      `${baseUrl}assignment/get_phase_commitments/${phase_id}`
    );
    setAllPhaseCommitCount(response.data.data);
  };

  const handleShift = async () => {
    const res = await axios.post(`${baseUrl}assignment/get_shift_phases`, {
      _id: selectedCampaign,
      phaseId1: phaseId,
      phaseId2: shiftPages
    })
  }

  const handleAddPage = async () => {

  }

  const handleReplace = async () => {

  }

  return (
    <>
      <FormContainer link={true} mainTitle={"Exection Campaign"} />
      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Execution</div>
          <div className="form-group w-25">
            <label className="form-label">All Campaign</label>
            <Select
              options={allCampData.map((option) => ({
                value: option._id,
                label: option.exeCmpName,
              }))}
              onChange={(e) => {
                setSelectedCampaign(e.value);
              }}
            ></Select>
          </div>
        </div>
        <div className="card-body">
          {phases === "all" ? (
            <div>
              {selectedCampaign == '' ? "" : <button style={{float:'right'}} onClick={() => openModal2()} className="btn btn-warning">Add Page</button>}
              <CampaignExecutionSummary
                overviewCommitData={overviewCommitData}
              />
            </div>
          ) : (
            <>
              <div>Total Comment : {allPhaseCommitCount?.post_comments}</div>
              <div>Total Like : {allPhaseCommitCount?.post_likes}</div>
              <div>Total Views : {allPhaseCommitCount?.post_views}</div>
            </>
          )}
        </div>

        <div className="card-body">
          <div className="tab">
            <button
              className={`named-tab ${phases === "all" ? "active-tab" : ""} `}
              onClick={handleAllCampaign}
            >
              All Pages
            </button>
            {allPhaseData.length > 0 &&
              allPhaseData.map((item, i) => (
                <button
                  key={i}
                  className={`named-tab ${phases === item.phase_id ? "active-tab" : ""
                    } `}
                  onClick={() => handleClick(item.phase_id)}
                >
                  {item?.phaseName}
                </button>
              ))}
          </div>

          <DataGrid
            rows={allExecutedData}
            columns={Columns}
            getRowId={(row) => row.p_id}
            pagination
            checkboxSelection
          />
        </div>
      </div>
      <>
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box sx={style}>
            <div className="form-group w-75">
              <label className="form-label">Shift Pages</label>
              <Select
                options={allPhaseData.map((option) => ({
                  value: option.phase_id,
                  label: option.phaseName,
                }))}
                onChange={(e) => {
                  setShiftPages(e.value);
                }}
              />
            </div>
            <Button onClick={handleShift}> Shift</Button>
          </Box>
        </Modal>

        <Modal open={isModalOpen2} onClose={closeModal2}>
          <Box sx={style}>
            <div className="form-group w-75">
              <label className="form-label">Add New Page</label>
              
            </div>
            <Button onClick={handleAddPage}> Add</Button>
          </Box>
        </Modal>

        <Modal open={isModalOpen3} onClose={closeModal3}>
          <Box sx={style}>
            <div className="form-group w-75">
              <label className="form-label">Replace Page</label>
              
            </div>
            <Button onClick={handleReplace}> Replace</Button>
          </Box>
        </Modal>
      </>
    </>
  );
};

export default CampaignExecutions;
