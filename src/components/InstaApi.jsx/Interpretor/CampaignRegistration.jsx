import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import { event } from "jquery";
import { useEffect } from "react";
import axios from "axios";
import BrandCategory from "./BrandCategory";
import { useContext } from "react";
import { InstaInterpretorContext } from "./InterpretorContext";

export default function CampaignRegistration({
  brandsobj,
  userID,
  agency,
  setCampaignBrand,
  setCampaignName,
  setReloadfromregistration,
  campaignbrand,
}) {
  const { setReloadcampaign, reloadcampaign } = useContext(
    InstaInterpretorContext
  );
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [registercampaigname, setRegisterCampaignName] = useState(null);
  const [otherfield, setOtherfield] = useState(false);
  const [mannual, setMannual] = useState(false);
  const [agencyname, setAgencyName] = useState(null);
  const [brandname, setBrandName] = useState(campaignbrand?.instaBrandName);

  const [chatgptsuggestions, setChatgptsuggestions] = useState(["Loading..."]);
  const [brndIDforcampaign, setBrndIDforcampaign] = useState(null);

  const [numberofsuggestions, setNumberofsuggestions] = useState(10);
  const [suggestionslength, setSuggestionslength] = useState("short");
  const [suggestionsword, setSuggestionsword] = useState("");
  const [refreshdata, setRefreshdata] = useState(false);
  const [reloadchatgpt, setReloadchatgpt] = useState(false);

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
    setBrandName(null);
    setAgencyName(null);
    setRegisterCampaignName(null);
  };

  const handleClose = () => {
    setOpen(false);
    setOtherfield(false);
  };

  const handleRegister = (e) => {
    console.log(registercampaigname, agencyname, brandname);
    if (!brandname || !registercampaigname || !agencyname) {
      // Alert the user or handle the validation error as needed
      if (!brandname) {
        alert("Please select Brand Name fields before submitting.");
        return;
      } else if (!registercampaigname) {
        alert("Please fill Campaign Name before submitting.");
        return;
      }
      alert("Please select Agency before submitting.");
      return;
    }

    try {
      axios
        .post("http://34.93.221.166:3000/api/campaign", {
          brand_id: brandname.instaBrandId,
          user_id: userID,
          agency_id: agencyname.agency_id,
          campaign_name: registercampaigname,
        })
        .then((res) => {
          console.log(typeof res.status);
          console.log(res.data.data);
          if (res.status == 200) {
            setReloadfromregistration(false);
            setCampaignName(res.data.data);
            setCampaignBrand(brandname);
            setReloadcampaign(!reloadcampaign);
          } else {
            alert(
              "There is some issue while registering new Campaign. Please retry"
            );
          }
          console.log("reached here first");
          setOpen(false);
          setOtherfield(false);
        });
    } catch (error) {
      console.log(error);
    }

    console.log("reached");
  };

  const handleBrand = (event, newValue) => {
    const selectedBrand = brandsobj.find(
      (ele) => ele.instaBrandName === newValue
    );
    console.log("changing brand here", newValue);
    // setBrndIDforcampaign(selectedBrand.instaBrandId);
    setBrandName(selectedBrand);
    setOtherfield(!otherfield);
  };

  const handleAgency = (event, newValue) => {
    const selectedBrand = agency.find((ele) => ele.agency_name === newValue);
    // console.log(selectedBrand);
    setAgencyName(selectedBrand);
  };

  const handlerefreshdata = () => {
    // setChatgptsuggestions(["Loading..."]);
    setRefreshdata(!refreshdata);
    setReloadchatgpt(!reloadchatgpt);
  };

  const convertResponseToArray = (responseString) => {
    const responseArray = responseString.split("\n");

    // Remove numbering and any other unwanted characters
    const cleanResponseArray = responseArray.map((response) =>
      response.replace(/^\d+\.\s*/, "")
    );
    cleanResponseArray.shift();
    cleanResponseArray.shift();
    return cleanResponseArray;
  };

  useEffect(() => {
    if (brandname != null) {
      console.log(numberofsuggestions, suggestionslength, suggestionsword);
      axios
        .post("http://34.93.221.166:3000/chat", {
          prompt: `Give me ${numberofsuggestions} ${suggestionslength} campaign name elements starting with brand name and contain word ${suggestionsword} for brand  ${brandname?.instaBrandName}.`,
        })
        .then((res) => {
          const responseArray = convertResponseToArray(res.data);
          console.log(responseArray);
          console.log(res.data, "chatgpt response");
          setChatgptsuggestions(responseArray);
        });
    }
  }, [brandname, reloadchatgpt]);

  return (
    <div>
      <Button onClick={handleClickOpen("paper")}>Add Campaign Name</Button>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Register New Campaign
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            // ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Grid container>
              <Stack sx={{ width: 400, height: 400 }} spacing={2}>
                <Autocomplete
                  disablePortal
                  clearIcon={false}
                  value={campaignbrand ? campaignbrand.instaBrandName : null}
                  id="combo-box-demo"
                  options={brandsobj.map((br) => br.instaBrandName)}
                  onInputChange={handleBrand}
                  renderInput={(params) => (
                    <>
                      <TextField {...params} label="Brand" />
                    </>
                  )}
                />
                {otherfield && (
                  <>
                    {!mannual && (
                      <>
                        <Autocomplete
                          disablePortal
                          clearIcon={false}
                          id="combo-box-demo"
                          options={chatgptsuggestions}
                          onInputChange={(event, newValue) => {
                            setRegisterCampaignName(newValue);
                          }}
                          renderInput={(params) => (
                            <>
                              <TextField
                                {...params}
                                label="Suggested Campaign Name"
                              />
                            </>
                          )}
                        />

                        {refreshdata && (
                          <Stack direction="row" spacing={1}>
                            <Autocomplete
                              options={[10, 20, 30]}
                              //  onInputChange={(event,newValue)=>{

                              //  }}
                              id="disable-clearable"
                              disableClearable
                              onInputChange={(event, newValue) => {
                                setNumberofsuggestions(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Suggestions"
                                  variant="standard"
                                />
                              )}
                            />
                            <Autocomplete
                              options={["Short", "Medium", "Long"]}
                              //  onInputChange={(event,newValue)=>{

                              //  }}
                              id="disable-clearable"
                              disableClearable
                              sx={{ width: 100 }}
                              onInputChange={(event, newValue) => {
                                setSuggestionslength(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Response type"
                                  variant="standard"
                                />
                              )}
                            />
                            <TextField
                              id="filled-basic"
                              label="Response Include"
                              variant="filled"
                              onChange={(e) =>
                                setSuggestionsword(e.target.value)
                              }
                            />
                          </Stack>
                        )}
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ justifyContent: "flex-end" }}
                        >
                          <Button
                            disabled={refreshdata}
                            onClick={() => setRefreshdata(!refreshdata)}
                          >
                            More Option
                          </Button>
                          <Button
                            disabled={!refreshdata}
                            onClick={handlerefreshdata}
                          >
                            Get More
                          </Button>
                        </Stack>
                      </>
                    )}
                    {mannual && (
                      <>
                        <TextField
                          id="outlined-read-only-input"
                          label={"Campaign Name"}
                          // value={textfieldValue[i]}
                          onChange={(e) =>
                            setRegisterCampaignName(e.target.value)
                          }
                        />
                      </>
                    )}
                  </>
                )}
                <Autocomplete
                  disablePortal
                  clearIcon={false}
                  id="combo-box-demo"
                  options={agency.map((psc) => psc.agency_name)}
                  onInputChange={handleAgency}
                  renderInput={(params) => (
                    <>
                      <TextField {...params} label="Agency" />
                    </>
                  )}
                />
              </Stack>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          {/* {brandname && ( */}
          <Button
            disabled={!brandname}
            sx={{ alignItems: "start" }}
            onClick={() => setMannual(!mannual)}
          >
            {mannual ? "Auto" : "Mannual"}
          </Button>
          {/* )} */}
          <div>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleRegister}>Register</Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
