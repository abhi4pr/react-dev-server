import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import Select from "react-select";
import { useNavigate } from "react-router-dom";



export default function VendorPagePriceMaster() {
    const Navigate = useNavigate();
    const [platformPriceList, setPlatformPriceList] = useState([]);
    const [platformPriceId, setPlatformPriceId] = useState("");
    const [pageMastList, setPageMastList] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [pageMastId, setPageMastId] = useState("");
    const [vendorId, setVendorId] = useState("");
    const [priceTypeList, setPriceTypeList] = useState([]);
    const [priceTypeId, setPriceTypeId] = useState("");
    const [pricecalType, setPriceCalType] = useState("");
    const [variableType, setVariableType] = useState("");
    const [priceFixed, setPriceFixed] = useState("");
    const [priceVariable, setPriceVariable] = useState("");
    const [description, setDescription] = useState("");

  const getData = () => {
    axios.get(baseUrl + "getPlatformPriceList").then((res) => {
      setPlatformPriceList(res.data.data);
      console.log(res.data.data, "platform price list");
    });
    axios.get(baseUrl + "getPageMastList").then((res) => {
      setPageMastList(res.data.data);
      console.log(res.data.data, "page mast list");
    });
    axios.get(baseUrl + "vendorAllData").then((res) => {
      setVendorList(res.data.tmsVendorkMastList);
      console.log(res.data.tmsVendorkMastList, "vendorAllData list");
    });
    axios.get(baseUrl + "getPriceList").then((res) => {
      setPriceTypeList(res.data.data);
      //   console.log(res.data.data, "page mast list");
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "addVendorPagePrice", {
        platform_price_id: platformPriceId,
        pageMast_id: pageMastId,
        vendorMast_id: vendorId,
        price_type_id: priceTypeId,
        price_cal_type: pricecalType,
        variable_type: variableType,
        price_fixed: priceFixed,
        price_variable: priceVariable,
        description: description,

      })
      .then((res) => {
        console.log(res.status);
  if (res.status === 200) {
    // alert("Data Submitted");
    Navigate("/admin/pms-vendor-page-price-overview");
    }
       
      });
  };

  return (
    <>
      <FormContainer
        mainTitle="Vendor Page Price Master"
        title="Vendor Page Price Master"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-6 ">
          <label className="form-label">
            Platform Price List <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformPriceList.map((option) => ({
              value: option._id,
              label: option._id,
            }))}
            value={platformPriceId}
            onChange={(selectedOption) => {
              console.log(selectedOption, "selectedOption.value");
              setPlatformPriceId(selectedOption);
            }}
          />
        </div>

        <div className="form-group col-6 ">
          <label className="form-label">
            Page <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={pageMastList.map((option) => ({
              value: option.pageMast_id,
              label: option.page_user_name,
            }))}
            value={{
              value: pageMastId,
              label:
                pageMastList.find((role) => role.pageMast_id === pageMastId)
                  ?.page_user_name || "",
            }}
            onChange={(e) => {
              console.log(e, "e.target.value");
              setPageMastId(e);
            }}
          ></Select>
        </div>

        <div className="form-group col-6 ">
          <label className="form-label">
            Owner Vendor <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={vendorList.map((option) => ({
              value: option.vendorMast_id,
              label: option.vendorMast_name,
            }))}
            value={{
              value: vendorId,
              label:
                vendorList.find((role) => role.vendorMast_id === vendorId)
                  ?.vendorMast_name || "",
            }}
            onChange={(e) => {
              setVendorId(e);
              console.log(e, "e.target.value");
            }}
          ></Select>
        </div>

        <div className="form-group col-6 ">
          <label className="form-label">
            Price Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={priceTypeList.map((option) => ({
              value: option._id,
              label: option.price_type,
            }))}
            value={{
              value: priceTypeId,
              label:
                priceTypeList.find((role) => role._id === priceTypeId)
                  ?.price_type || "",
            }}
            onChange={(e) => {
              setPriceTypeId(e);
            }}
          ></Select>
        </div>

        <FieldContainer
          label="Price Cal Type *"
          value={pricecalType}
          required={true}
          type="number"
          onChange={(e) => setPriceCalType(e.target.value)}
        />
        <FieldContainer
          label="Variable Type *"
          value={variableType}
          required={false}
          onChange={(e) => setVariableType(e.target.value)}
        />

        <FieldContainer
          label="Price Fixed *"
          value={priceFixed}
          required={true}
          onChange={(e) => setPriceFixed(e.target.value)}
        />
        <FieldContainer
          label="Price Variable *"
          value={priceVariable}
          required={true}
          onChange={(e) => setPriceVariable(e.target.value)}
        />

        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>
    </>
  );
}
