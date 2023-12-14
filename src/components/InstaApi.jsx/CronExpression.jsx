import { Button, Paper } from "@mui/material";
import axios from "axios";
import { useState } from "react";
// import { Cron } from "react-js-cron";
import "react-js-cron/dist/styles.css";
import { Link, useParams } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Cron from "react-cron-generator";
// import "react-cron-generator/dist/cron-builder.css";

function CronExpression() {
  const [value, setValue] = useState("0 0/15 * * * ? *");
  // let defaultupdate = "*/15 * * * *";
  // const [snackbar, setSnackbar] = useState(null);
  const { creatorName, shortcodes } = useParams();
  // console.log(value);

  const handlechange = () => {
    let cronexp = value;
    // console.log(value);
    if (
      value == "0 0 00 1/1 * ? *" ||
      value == "0 0/1 * * * ? *" ||
      value == "0 0 00 ? * * *" ||
      value == "0 0 00 1 1/1 ? *" ||
      value == "* * * * * * *"
    ) {
      // console.log("match");
      cronexp = "*/15 * * * *";
    }
    // console.log(cronexp);
    // console.log(defaultupdate);
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYzYWVhY2Q2ZjUzYWZkNDQ1YWIxYjBlNSIsIm5hbWUiOiJjcmVhdGl2ZWZ1ZWwiLCJleHAiOjE3MTc2NDE3NTQsInJvbGUiOiJDTElFTlQiLCJwZXJtaXNzaW9ucyI6W10sInNlc3Npb24iOiI2NjI4OWUxNy1kMzhhLTRiMGQtOWQ0OS1kNDNjN2FlYmY2ZTkifQ.2FOqqjke66EiK0WJa1iBbbDrQdlzoTrpDRhGhjbtRww"; // Replace with your actual Bearer token

    // Set the Authorization header with the Bearer token
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Adjust the content type as needed
      },
    };

    // Make the POST request
    try {
      axios.post(
        "http://34.93.221.166:3000/api/track_post_posty",
        {
          connector: "instagram",
          shortcode: shortcodes,
          cron_expression: cronexp,
        },
        axiosConfig
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // const handleCloseSnackbar = () => setSnackbar(null);
  const handleCronChange = (cronValue) => {
    setValue(cronValue);
    // defaultupdate = "*/15 * * * *";
  };
  // const handledefault = (cronValue) => {
  //   setValue("*/15 * * * *");
  //   defaultupdate = "*/15 * * * *";
  //   handlechange();
  // };
  return (
    <Paper sx={{ p: 10 }}>
      <Cron
        onChange={handleCronChange}
        // locale={"*/15 * * * *"}
        value={value}
        showResultText={true}
        showResultCron={true}
      />
      <Link to={`/admin/instaapi/${creatorName}`}>
        <Button
          variant="contained"
          color="success"
          sx={{ ml: 64, mt: 3 }}
          autoFocus
          onClick={handlechange}
        >
          Update
        </Button>
      </Link>
    </Paper>
  );
}
export default CronExpression;
