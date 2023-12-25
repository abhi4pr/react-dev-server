import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: "10px",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const ExePageDetailes = ({
  data,
  setActiveAccordionIndex,
  activeAccordion,
}) => {
  console.log(data, "sAsaSASA");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [singlePhase, setSinglePhase] = useState([]);

  const [assignedData, setAssignedData] = useState({});
  const [assignmentCommits, setAssignmentCommits] = useState([])
  const [commitPayload,setCommitPayload] = useState([]);

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const handleButtonClick = async (row) => {
    setAssignedData({
      ass_id: row.ass_id,
      campaignId: row.campaignId,
      phase_id: row.phase_id,
    });
    setOpen(true);
  };

  const handleUpdate = async (params) => {

    const response = await axios.get(
      `http://34.93.221.166:3000/api/campaignphase/singlephase/${params.row.phase_id}`
    );
    setSinglePhase(response?.data?.data?.commitment);

    const assCommit = await axios.get(`http://34.93.221.166:3000/api/assignment/commit/single/${params.row.ass_id}`)
    setAssignmentCommits(assCommit.data.data)
    setCommitPayload(assCommit.data.data)
    setOpen2(true);
  };

  console.log(commitPayload,"commit payload")

  const handleVerified = () => {
   
  };

  const handleCommitChange=(e,field,param)=>{
    console.log(param.row)
    // setCommitPayload({...commitPayload,[field]:e.target.value,id})
    const data=commitPayload.map(commit=>{
      if(commit.comm_id==param.row.comm_id){
        return {...commit,[field]:e.target.value}
      }else return commit
    })

    setCommitPayload(data)
  }

  const handleExecute=async (params)=>{
    console.log(params)
    const response=await axios.post('http://34.93.221.166:3000/api/assignment/status',{
      ass_id:params.row.ass_id,
      campaignId:params.row.campaignId,
      ass_status:'executed'
    })

    
  }

  const updateSingleCommitment=async (params)=>{
    const payload=commitPayload.find(commit => commit.comm_id==params.comm_id)
    // console.log(payload)
    const response=await axios.put(`http://34.93.221.166:3000/api/assignment/commit/single/${params.comm_id}`,payload)
    
  }

  const handleAssignedSubmit = async () => {
    const response = await axios.post('http://34.93.221.166:3000/api/assignment/commit', assignedData)

  };
  const column = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = data?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "page Name",
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
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => {
        if (activeAccordion == 1) {
          return (
            <Button onClick={() => handleButtonClick(params.row)}>
              Start Execution
            </Button>
          );
        }
        if (activeAccordion == "2") {
          return (
            <div style={{ marginLeft: "5px" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleUpdate(params)}
              >
                update
              </Button>
              <Button variant="outlined" color="secondary" onClick={()=>handleExecute(params)}>
                Excute
              </Button>
            </div>
          );
        } else {
          return <Button onClick={() => handleUpdate(params)}>commitment</Button>;
        } 
        
        // return null;
      },
    },
  ];

  const columnForAssCommit = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = data?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "link",
      headerName: "link",
      width: 150,
    },
    
    {
      field: "likes",
      name: "likes",
      headerName: "likes",
      width: 150,
      
      renderCell:(params)=>{
        const x=singlePhase.some((element)=>{
          
          return element.commitment=='Likes'
        })
       
        if(x){

          return <TextField type="number"
   
           // value={params.row.comments || commitPayload.comments}
          //  value={activeAccordion!="2" ? params.row.likes:""}
           placeholder={params.row.likes}
           onChange={(e)=>handleCommitChange(e,"likes",params)}
           />
        }

        return <p>N/A</p>

       
      }
    },
    {
      field: "comments",
      headerName: "comments",
      width: 150,
      renderCell:(params)=>{
        const x=singlePhase.some((element)=>{
        return  element.commitment=='comments'
        })
        if(x==true){

          return <TextField type="number"
   
           // value={params.row.comments || commitPayload.comments}
          //  value={activeAccordion!="2" && params.row.comments}
           placeholder={params.row.comments}
           onChange={(e)=>handleCommitChange(e,"comments",params)}
           />
        }

        return <p>N/A</p>

       
      }
    },
    {
      field: "engagement",
      headerName: "engagement",
      width: 150,
      
      
        renderCell:(params)=>{
          const x=singlePhase.some((element)=>{
         return   element.commitment=='engagement'
          })
          if(x==true){
  
            return <TextField type="number"
     
             // value={params.row.comments || commitPayload.comments}
            //  value={activeAccordion!="2" && params.row.engagement}
             placeholder={params.row.engagement}
             onChange={(e)=>handleCommitChange(e,"engagement",params)}
             />
          }
  
          return <p>N/A</p>
  
         
        }
    },
    {
      field: "reach",
      headerName: "reach",
      width: 150,
      renderCell:(params)=>{
        const x=singlePhase.some((element)=>{
         return element.commitment=='reach'
        })
        if(x==true){

          return <TextField type="number"
   
           // value={params.row.comments || commitPayload.comments}
          //  value={activeAccordion!="2" && params.row.reach}
           placeholder={params.row.reach}
           onChange={(e)=>handleCommitChange(e,"reach",params)}
           />
        }

        return <p>N/A</p>

       
      }
    },
    {
      field: "snapshot",
      headerName: "snapshot",
      width: 150,
      renderCell:(params)=>{
       

          return <TextField type="text"
          
          //  value={activeAccordion!="2" && params.row.snapshot}
           placeholder={params.row.snapshot}
           onChange={(e)=>handleCommitChange(e,"snapshot",params)}
           />
        }

        

       
      
    },activeAccordion=="2" &&
    {
      field:"action",
      headerName:"action",
      width:150,
      renderCell:(params)=>{
        return  <Button
        variant="contained"
        color="primary"
        style={{ marginRight: "8px" }}
      onClick={()=>updateSingleCommitment(params.row)}
      >
        update
      </Button>
      }
    }
  ]

  return (
    <>
      <DataGrid
        rows={data}
        columns={column}
        getRowId={(row) => row.p_id}
        pagination
      />
      <>
        {/* frist modal-----------------> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography component="h2" sx={{ padding: "2px" }}>
              Excuation
            </Typography>
            <TextField
              label=" Link"
              type="text"
              onChange={(e) =>
                setAssignedData({ ...assignedData, link: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "8px" }}
              onClick={handleAssignedSubmit}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </>
      <>
        {/* second modal ============> */}

        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Paper>
              <div className="form-heading">
                <div className="form_heading_title">
                  <h2> Excusion pending </h2>
                </div>
              </div>
            </Paper>
            <Typography>campaign Details</Typography>
            <Box sx={{ display: "flex" }}>
              <TextField
                label="campaign"
                defaultValue="Tiger 3"
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />
              <TextField
                label="plan"
                defaultValue="plan name"
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />
              <TextField
                label="phase"
                defaultValue="phase 1"
                InputProps={{
                  readOnly: true,
                }}
                margin="normal"
              />
            </Box>
            {singlePhase.map((item) => (
              <Box>
                <TextField
                  label="commitment"
                  value={item.commitment}
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="normal"
                />
                <TextField
                  label="value"
                  value={item.value}
                  InputProps={{
                    readOnly: true,
                  }}
                  margin="normal"
                />
              </Box>
            ))}
            <DataGrid
              rows={assignmentCommits}
              columns={columnForAssCommit}
              getRowId={(row) => row.comm_id}
              pagination
            />
           
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "8px" }}
            // onClick={}

>
              Submit
            </Button>
          </Box>
        </Modal>
      </>
    </>
  );
};

export default ExePageDetailes;
