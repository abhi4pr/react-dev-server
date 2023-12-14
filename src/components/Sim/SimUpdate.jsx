import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

const SimUpdate = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [assetsName, setAssetsName] = useState("");
  const [assetsID, setAssetsID] = useState("");
  const [assetsOtherID, setAssetsOtherID] = useState("");
  const [isValidcontact, setValidContact] = useState(false);
  // const [isContactTouched, setisContactTouched] = useState(false);

  const [assetType, setAssetType] = useState(null);
  const [assetsCategory, setAssetsCategory] = useState(null);
  const [subCategory, setSubCategory] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [invoiceCopy, setInvoiceCopy] = useState("");
  const [inWarranty, setInWarranty] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");
  const [dateOfPurchase, setDateOfPurchase] = useState("");
  const [selfAuditPeriod, setSelfAuditPeriod] = useState("");
  const [selfAuditUnit, setSelfAuditUnit] = useState("");
  const [hrselfAuditPeriod, setHrSelfAuditPeriod] = useState("");
  const [hrselfAuditUnit, setHrSelfAuditUnit] = useState("");

  const [imageType, setImageType] = useState("");
  const [assetsImg1, setAssetsImg1] = useState(null);
  const [assetsImg2, setAssetsImg2] = useState(null);
  const [assetsImg3, setAssetsImg3] = useState(null);
  const [assetsImg4, setAssetsImg4] = useState(null);

  const [assetsValue, setAssetsValue] = useState("");
  const [assetsCurrentValue, setAssetsCurrentValue] = useState("");

  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [vendorData, setVendorData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const inWarrantyOption = ["No", "Yes"];
  const assettype = ["New", "Old"];
  const { id } = useParams();

  // All Category , subcategory and vendor api here
  const getAllCategory = () => {
    axios
      .get("http://34.93.221.166:3000/api/get_all_asset_category")
      .then((res) => {
        setCategoryData(res.data);
      });
  };
  const getAllSubCategory = () => {
    axios
      .get("http://34.93.221.166:3000/api/get_all_asset_sub_category")
      .then((res) => {
        setSubCategoryData(res.data);
      });
  };
  const getAllVendor = () => {
    axios.get("http://34.93.221.166:3000/api/get_all_vendor").then((res) => {
      setVendorData(res.data);
    });
  };
  useEffect(() => {
    getAllCategory();
    getAllSubCategory();
    getAllVendor();
  }, []);

  useEffect(() => {
    axios
      .get(`http://34.93.221.166:3000/api/get_single_sim/${id}`)
      .then((res) => {
        const fetchedData = res.data.data;
        //if (fetchedData.length > 0) {

        const {
          sim_no,
          s_type,
          assetsName,
          assetsOtherID,
          category_id,
          sub_category_id,
          vendor_id,
          inWarranty,
          warrantyDate,
          selfAuditPeriod,
          selfAuditUnit,
          hrAuditPeriod,
          hrAuditUnit,
          assetsValue,
          assetsCurrentValue,
          dateOfPurchase,
          Remarks,
        } = fetchedData;
        setAssetsName(assetsName);
        setAssetsID(sim_no);
        setAssetsOtherID(assetsOtherID);
        setAssetType(s_type);
        setAssetsCategory(category_id);
        setSubCategory(sub_category_id);
        setVendorName(vendor_id);
        setInWarranty(inWarranty);
        setWarrantyDate(warrantyDate?.split("T")?.[0]);
        setDateOfPurchase(dateOfPurchase?.split("T")?.[0]);
        setSelfAuditPeriod(selfAuditPeriod);
        setSelfAuditUnit(selfAuditUnit);
        setHrSelfAuditPeriod(hrAuditPeriod);
        setHrSelfAuditUnit(hrAuditUnit);
        setAssetsValue(assetsValue);
        setAssetsCurrentValue(assetsCurrentValue);
        setRemark(Remarks);
        // setSimData(fetchedData);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("id", id);
    formData.append("assetsName", assetsName);
    formData.append("sim_no", assetsID);
    formData.append("assetsOtherID", assetsOtherID);
    formData.append("s_type", assetType);
    formData.append("warrantyDate", Date(warrantyDate));
    formData.append("inWarranty", inWarranty);
    formData.append("dateOfPurchase", Date(dateOfPurchase));
    formData.append("category_id", assetsCategory);
    formData.append("sub_category_id", subCategory);
    formData.append("vendor_id", vendorName);
    formData.append("invoiceCopy", invoiceCopy);
    formData.append("selfAuditPeriod", selfAuditPeriod);
    formData.append("selfAuditUnit", selfAuditUnit);
    formData.append("hrselfAuditPeriod", hrselfAuditPeriod);
    formData.append("hrselfAuditUnit", hrselfAuditUnit);
    formData.append("assetsValue", Number(assetsValue));
    formData.append("assetsCurrentValue", Number(assetsCurrentValue));
    formData.append("remark", remark);
    formData.append("created_by", loginUserId);
    formData.append("status", "Available");

    try {
      const response = await axios.put(
        "http://34.93.221.166:3000/api/update_sim",
        formData
      );
      const imageData = new FormData();
      imageData.append("sim_id", id);
      imageData.append("uploaded_by", 90);
      imageData.append("type", imageType);
      imageData.append("img1", assetsImg1);
      imageData.append("img2", assetsImg2);
      imageData.append("img3", assetsImg3);
      imageData.append("img4", assetsImg4);
      axios.put("http://34.93.221.166:3000/api/update_assets_images", imageData);

      if (response.status === 200) {
        toastAlert("Form Submitted successfully");
        setIsFormSubmitted(true);
      } else {
        toastError("Form submission failed. Please try again later.");
      }
    } catch (error) {
      toastError("Form submission failed. Please try again later.");
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/sim-overview" />;
  }
  return (
    <div style={{ margin: "0 0 0 10%", width: "80%" }}>
      <UserNav />
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>Assets Update</h2>
        </div>
      </div>
      <form mainTitle="Assets" title="Assets Register" onSubmit={handleSubmit}>
        <div className="formarea">
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group ">
                <TextField
                  id="outlined-basic"
                  label="Assets Name"
                  type="text"
                  value={assetsName}
                  onChange={(e) => setAssetsName(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Assets ID *"
                  type="number"
                  value={assetsID}
                  onChange={(e) => setAssetsID(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Assets Other ID"
                  type="number"
                  value={assetsOtherID}
                  onChange={(e) => setAssetsOtherID(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  // sx={{ width: 600 }}
                  id="combo-box-demo"
                  options={inWarrantyOption}
                  value={inWarranty}
                  onChange={(e, newvalue) => setInWarranty(newvalue)}
                  defaultValue={inWarrantyOption[0]}
                  renderInput={(params) => (
                    <TextField {...params} label="In Warranty" />
                  )}
                />
              </div>
            </div>

            {inWarranty == "Yes" && (
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="form-group">
                  <TextField
                    id="outlined-basic"
                    InputLabelProps={{ shrink: true }}
                    label="Warranty Date"
                    type="date"
                    value={warrantyDate}
                    onChange={(e) => setWarrantyDate(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  // sx={{ width: 600 }}
                  id="combo-box-demo"
                  options={assettype}
                  value={assetType}
                  onChange={(e, newvalue) => setAssetType(newvalue)}
                  // defaultValue={assetcondition[0]}
                  renderInput={(params) => (
                    <TextField {...params} label="Asset Type" />
                  )}
                />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="Date of Purchase"
                  type="date"
                  value={dateOfPurchase}
                  onChange={(e) => setDateOfPurchase(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group form_select">
                `{" "}
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={categoryData?.map((cat) => ({
                    label: cat?.category_name,
                    value: cat?.category_id,
                  }))}
                  value={
                    categoryData?.find(
                      (cat) => cat.category_id === assetsCategory
                    )?.category_name || ""
                  }
                  onChange={(e, newValue) => {
                    setAssetsCategory(newValue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Assets Category *" />
                  )}
                />
                `
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={subcategoryData?.map((sub) => ({
                    label: sub?.sub_category_name,
                    value: sub?.sub_category_id,
                  }))}
                  // value={subCategory}
                  value={
                    subcategoryData?.find(
                      (sub) => sub.sub_category_id === subCategory
                    )?.sub_category_name || ""
                  }
                  onChange={(e, newvalue) => {
                    setSubCategory(newvalue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Sub Category *" />
                  )}
                />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vendorData.map((vendor) => ({
                    label: vendor.vendor_name,
                    value: vendor.vendor_id,
                  }))}
                  value={
                    vendorData?.find(
                      (vendor) => vendor.vendor_id === vendorName
                    )?.vendor_name || ""
                  }
                  onChange={(e, newvalue) => {
                    setVendorName(newvalue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Vendor Name *" />
                  )}
                />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="Invoice Copy"
                  type="file"
                  onChange={(e) => setInvoiceCopy(e.target.files[0])}
                />
              </div>
            </div>

            <h5>User Audit</h5>
            <hr className="mb-2 mt-2" />
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Self Audit Period in dasy"
                  type="number"
                  value={selfAuditPeriod}
                  onChange={(e) => setSelfAuditPeriod(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Self Audit Unit"
                  type="number"
                  value={selfAuditUnit}
                  onChange={(e) => setSelfAuditUnit(e.target.value)}
                />
              </div>
            </div>
            <hr className="mb-2" />
            <h5>HR Audit</h5>
            <hr className="mb-2 mt-2" />

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="HR Self Audit Period in days"
                  type="number"
                  value={hrselfAuditPeriod}
                  onChange={(e) => setHrSelfAuditPeriod(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="HR Self Audit Unit"
                  type="number"
                  value={hrselfAuditUnit}
                  onChange={(e) => setHrSelfAuditUnit(e.target.value)}
                />
              </div>
            </div>

            <h5 className="mb-3">Assets Image</h5>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="IMG 1"
                  type="file"
                  onChange={(e) => setAssetsImg1(e.target.files[0])}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="IMG 2"
                  type="file"
                  onChange={(e) => setAssetsImg2(e.target.files[0])}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="IMG 3"
                  type="file"
                  onChange={(e) => setAssetsImg3(e.target.files[0])}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="IMG 4"
                  type="file"
                  onChange={(e) => setAssetsImg4(e.target.files[0])}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Assets Value"
                  type="number"
                  value={assetsValue}
                  onChange={(e) => setAssetsValue(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Assets Current Value"
                  type="number"
                  value={assetsCurrentValue}
                  onChange={(e) => setAssetsCurrentValue(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Remark"
                  Tag="textarea"
                  rows="3"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary">Submit</button>
          </div>
        </div>
        {/* </div> */}
      </form>
    </div>
  );
};

export default SimUpdate;
