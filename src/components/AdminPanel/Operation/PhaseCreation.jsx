import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormContainer from "../FormContainer";
import axios from "axios";
import { DataGrid, GridExpandMoreIcon } from "@mui/x-data-grid";
import CampaignDetails from "./CampaignDetails";
import { Link, Navigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";

const PhaseCreation = () => {
  const naviagte = useNavigate();
  const param = useParams();
  const id = param.id;

  const { toastAlert, toastError } = useGlobalContext();
  const [phaseDiscription, setPhaseDiscription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([])
  const [phaseName, setPhaseName] = useState('')
  const [campaignDetails, setCampaignDetails] = useState({})
  const [planData, setPlanData] = useState([])
  const [payloadData, setPayloadData] = useState({})

  const getCampaignDetails = async() =>{
    try{
      const forPayload = await axios.get(baseUrl+`opcampaign/${id}`)
      setPayloadData(forPayload.data.data)

      const Fdata = await axios.get(baseUrl+`opcampaignplan/${id}`)
      setCampaignDetails(Fdata.data.data)

      const campaignPIds = Fdata.data.data.map((campaign) => campaign.p_id);

      const inventoryDataResponse = await axios.get(
        `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
      );

      const filteredInventoryData = inventoryDataResponse.data.body.filter(
        (item) => campaignPIds.includes(item.p_id)
      );

      const newData = filteredInventoryData.map((item) => ({
        p_id: item.p_id,
        page_name: item.page_name,
        cat_name: item.cat_name,
        follower_count: item.follower_count,
        page_link: item.page_link,
      }));

      setPlanData(newData);
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    // getPageData();
    getCampaignDetails()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const selectedPages = planData.filter((row)=>
        selectedRows.includes(row.p_id)
      );
      const pages = selectedPages.map((page)=>({
        p_id: page.p_id,
        postPerPage: page.posts_per_page || 1,
        storyPerPage: page.story_per_page || 1
      }))

      const postResult = await axios.post(`${baseUrl}opcampaignphase`,{
        campaignId:payloadData._id,
        planId:campaignDetails[0]._id,
        phaseName:phaseName,
        start_date:startDate,
        end_date:endDate,
        pages: pages
      })
    }catch(err){
      console.log(err)
    }
  }

  const columns = [
    {
      field: "checkbox",
      headerName: "",
      width: 10,
    },
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => {
        const rowIndex = planData?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      renderCell: (params) => {
        const link = params.row.page_link;
        return (
          <div style={{ color: "blue" }}>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {params.row.page_name}
              </a>
            )}
          </div>
        );
      },
    },
    {
      field: "page_link",
      headerName: "Page Link",
      width: 250,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower Count",
      width: 150,
    },
    {
      field: "posts_per_page",
      headerName: "Posts",
      width: 140,
      renderCell: (params) => <input type="number" style={{ width: "80px" }} />,
    },
    {
      field: "story_per_page",
      headerName: "Story ",
      width: 140,
      renderCell: (params) => <input type="number" style={{ width: "80px" }} />,
    },
  ];

  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);

    const selectedData = planData.filter((row) =>
      selectedIds.includes(row.p_id)
    );
    // setPayload(selectedData);
  };

  return (
    <>
      <FormContainer mainTitle="Phase Creation" link="true" />
      
      <CampaignDetails cid={id} />

      <div style={{display:'inline-flex'}}>
        <input
          type="text"
          placeholder="Phase name"
          className="form-control"
          style={{width:'24%'}}
          value={phaseName}
          onChange={(e)=>setPhaseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="form-control"
          style={{width:'24%'}}
          value={phaseDiscription}
          onChange={(e)=>setPhaseDiscription(e.target.value)}
        />
        <input
          type="date"
          placeholder="start date"
          className="form-control"
          style={{width:'24%'}}
          value={startDate}
          onChange={(e)=>setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End date"
          className="form-control"
          style={{width:'24%'}}
          value={endDate}
          onChange={(e)=>setEndDate(e.target.value)}
        />
      </div>

      <div style={{}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 0.5,
            height: "700px",
            width: `${selectedRows.length > 0 && "100%"}`,
          }}
        >
          <DataGrid
            rows={planData}
            columns={columns}
            getRowId={(row) => row.p_id}
            checkboxSelection
            pagination
            onRowSelectionModelChange={(row) => handleSelectionChange(row)}
            rowSelectionModel={selectedRows?.map((row) => row)}
          />
          {/* <SummaryDetails
            payload={payload}
            campName={"campValue"}
            drawer={false}
          /> */}
        </div>
      </div>
      <button
        className="btn btn-outline-danger rounded-pill"
        onClick={handleSubmit}
        style={{ width: "10%" }}
      >
        Submit
      </button>
    </>
  );
};

export default PhaseCreation;
