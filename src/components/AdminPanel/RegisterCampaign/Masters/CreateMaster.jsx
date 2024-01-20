import { TextField, Button, Paper, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../../Context/Context";

const CreateMaster = ({ name, data }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const url = "http://192.168.29.114:3000/api/";
  const navigate = useNavigate();
  const [payload, setPayload] = useState({});
  const handleSubmit = async () => {
    try {
      let result;
      if (name === "Agency") {
        result = await axios.post(`${url}agency`, payload);
      } else if (name === "Goal") {
        result = await axios.post(`${url}goal`, payload);
      } else if (name === "Industry") {
        result = await axios.post(`${url}industry`, payload);
      } else if (name === "Service") {
        result = await axios.post(`${url}services`, payload);
      }
      if (result.status === 200) {
        toastAlert("Added Successfully");
        navigate(`/admin/overview/${name}`);
      }
    } catch (error) {
      if (error.response.status === 403) {
        toastError(error.response.data.message);
      } else if (error.response.data.message) {
        toastError("Fill Required field");
      } else {
        toastError("Error");
      }
    }
  };

  const changeHandler = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  console.log(payload);
  return (
    <>
      <Paper>
        <div className="form-heading">
          <div className="form_heading_title">
            <h2> Create {name} </h2>
          </div>
        </div>
      </Paper>
      <Box>
        <Grid container spacing={2}>
          {data &&
            data.map((field, index) => (
              <Grid item xs={4} key={index}>
                <TextField
                  name={field.payload}
                  onChange={changeHandler}
                  label={field.label}
                  sx={{ mt: 0.5 }}
                  fullWidth
                />
              </Grid>
            ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <Button variant="outlined" color="error" onClick={handleSubmit}>
            submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CreateMaster;
