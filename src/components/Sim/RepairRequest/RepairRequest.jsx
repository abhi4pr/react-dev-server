import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useGlobalContext } from "../../../Context/Context";
import { Autocomplete, TextField } from "@mui/material";

const RepairRequest = () => {
  const { toastAlert, getAssetDataContext, usersDataContext } =
    useGlobalContext();
  const [modalData, setModalData] = useState([]);
  const [repairRequestFilter, setrepairRequestFilter] = useState([]);
  const [search, setSearch] = useState("");

  // Post Data State
  const [assetsName, setAssetName] = useState("");
  const [repairDate, setRepairDate] = useState("");
  const [priority, setPriority] = useState("");
  const [assetsImg1, setAssetsImg1] = useState(null);
  const [assetsImg2, setAssetsImg2] = useState(null);
  const [assetsImg3, setAssetsImg3] = useState(null);
  const [assetsImg4, setAssetsImg4] = useState(null);
  const [problemDetailing, setProblemDetailing] = useState("");
  const [tagUser, setTagUser] = useState([]);

  // Update Data State

  const [repairId, setRepairId] = useState(0);
  const [assetsNameUpdate, setAssetNameUpdate] = useState("");
  const [repairDateUpdate, setRepairDateUpdate] = useState("");
  const [priorityUpdate, setPriorityUpdate] = useState("");
  const [assetsImg1Update, setAssetsImg1Update] = useState(null);
  const [assetsImg2Update, setAssetsImg2Update] = useState(null);
  const [assetsImg3Update, setAssetsImg3Update] = useState(null);
  const [assetsImg4Update, setAssetsImg4Update] = useState(null);
  const [problemDetailingUpdate, setProblemDetailingUpdate] = useState("");

  const genderData = ["Low", "Medium", "High", "Urgent"];

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Repair Date",
      selector: (row) => row.repair_request_date_time,
      sortable: true,
    },
    {
      name: "Problem Detailing",
      selector: (row) => row.problem_detailing,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModal"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleRepairId(row)}
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="delete_repair_request"
            id={row.repair_id}
            getData={getRepairReason}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("repair_request_date_time", repairDate);
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
        "http://192.168.29.115:3000/api/add_repair_request",
        formData
      );
      setAssetName("");
      setRepairDate("");
      setPriority("");
      setAssetsImg1("");
      setAssetsImg2("");
      setAssetsImg3("");
      setAssetsImg4("");
      getRepairReason("");
      setProblemDetailing("");
      setTagUser([]);
      toastAlert("Success");
    } catch (error) {
      console.log(error);
    }
  };
  async function getRepairReason() {
    const res = await axios.get(
      "http://192.168.29.115:3000/api/get_all_repair_request"
    );
    setModalData(res?.data.data);
    setrepairRequestFilter(res?.data.data);
    console.log(res.data.data);
  }

  useEffect(() => {
    getRepairReason();
  }, []);

  const handleRepairId = (row) => {
    console.log(row, "data");
    setRepairId(row.repair_id);
    setRepairDateUpdate(row.reason);
  };

  // Update Function here with submittion
  const handleModalUpdate = () => {
    console.log(repairId, "id");
    axios
      .put("http://192.168.29.115:3000/api/update_asset_reason", {})
      .then((res) => {
        getRepairReason();
        toastAlert("Update Success");
      });
  };

  useEffect(() => {
    const result = modalData.filter((d) => {
      return d.category_name?.toLowerCase().match(search.toLocaleLowerCase());
    });
    setrepairRequestFilter(result);
  }, [search]);

  const userMultiChangeHandler = (e, op) => {
    setTagUser(op);
  };
  return (
    <div>
      <div style={{ width: "80%", margin: "0px 0 0 10%" }}>
        <UserNav />
        <div>
          <FormContainer
            mainTitle="Repair Reason"
            title="Add Reason"
            handleSubmit={handleSubmit}
          >
            <FieldContainer
              fieldGrid={3}
              label="Repair Request Date"
              type="datetime-local"
              value={repairDate}
              onChange={(e) => setRepairDate(e.target.value)}
              required
            />

            <div className="form-group col-3">
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
            <div className="form-group col-3">
              <label className="form-label">
                priority <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                className=""
                options={genderData.map((option) => ({
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

            <div className="col-sm-12 col-lg-3 p-2">
              <Autocomplete
                multiple
                id="combo-box-demo"
                options={usersDataContext.map((d) => ({
                  label: d.user_name,
                  value: d.user_id,
                }))}
                renderInput={(params) => <TextField {...params} label="Tag" />}
                onChange={userMultiChangeHandler}
              />
            </div>

            <FieldContainer
              label="IMG 1"
              type="file"
              required={false}
              fieldGrid={3}
              onChange={(e) => setAssetsImg1(e.target.files[0])}
            />

            <FieldContainer
              label="IMG 2"
              required={false}
              type="file"
              fieldGrid={3}
              onChange={(e) => setAssetsImg2(e.target.files[0])}
            />

            <FieldContainer
              label="IMG 3"
              required={false}
              type="file"
              fieldGrid={3}
              onChange={(e) => setAssetsImg3(e.target.files[0])}
            />

            <FieldContainer
              label="IMG 4"
              required={false}
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
          </FormContainer>
        </div>
        <div className="card" style={{ marginTop: "-18px" }}>
          <div className="data_tbl table-responsive mb-2">
            <DataTable
              title="Repair Reason Overview"
              columns={columns}
              data={repairRequestFilter}
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
      </div>
      {/* Update  */}
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
                Reason Request Update
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
              {/* <FieldContainer
                label="Reason "
                fieldGrid={12}
                value={repairDateUpdate}
                onChange={(e) => setRepairDateUpdate(e.target.value)}
              ></FieldContainer> */}
              <div className="row">
                <FieldContainer
                  fieldGrid={4}
                  label="Repair Request Date"
                  type="datetime-local"
                  value={repairDateUpdate}
                  onChange={(e) => setRepairDateUpdate(e.target.value)}
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
                      setAssetNameUpdate(e.value);
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
                    options={genderData.map((option) => ({
                      value: `${option}`,
                      label: `${option}`,
                    }))}
                    value={{
                      value: priorityUpdate,
                      label: `${priorityUpdate}`,
                    }}
                    onChange={(e) => {
                      setPriorityUpdate(e.value);
                    }}
                    required
                  />
                </div>

                <FieldContainer
                  label="IMG 1"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg1Update(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 2"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg2Update(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 3"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg3Update(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 4"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg4Update(e.target.files[0])}
                />

                <FieldContainer
                  label="Problem Detailing"
                  Tag="textarea"
                  value={problemDetailingUpdate}
                  onChange={(e) => setProblemDetailingUpdate(e.target.value)}
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
                onClick={handleModalUpdate}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairRequest;
