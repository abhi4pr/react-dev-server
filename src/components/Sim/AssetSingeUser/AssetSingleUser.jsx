import React from "react";
import FormContainer from "../../../components/AdminPanel/FormContainer";
import FieldContainer from "../../../components/AdminPanel/FieldContainer";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { Autocomplete, TextField } from "@mui/material";
import Select from "react-select";
import axios from "axios";

const AssetSingleUser = () => {
  const { usersDataContext, getAssetDataContext, toastAlert } =
    useGlobalContext();
  const { userID } = useAPIGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState("");

  const [reasonData, setReasonData] = useState([]);
  const [reason, setReason] = useState("");
  const [assetsName, setAssetName] = useState("");
  const [repairDate, setRepairDate] = useState("");
  const [priority, setPriority] = useState("");
  const [assetsImg1, setAssetsImg1] = useState(null);
  const [assetsImg2, setAssetsImg2] = useState(null);
  const [assetsImg3, setAssetsImg3] = useState(null);
  const [assetsImg4, setAssetsImg4] = useState(null);
  const [problemDetailing, setProblemDetailing] = useState("");
  const [tagUser, setTagUser] = useState([]);
  const PriorityData = ["Low", "Medium", "High", "Urgent"];

  const getData = async () => {
    try {
      const res = await axios.get(
        `http://34.93.221.166:3000/api/get_allocated_asset_data_for_user_id/${userID}`
      );
      setData(res.data.data);
      setFilterData(res.data.data);
      console.log(res.data.data, "userAsset");
    } catch (error) {
      console.log(error);
    }
  };
  async function getRepairReason() {
    const res = await axios.get(
      "http://34.93.221.166:3000/api/get_all_assetResons"
    );
    console.log(res.data.data, "reason");
    setReasonData(res?.data.data);
  }

  useEffect(() => {
    getRepairReason();
    getData();
  }, []);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.assetsName,
      sortable: true,
    },
    {
      name: "Assigned Date",
      selector: (row) => row.submitted_at,
      sortable: true,
    },

    {
      name: "RepairReason",
      cell: (row) => (
        <button
          onClick={() => handleRow(row)}
          className="btn btn-warning"
          data-toggle="modal"
          data-target="#exampleModal"
          size="small"
        >
          Repair
        </button>
      ),
    },
  ];
  useEffect(() => {
    const result = data.filter((d) => {
      return d.assetsName?.toLowerCase().match(search.toLocaleLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const userMultiChangeHandler = (e, op) => {
    setTagUser(op);
  };

  const handleRow = (row) => {
    console.log(row.assetsName, "row is here");
    setAssetName(row?.sim_id);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("repair_request_date_time", repairDate);
      formData.append("req_by", userID);
      formData.append("asset_reason_id", reason);
      formData.append("sim_id", assetsName);
      formData.append("priority", priority);
      formData.append(
        "multi_tag",
        tagUser.map((user) => user.value)
      );
      formData.append("img1", assetsImg1);
      formData.append("img2", assetsImg2);
      formData.append("img3", assetsImg3);
      formData.append("img4", assetsImg4);
      formData.append("problem_detailing", problemDetailing);

      const response = await axios.post(
        "http://34.93.221.166:3000/api/add_repair_request",
        formData
      );
      setAssetName("");
      setRepairDate("");
      setPriority("");
      setAssetsImg1("");
      setAssetsImg2("");
      setAssetsImg3("");
      setAssetsImg4("");
      getRepairRequest("");
      setProblemDetailing("");
      setTagUser([]);
      toastAlert("Success");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 16);
    setRepairDate(currentDate);
  }, []);
  return (
    <>
      <FormContainer
        mainTitle="Asset"
        link="/"
        submitButton={false}
        buttonAccess={false}
      />
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Asset Details"
            columns={columns}
            data={filterData}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="36vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ marginLeft: "400px" }}
        >
          <div
            className="modal-content"
            style={{ marginLeft: "100px", width: "200%" }}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Reason Request
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <FieldContainer
                  fieldGrid={4}
                  label="Repair Request Date"
                  type="datetime-local"
                  value={repairDate}
                  onChange={(e) => setRepairDate(e.target.value)}
                  required
                />

                <div className="form-group col-4">
                  <label className="form-label">
                    Asset Name <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={getAssetDataContext.map((opt) => ({
                      value: opt.sim_id,
                      label: opt.assetsName,
                    }))}
                    value={{
                      value: assetsName,
                      label:
                        getAssetDataContext.find(
                          (user) => user.sim_id === assetsName
                        )?.assetsName || "",
                    }}
                    onChange={(e) => {
                      setAssetName(e.value);
                    }}
                    required
                  />
                </div>
                <div className="form-group col-4">
                  <label className="form-label">
                    Reason <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={reasonData.map((opt) => ({
                      value: opt.asset_reason_id,
                      label: opt.reason,
                    }))}
                    value={{
                      value: reason,
                      label:
                        reasonData.find((d) => d.asset_reason_id === reason)
                          ?.reason || "",
                    }}
                    onChange={(e) => {
                      setReason(e.value);
                    }}
                    required
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">
                    priority <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    className=""
                    options={PriorityData.map((option) => ({
                      value: `${option}`,
                      label: `${option}`,
                    }))}
                    value={{
                      value: priority,
                      label: `${priority}`,
                    }}
                    onChange={(e) => {
                      setPriority(e.value);
                    }}
                    required
                  />
                </div>

                <div className="col-sm-12 col-lg-8 p-2">
                  <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={usersDataContext.map((d) => ({
                      label: d.user_name,
                      value: d.user_id,
                    }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Tag" />
                    )}
                    onChange={userMultiChangeHandler}
                  />
                </div>

                <FieldContainer
                  label="IMG 1"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg1(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 2"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg2(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 3"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg3(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 4"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg4(e.target.files[0])}
                />

                <FieldContainer
                  label="Problem Detailing"
                  Tag="textarea"
                  value={problemDetailing}
                  onChange={(e) => setProblemDetailing(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetSingleUser;
