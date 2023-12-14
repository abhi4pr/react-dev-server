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

export default function BrandRegistration({
  brandSubCategory,
  userID,
  setCampaignBrand,
  setBrandReloadfromregistration,
}) {
  const { reloadbrands, setReloadbrands } = useContext(InstaInterpretorContext);
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [brandname, setBrandName] = useState(null);
  const [igusername, setIgusername] = useState(null);
  const [website, setWebsite] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [brandsubcat, setBrandsubcat] = useState(null);
  const [majorcat, setMajorcat] = useState(null);
  const [brandCategory, setBrandCategory] = useState(null);
  const [brandCategoryname, setBrandCategoryName] = useState(null);
  const [loading, setLoading] = useState(null);

  const majorcategoryoption = [
    { brandMajorCategory_id: 1, brandMajorCategory_name: "Brands" },
    { brandMajorCategory_id: 2, brandMajorCategory_name: "Normal" },
    { brandMajorCategory_id: 3, brandMajorCategory_name: "Negative" },
    { brandMajorCategory_id: 4, brandMajorCategory_name: "NBFRS" },
    { brandMajorCategory_id: 5, brandMajorCategory_name: "Entertainment" },
  ];

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRegister = () => {
    console.log(
      brandname,
      majorcat,
      brandCategoryname,
      brandsubcat,
      igusername,
      website,
      whatsapp
    );
    if (!brandname || !majorcat || !brandsubcat) {
      // Alert the user or handle the validation error as needed
      if (!majorcat) {
        alert("Please fill Campaign Name fields before submitting.");
        return;
      } else if (!brandname) {
        alert("Please fill Brand before submitting.");
        return;
      } else if (!brandsubcat) {
        alert("Please fill Brand Sub Category fields before submitting.");
        return;
      }
      alert("Please fill ALL fields before submitting.");
      return;
    }
    try {
      axios
        .post("http://34.93.221.166:3000/api/insta_brand", {
          instaBrandName: brandname,
          brandCategoryId: brandCategoryname.brandCategory_id,
          brandSubCategoryId: brandsubcat.brandSubCategory_id,
          igUserName: igusername,
          whatsApp: whatsapp,
          website: website,
          majorCategory: majorcat.brandMajorCategory_name,
          userId: userID,
          brandCategoryName: brandCategoryname.brandCategory_name,
          brandSubCategoryName: brandsubcat.brandSubCategory_name,
        })
        .then((res) => {
          console.log(res);
          setOpen(false);
          setBrandReloadfromregistration(false);
          setCampaignBrand(res.data.data);
          setReloadbrands(!reloadbrands);
        });
    } catch (error) {
      console.log(error);
    }

    // setReloadcampaign(!reloadcampaign);
  };

  const handlemajorcategory = (event, newValue) => {
    const selectedBrand = majorcategoryoption.find(
      (ele) => ele.brandMajorCategory_name === newValue
    );
    console.log(selectedBrand);
    setMajorcat(selectedBrand);
  };
  const handleBrandCategory = (event, newValue) => {
    const selectedBrand = brandCategory.find(
      (ele) => ele.brandCategory_name === newValue
    );
    console.log(selectedBrand);
    setBrandCategoryName(selectedBrand);
  };
  const handleBrandSubCategory = (event, newValue) => {
    const selectedBrand = brandSubCategory.find(
      (ele) => ele.brandSubCategory_name === newValue
    );
    console.log(selectedBrand);
    setBrandsubcat(selectedBrand);
  };
  // const descriptionElementRef = React.useRef(null);

  useEffect(() => {
    axios.get("http://34.93.221.166:3000/api/brandCategory").then((res) => {
      // console.log(res.data.data);
      setBrandCategory(res.data.data);
      setLoading(true);
    });
  }, []);

  return (
    <div>
      <Button onClick={handleClickOpen("paper")}>Add Brand Name</Button>

      {loading && (
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Register New Brand</DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText
              id="scroll-dialog-description"
              // ref={descriptionElementRef}
              tabIndex={-1}
            >
              <Grid container>
                <Stack sx={{ width: 400 }} spacing={2}>
                  <TextField
                    id="outlined-read-only-input"
                    label={"Brand Name"}
                    // value={textfieldValue[i]}
                    onChange={(e) => setBrandName(e.target.value)}
                  />

                  <Autocomplete
                    disablePortal
                    clearIcon={false}
                    id="combo-box-demo"
                    options={majorcategoryoption.map(
                      (ele) => ele.brandMajorCategory_name
                    )}
                    onInputChange={handlemajorcategory}
                    renderInput={(params) => (
                      <>
                        <TextField {...params} label="Major Category" />
                      </>
                    )}
                  />

                  {/* <BrandCategory /> */}

                  <Autocomplete
                    disablePortal
                    clearIcon={false}
                    id="combo-box-demo"
                    options={brandCategory.map(
                      (brcat) => brcat.brandCategory_name
                    )}
                    // options={majorcategoryoption.map(
                    //   (ele) => ele.brandMajorCategory_name
                    // )}
                    onInputChange={handleBrandCategory}
                    renderInput={(params) => (
                      <>
                        <TextField {...params} label="Brand Category" />
                      </>
                    )}
                  />

                  <Autocomplete
                    disablePortal
                    clearIcon={false}
                    id="combo-box-demo"
                    options={brandSubCategory.map(
                      (psc) => psc.brandSubCategory_name
                    )}
                    onInputChange={handleBrandSubCategory}
                    // onInputChange={(event, newValue) => {
                    //   setBrandsubcat(newValue);
                    // }}
                    renderInput={(params) => (
                      <>
                        <TextField {...params} label="Brand Sub category" />
                      </>
                    )}
                  />

                  <TextField
                    hiddenLabel
                    id="outlined-read-only-input"
                    label={"IG Username/Tag"}
                    // value={textfieldValue[i]}
                    onChange={(e) => setIgusername(e.target.value)}
                  />

                  <TextField
                    hiddenLabel
                    id="outlined-read-only-input"
                    label={"Website"}
                    // value={textfieldValue[i]}
                    onChange={(e) => setWebsite(e.target.value)}
                  />

                  <TextField
                    hiddenLabel
                    id="outlined-read-only-input"
                    label={"Whatsapp/Telegram Link"}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    // value={textfieldValue[i]}
                  />
                </Stack>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleRegister}>Register</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
