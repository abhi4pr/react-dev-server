import { TextField, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import Select from "react-select";
import FormContainer from "../../FormContainer";
import CampaignExecutionSummary from "./CampaignExecutionSummary";

const CampaignExecutions = () => {
  const [shortcode, setShortcode] = useState([]);
  const [pageDetails, setPageDetails] = useState([]);
  console.log(pageDetails,);
  const [assignData, setAssignData] = useState([]);
  const [allCampData, setAllCampData] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [allPhaseData, setAllPhaseData] = useState([]);
  // const [singlePhaseData, setSinglePhaseData] = useState([]);
  const [allExecutedData, setAllExecutedData] = useState([]);
  const [allPhaseCommitCount, setAllPhaseCommitCount] = useState([]);
  const [overviewCommitData, setOverviewCommitData] = useState([]);
  const [phases, setphases] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assId, setAssId] = useState("")

  // const handleShortcodeChange = (event, index) => {
  //   const newShortcodes = [...shortcode];
  //   newShortcodes[index] = event.target.value;
  //   setShortcode(newShortcodes);
  // };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
    console.log(res, "hi");
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
  // use

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
    pageDetails?.post_caption
  );


  console.log(allExecutedData, "all saimyual");
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
    {
      field: "Shifting",
      headerName: "Shifting",
      width: 120,
      renderCell: (params) => {
        return (
          <Button variant="text" onClick={openModal}>
            Shift pages
          </Button>
        );
      },
    },
    {
      field: "Date",
      headerName: " Fetched D|T",
      width: 180,
      valueGetter: () =>
        pageDetails?.postedOn ? pageDetails?.postedOn : " Not Fetched",
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
        <button className="btn btn-danger">Replace page</button>
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
        // value=""
        // onChange={(event) => setShortcode(event.target.value)}
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
            // value={shortcode}
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
    {
      field: "Post",
      headerName: "Post",
      width: 150,
      valueGetter: () => pageDetails?.owner_info?.post_count,
    },
    {
      field: "post_caption",
      headerName: "Caption",
      width: 150,
      // valueGetter: () => pageDetails?.post_caption,
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
              Overview
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
          <div style={{ backgroundColor: "white", padding: "1rem" }}>
            <h2>Modal Content</h2>
            <p>This is the content of the modal.</p>
            <Button variant="contained" onClick={closeModal}>
              Close Modal
            </Button>
          </div>
        </Modal>
      </>
    </>
  );
};

export default CampaignExecutions;
