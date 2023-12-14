import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormGroup,
  Button,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import Popper from "@mui/material/Popper";
import { styled, lighten, darken } from "@mui/system";
import InstaPostDashboard from "../InstaPostDashboard";
import axios from "axios";
import { useMemo } from "react";
import { InstaInterpretorContext } from "./InterpretorContext";
import { useContext } from "react";
import { InstaContext } from "../InstaApiContext";
import BrandRegistration from "./BrandRegistration";
import CampaignRegistration from "./CampaignRegistration";

const InterpretorPage = ({ post, status, setStatus, hashtags, mentions }) => {
  const {
    brandsobj,
    pagedetail,
    pagecategory,
    isLoading,
    allcampaign,
    brandSubCategory,
    agency,
  } = useContext(InstaInterpretorContext);
  const { userID } = useContext(InstaContext);
  const [reloadfromregistration, setReloadfromregistration] = useState(true);
  const [reloadbrandfromregistration, setBrandReloadfromregistration] =
    useState(true);
  const [campaignbrand, setCampaignBrand] = useState(null);
  const [campaigname, setCampaignName] = useState(null);
  const [subcategory, setSubCategory] = useState(null);
  const [hashtag, setHashtag] = useState([]);
  const [mention, setMention] = useState([]);
  const [agencyname, setAgencyName] = useState(null);

  // console.log(post);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  // console.log(brandsobj);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      campaignbrand,
      campaigname,
      pagecategory.category_name,
      subcategory,
      agencyname,
      post
    );
    if (!campaignbrand || !campaigname || !subcategory || !agencyname) {
      // Alert the user or handle the validation error as needed
      if (!campaigname) {
        alert("Please fill Campaign Name fields before submitting.");
        return;
      } else if (!campaignbrand) {
        alert("Please fill Brand before submitting.");
        return;
      } else if (!agencyname) {
        alert("Please select Agency before submitting.");
      }
      alert("Please fill ALL fields before submitting.");
      return;
    }

    let tab = 2;
    if (post.posttype_decision > 2) {
      tab = post.posttype_decision;
    }
    axios.put("http://34.93.221.166:3000/api/instaupdate", {
      _id: post._id,
      posttype_decision: tab,
      interpretor_decision: 1,
      interpretor_name: userID,
      todayComment: campaignbrand.instaBrandId,
      todayLike: campaigname.campaign_id,
      todayView: agencyname.agency_id,
      pastComment: subcategory.brandSubCategory_id,
      mentions: mention.toString(),
      hashTag: hashtag.toString(),
    });
    // console.log(campaignbrand, campaigname, subcategory, post);
    setCampaignBrand(null);
    setCampaignName(null);
    setSubCategory(null);
    setAgencyName(null);
    setStatus(!status);
  };

  const handleBrandChange = (event, newValue) => {
    if (reloadbrandfromregistration) {
      const selectedBrand = brandsobj.find(
        (ele) => ele.instaBrandName === newValue
      );
      console.log(selectedBrand);
      setCampaignBrand(selectedBrand);
      // setReload(true);
    }
  };

  const handleAgencychange = (event, newValue) => {
    const selectedBrand = agency.find((ele) => ele.agency_name === newValue);
    // console.log(selectedBrand);
    setAgencyName(selectedBrand);
  };

  const handleCampaignChange = (event, newValue) => {
    console.log("this is running");
    if (reloadfromregistration) {
      const selectedBrand = allcampaign.find(
        (ele) => ele.campaign_name == newValue
      );
      console.log(allcampaign);
      const selectnewBrand = brandsobj.find(
        (ele) => ele.instaBrandId === selectedBrand.brand_id
      );
      console.log(selectnewBrand);
      setCampaignName(selectedBrand);
      setCampaignBrand(selectnewBrand);
    }
  };

  const handleSubCategoryChange = (event, newValue) => {
    console.log("this should not running");
    const selectedBrand = brandSubCategory.find(
      (ele) => ele.brandSubCategory_name === newValue
    );
    // console.log(selectedBrand);
    setSubCategory(selectedBrand);
  };
  const handlehashtag = (event, newValue) => {
    // console.log(typeof newValue);
    setHashtag(hashtag + newValue);
  };
  const handlemention = (event, newValue) => {
    // console.log(newValue);
    setMention(newValue);
  };

  const selectInputs = [];

  const oldDate = post.postedOn.split(" ");
  const arr = oldDate[0].toString().split("-");
  const newDate = arr[2] + "-" + arr[1] + "-" + arr[0];

  const oldTime = post.postedOn.split(" ");
  const timearr = oldTime[1].toString().split(":");
  timearr[0] = Number(timearr[0]) + 5;
  timearr[1] = Number(timearr[1]) + 30;
  let newTime = "";
  if (timearr[1] > 59) {
    timearr[0]++;
    timearr[1] = timearr[1] - 60;
    if (timearr[1] < 10) {
      timearr[1] = "0" + timearr[1];
    }
  }
  if (timearr[0] > 11) {
    timearr[0] = timearr[0] - 12;
    newTime = timearr[0] + ":" + timearr[1] + " PM";
  } else {
    newTime = timearr[0] + ":" + timearr[1] + " AM";
  }

  const textfieldtext = [
    "Date",
    "Time",
    "Page Name",
    "Profile Type",
    "Follower Count",
    "Page Category",
  ];
  // console.log(pagecategory, isLoading);
  // console.log(pagedetail, isLoading);
  const textfieldValue = [
    newDate,
    newTime,
    post.creatorName,
    pagedetail.profile_type,
    pagedetail.followers_count,
    pagecategory.category_name,
  ];

  for (let i = 0; i < 6; i++) {
    selectInputs.push(
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          variant="filled"
          id="outlined-read-only-input"
          label={textfieldtext[i]}
          value={textfieldValue[i]}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
    );
  }

  return (
    <>
      {isLoading && (
        <FormControl>
          <Grid container spacing={2}>
            {selectInputs}

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                clearIcon={false}
                value={campaignbrand ? campaignbrand.instaBrandName : null}
                id="combo-box-demo"
                options={brandsobj.map((br) => br.instaBrandName)}
                onInputChange={handleBrandChange}
                renderInput={(params) => (
                  <>
                    <TextField {...params} label="Brands" />
                  </>
                )}
              />
              <BrandRegistration
                brandsobj={brandsobj}
                brandSubCategory={brandSubCategory}
                userID={userID}
                setCampaignBrand={setCampaignBrand}
                setBrandReloadfromregistration={setBrandReloadfromregistration}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                clearIcon={false}
                id="combo-box-demo"
                value={campaigname ? campaigname?.campaign_name : null}
                options={
                  campaignbrand == null
                    ? allcampaign.map((camp) => camp.campaign_name)
                    : allcampaign
                        .filter(
                          (camp) => camp.brand_id == campaignbrand.instaBrandId
                        )
                        .map((camp) => camp.campaign_name)
                }
                // sx={{ width: 300 }}
                onInputChange={handleCampaignChange}
                renderInput={(params) => (
                  <>
                    <TextField {...params} label="Campaign Name" />
                  </>
                )}
              />
              <CampaignRegistration
                brandsobj={brandsobj}
                agency={agency}
                userID={userID}
                setCampaignBrand={setCampaignBrand}
                setCampaignName={setCampaignName}
                setReloadfromregistration={setReloadfromregistration}
                campaignbrand={campaignbrand}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                variant="filled"
                id="outlined-read-only-input"
                label={"Major Category"}
                value={campaignbrand ? campaignbrand?.majorCategory : undefined}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="outlined-read-only-input"
                label={"Brand Category"}
                variant="filled"
                value={
                  campaignbrand ? campaignbrand?.brandCategoryName : undefined
                }
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                clearIcon={false}
                id="combo-box-demo"
                // defaultValue={"work"}
                value={
                  campaignbrand ? campaignbrand.brandSubCategoryName : null
                }
                options={brandSubCategory.map(
                  (psc) => psc.brandSubCategory_name
                )}
                onInputChange={handleSubCategoryChange}
                renderInput={(params) => (
                  <>
                    <TextField {...params} label="Sub Category" />
                  </>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="outlined-read-only-input"
                label={"IG User Name"}
                variant="filled"
                value={campaignbrand ? campaignbrand.igUserName : undefined}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="outlined-read-only-input"
                label={"Website"}
                variant="filled"
                value={campaignbrand ? campaignbrand.website : undefined}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="outlined-read-only-input"
                label={"Whatsapp"}
                variant="filled"
                value={campaignbrand ? campaignbrand.whatsApp : undefined}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="outlined-read-only-input"
                label={"Post Link"}
                variant="filled"
                // value={campaignbrand ? campaignbrand.igusername : "Post Link"}
                value={post.postUrl}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="outlined-read-only-input"
                label={"Story Link"}
                variant="filled"
                defaultValue={"No link"}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                id="outlined-read-only-input"
                label={"Type"}
                variant="filled"
                value={post.postType}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                disablePortal
                clearIcon={false}
                id="combo-box-demo"
                // defaultValue={"work"}
                value={
                  campaigname
                    ? agency.find(
                        (ele) => ele.agency_id === campaigname.agency_id
                      ).agency_name
                    : null
                }
                options={agency.map((psc) => psc.agency_name)}
                onInputChange={handleAgencychange}
                renderInput={(params) => (
                  <>
                    <TextField {...params} label="Agency Name" />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={hashtags}
                getOptionLabel={(option) => option}
                // defaultValue={}
                filterSelectedOptions
                onChange={handlehashtag}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="HashTag"
                    placeholder="HashTag"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={mentions}
                getOptionLabel={(option) => option}
                onChange={handlemention}
                // defaultValue={}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Mentions"
                    placeholder="Mentions"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            sx={{ mt: 2 }}
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </FormControl>
      )}
    </>
  );
};

export default InterpretorPage;
