import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { Stack } from "@mui/material";
import { useState } from "react";
import VendorPages from "./VendorPages";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": { borderBottom: 0 },
  "&::before": { display: "none" },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": { marginLeft: theme.spacing(1) },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function VendorDetailAccordion({ vendorDetails, bankRows }) {
  const [expanded, setExpanded] = useState("panel1");
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  console.log(vendorDetails, "vendorDetails");
  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{ width: "50%" }}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Personal Detail</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row">
              <List
                sx={{ bgcolor: "background.paper", width: "50%" }}
                component="nav"
              >
                <ListItemButton>
                  <ListItemText primary="Name" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Category" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Platform" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Type" />
                </ListItemButton>
                <ListItemButton onClick={handleClick}>
                  <ListItemText primary="Contact" />
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary="Alternate" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>

              <List sx={{ bgcolor: "background.paper" }} component="nav">
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.vendor_name} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.vendor_category} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.vendor_platform} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.vendor_type} />
                </ListItemButton>
                <ListItemButton onClick={handleClick}>
                  <ListItemText primary={vendorDetails?.mobile} />
                  {open ? (
                    <ArrowForwardIosSharpIcon />
                  ) : (
                    <ArrowForwardIosSharpIcon />
                  )}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary={vendorDetails?.alternate_mobile} />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{ width: "50%" }}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Personal Address</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row">
              <List
                sx={{ bgcolor: "background.paper", width: "50%" }}
                component="nav"
              >
                <ListItemButton>
                  <ListItemText primary="Address" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Country" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="City" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="State" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Pin-Code" />
                </ListItemButton>
              </List>

              <List sx={{ bgcolor: "background.paper" }} component="nav">
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.home_address} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.country_code} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.home_city} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.home_state} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.company_pincode} />
                </ListItemButton>
              </List>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{ width: "50%" }}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Company Address</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row">
              <List
                sx={{ bgcolor: "background.paper", width: "50%" }}
                component="nav"
              >
                <ListItemButton>
                  <ListItemText primary="Address" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Country" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="City" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="State" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Pin-Code" />
                </ListItemButton>
              </List>

              <List sx={{ bgcolor: "background.paper" }} component="nav">
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.company_address} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.company_country} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.company_city} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.company_state} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={vendorDetails?.company_pincode} />
                </ListItemButton>
              </List>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
          sx={{ width: "100%" }}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography>Bank Detail</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row">
              <List
                sx={{ bgcolor: "background.paper", width: "50%" }}
                component="nav"
              >
                <ListItemButton>
                  <ListItemText primary="Bank Name" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Account Type" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Account Number" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="IFSC" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="UPI ID" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Registered Number" />
                </ListItemButton>
              </List>

              {bankRows.map((ele, index) => {
                return (
                  <List
                    key={index}
                    sx={{ bgcolor: "background.paper" }}
                    component="nav"
                  >
                    <ListItemButton>
                      <ListItemText primary={ele?.bank_name} />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary={ele?.account_type} />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary={ele?.account_number} />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary={ele?.ifsc} />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary={ele?.upi_id} />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemText primary={ele?.registered_number} />
                    </ListItemButton>
                  </List>
                );
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>

      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Documents</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row">
            <List
              sx={{ width: "50%", bgcolor: "background.paper" }}
              component="nav"
            >
              <ListItemButton>
                <ListItemText primary="GST" />
                <ListItemText primary={vendorDetails?.gst_no} />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="GST Image" />
                {/* {imagePreview && ( */}
                <img
                  src={`https://storage.googleapis.com/insights_backend_bucket/p/CyKeZQToTkx.jpeg`}
                  alt="Image Preview"
                  style={{ width: "50%", height: "50%", marginTop: "1px" }}
                />
                {/* )} */}
              </ListItemButton>
            </List>
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded ={expanded === ("panel1" || "panel2" || "panel3") || "panel4" }
        onChange={handleChange("panel4")}
      >
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography>Pages</Typography>
        </AccordionSummary>
        {/* <AccordionDetails> */}
          <VendorPages vendorDetails={vendorDetails} />
        {/* </AccordionDetails> */}
      </Accordion>
    </div>
  );
}
