import React, { useEffect, useState } from 'react'
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Autocomplete,
} from "@mui/material";
import axios from 'axios';

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


const ReplacementRecord = ({ open, data, handleClose }) => {
    console.log(open, data,)
    const [replacementData,setReplacementData]=useState({})
    const [oldPageData,seteOldPageData]=useState({})
    const [newPageData,seteNewPageData]=useState({})

    const getRecord=async ()=>{
        const record=await axios.get(`http://localhost:3000/api/replacement/${data.replacement_id._id}`)
        setReplacementData(record?.data?.data)
        // console.log(record)
    }
    const getPageData=async ()=>{
        const oldPageData=await axios.get('http://localhost:3000/api/')
    }

    console.log(replacementData)

    useEffect(()=>{
        if(data){
            getRecord()
        }
    },[data])
    useEffect(()=>{
        if(replacementData){
            getPageData()
        }
    },[replacementData])
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography sx={{ mb: 4 }} variant="h6" component="h2">
                    Replacement Record
                </Typography>
                <Box sx={{ display: "flex" }}>
          <TextField
            label="status"
            defaultValue={replacementData?.replacement_status}
            disabled
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Stage"
            defaultValue={replacementData?.replacement_stage}
            disabled
            fullWidth
            sx={{ m: 2 }}
          />
          <TextField
            label="replacement for"
            defaultValue={replacementData?.oldPage_id}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="replacement by"
            defaultValue={replacementData?.newPage_id}
            disabled
            fullWidth
            margin="normal"
          />
        </Box>
            </Box>


        </Modal>
    )
}

export default ReplacementRecord