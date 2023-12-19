import { SdStorageRounded } from "@mui/icons-material";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

// eslint-disable-next-line react/prop-types
const ReplacePagesModal = ({ open, handleClose,selection,planData,stage }) => {
  
  const [replacementData,setReplacementData] = useState({});
  const [remainingPages,setRemainingPages] = useState([])
  console.log(planData)

  const getAllPages=async ()=>{
    const pageData = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    console.log(pageData.data.body)
    const remainingData = pageData?.data?.body.filter(
      (item) =>
        !planData.some((selectedItem) => selectedItem.p_id == item.p_id)
    );
    setRemainingPages(remainingData);
  }


console.log(remainingPages)
  useEffect(()=>{
    if(planData.length>0 ){

      getAllPages();
    }
  },[planData])

  const handlePageReplacement = (params,op)=>{
    
    setReplacementData({...replacementData,
    "campaignName":selection?.campaignName,
    "campaignId":selection?.campaignId,
    "replacement_request_by":"12345",
    replacement_stage:stage,
    page:op,
    newPage_id:op.p_id,
    oldPage_id:selection?.p_id,
    planName:selection?.planName


    })
  }
   console.log(replacementData)
  const handleSubmit=async ()=>{
    const result=await axios.post('http://localhost:3000/api/replacement/plan',replacementData)
    handleClose()
    
  }
 
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{mb:4}} variant="h6"  component="h2">
          Replace Page
        </Typography>
        <Autocomplete
          id="combo-box-demo"
          options={remainingPages}
          getOptionLabel={(option) => option.page_name}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Pages" />
          )}
          onChange={handlePageReplacement}
        />
        <TextField
            label="post/page"
            defaultValue="5"
            
            fullWidth
            margin="normal"
            onChange={(e)=>{
              console.log("first")
              const page={...replacementData.page,postPerPage:e.target.value};
              setReplacementData({...replacementData,page})}}
          />
          
        <Box sx={{ display: "flex" }}>
          <TextField
            label="Page Name"
            defaultValue="bollywakae"
            disabled
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Category Name"
            defaultValue="Bollywood Page"
            disabled
            fullWidth
            sx={{ m: 2 }}
          />
          <TextField
            label="Follower Count"
            defaultValue="56099"
            disabled
            fullWidth
            margin="normal"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Close
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
          Replace  Request 
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReplacePagesModal;
