import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CampaignDetailes from "./CampaignDetailes";
import { Link, Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { DataGrid, GridExpandMoreIcon } from "@mui/x-data-grid";
import PageDetaling from "./PageDetailing";

import {
  Paper,
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  AccordionDetails,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordioan from "./Accordioan";
import { useNavigate } from "react-router-dom";
import PageOverview from "./PageOverview";
import PageDetailingNew from "./PageDetailingNew";

const PhasecreationNew = () => {
  const param = useParams();
  const id = param.id;

  const [allPageData, setAllPageData] = useState([]);
  const [phaseData, setPhaseData] = useState("");
  const [phaseDataError, setPhaseDataError] = useState("");
  const [phaseDcripation, setPhaseDcripation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [campaignName, setCampaignName] = useState([]);
  const [modalSearchPageStatus, setModalSearchPageStatus] = useState(false);
  const [cmpName, setCmpName] = useState("");
  const [allPhaseData, setAllPhaseData] = useState([]);
  const [showPageDetails, setShowPageDetails] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [assignAll, setAssignAll] = useState(false)

  useEffect(() => {
    getPhaseData();
  }, []);

  const getPhaseData = async () => {
    const data = await axios.get(
      `http://34.93.221.166:3000/api/campaignphase/${id}`
    );
    setAllPhaseData(data?.data?.result);
  };


  const getCampaignName = (detail, cmp) => {
    setCmpName(cmp);
    setCampaignName(detail);
  };

  const togglePageDetails = () => {
    setShowPageDetails(!showPageDetails);
    if (allPhaseData.length == 0) {
      setAssignAll(true)
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderHard = () => {
    getPhaseData();
  };
  return (
    <>
      <div className="form_heading_title">
        <h2 className="form-heading">Phase Creation</h2>
      </div>
      <CampaignDetailes cid={id} getCampaign={getCampaignName} />
      {/* add Accordion for show phase------------------- */}
      <Paper>
        {allPhaseData?.map((item, index) => (
          <Paper key={index}>
            <Link
              to={`/admin/createAssign/${item.phase_id}`}
              style={{
                margin: "2px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" color="primary" size="small">
                Create Assignment
              </Button>
              {
                allPhaseData.length == 0 &&
                <Button variant="contained" color="primary" size="small">
                  assign all
                </Button>
              }
            </Link>
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
              // aria-controls={`panel${index}bh-content`}
              // id={`panel${index}bh-header`}
              >
                <Typography>{`Phase ${index + 1}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <Accordioan data={item} /> */}

                <PageOverview
                  selectData={item.pages}
                  stage={"phase"}
                  setRender={renderHard}
                />
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </Paper>
      {/* add Accordion for show end phase------------------- */}

      <Button
        variant="outlined"
        onClick={togglePageDetails}
        sx={{ mt: 2, mb: 2 }}
      >
        {showPageDetails ? "Hide Page Details" : "Create New Phase"}
      </Button>

      {
        allPhaseData.length == 0 &&
        <Button variant="outlined" onClick={togglePageDetails}
          sx={{ m: 2, mb: 2 }}>
          assign all
        </Button>
      }

      {showPageDetails && (
        <>
          <Typography
            variant="h6"
            sx={{
              boxShadow: 4,
              mb: 2,
              borderRadius: "15px",
              padding: "5px",
            }}
            color="secondary"
          >
            Phase Details
          </Typography>
          <Paper>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <TextField
                label="Phase"
                value={phaseData}
                onChange={(e) => {
                  setPhaseData(e.target.value);
                  if (phaseDataError) {
                    setPhaseDataError("");
                  }
                }}
                sx={{ m: 1, width: "300px" }}
                error={!!phaseDataError}
                helperText={phaseDataError}
              />

              <TextField
                label="Description"
                value={phaseDcripation}
                onChange={(e) => setPhaseDcripation(e.target.value)}
                sx={{ m: 1, width: "300px" }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date *"
                  format="DD/MM/YY"
                  value={startDate}
                  onChange={(e) => setStartDate(e.$d)}
                  sx={{ m: 1, width: "300px" }}
                />
                <DatePicker
                  label="End Date *"
                  format="DD/MM/YY"
                  value={endDate}
                  onChange={(e) => setEndDate(e.$d)}
                  sx={{ m: 1, width: "300px" }}
                />
              </LocalizationProvider>
            </Box>

            {campaignName?.map((cmp, index) => {
              return (
                <Box
                  sx={{ display: "flex", justifyContent: "space-around" }}
                  key={index}
                >
                  <TextField
                    disabled
                    value={cmp?.commitment}
                    sx={{ m: 1 }}
                    fullWidth
                  />
                  <TextField
                    label="Value"
                    type="number"
                    onChange={(e) => {
                      let x = [...campaignName];
                      x.splice(index, 1, {
                        commitment: cmp?.commitment,
                        value: Number(e.target.value),
                      });
                      setCampaignName(x);
                    }}
                    sx={{ m: 1 }}
                    fullWidth
                  />
                </Box>
              );
            })}
          </Paper>

          <PageDetailingNew
            pageName={"phaseCreation"}
            data={{ campaignName: cmpName, campaignId: id }}
            phaseInfo={{
              phaseName: phaseData,
              description: phaseDcripation,
              commitment: campaignName,
              phaseDataError: phaseDataError,
              getPhaseData,
              setExpanded,
              setShowPageDetails,
              assignAll
            }}
            setPhaseDataError={setPhaseDataError}
          />
        </>
      )}
    </>
  );
};

export default PhasecreationNew;
