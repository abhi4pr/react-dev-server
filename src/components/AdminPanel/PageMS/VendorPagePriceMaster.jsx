import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";

export default function VendorPagePriceMaster() {
  const { toastAlert, toastError } = useGlobalContext();
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
    });
    axios.get(baseUrl + "getPageMastList").then((res) => {
      setPageMastList(res.data.data);
    });
    axios.get(baseUrl + "vendorAllData").then((res) => {
      setVendorList(res.data.tmsVendorkMastList);
    });
    axios.get(baseUrl + "getPriceList").then((res) => {
      setPriceTypeList(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!platformPriceId) {
      toastError("Please Fill Platform Price List");
      return;
    } else if (!pageMastId) {
      toastError("Please Fill Page");
      return;
    } else if (!vendorId) {
      toastError("Please Fill Owner Vendor");
      return;
    } else if (!priceTypeId) {
      toastError("Please Fill Price Type");
      return;
    } else if (!pricecalType) {
      toastError("Please Fill Price Cal Type");
      return;
    } else if (!priceFixed) {
      toastError("Please Fill Price Fixed");
      return;
    } else if (!priceVariable) {
      toastError("Please Fill Price Variable");
      return;
    }

    axios
      .post(baseUrl + "addVendorPagePrice", {
        platform_price_id: platformPriceId.value,
        pageMast_id: pageMastId.value,
        vendorMast_id: vendorId.value,
        price_type_id: priceTypeId.value,
        price_cal_type: pricecalType,
        variable_type: variableType,
        price_fixed: priceFixed,
        price_variable: priceVariable,
        description: description,
      })
      .then((res) => {
        if (res.status === 200) {
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
            required={true}
            value={platformPriceId}
            onChange={(selectedOption) => {
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
            required={true}
            value={{
              value: pageMastId,
              label:
                pageMastList.find(
                  (role) => role.pageMast_id === pageMastId.value
                )?.page_user_name || "",
            }}
            onChange={(e) => {
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
            required={true}
            value={{
              value: vendorId,
              label:
                vendorList.find((role) => role.vendorMast_id === vendorId.value)
                  ?.vendorMast_name || "",
            }}
            onChange={(e) => {
              setVendorId(e);
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
            required={true}
            value={{
              value: priceTypeId,
              label:
                priceTypeList.find((role) => role._id === priceTypeId.value)
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
