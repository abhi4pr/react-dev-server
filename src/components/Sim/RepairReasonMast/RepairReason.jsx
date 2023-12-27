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

const RepairReason = () => {
  const { categoryDataContext, toastAlert } = useGlobalContext();
  const [reason, setReason] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalFilter, setModalFilter] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameUpdate, setCategoryNameUpdate] = useState("");
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryNameUpdate, setSubCategoryNameUpdate] = useState("");
  const [search, setSearch] = useState("");

  const [repairId, setRepairId] = useState(0);
  const [reasonUpdate, setReasonUpdate] = useState("");

  // const [brandData, setBrandData] = useState([]);
  // async function getBrandData() {
  //   const res = await axios.get(
  //     "http://34.93.221.166:3000/api/get_all_asset_brands"
  //   );
  //   setBrandData(res.data.data);
  // }
  // useEffect(() => {
  //   getBrandData();
  // }, []);

  const getAllSubCategory = () => {
    if (categoryName) {
      axios
        .get(
          `http://34.93.221.166:3000/api/get_single_asset_sub_category/${categoryName}`
        )
        .then((res) => {
          setSubCategoryData(res.data);
        });
    }
  };
  useEffect(() => {
    getAllSubCategory();
  }, [categoryName]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Sub Category Name",
      selector: (row) => row.sub_category_name,
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
            endpoint="delete_assetReson"
            id={row.asset_reason_id}
            getData={getRepairReason}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://192.168.29.115:3000/api/add_asset_reason",
        {
          reason: reason,
          category_id: categoryName,
          sub_category_id: subCategoryName,
        }
      );
      setReason("");
      setCategoryName("");
      setSubCategoryName("");
      getRepairReason("");
      toastAlert("Success");
    } catch (error) {
      console.log(error);
    }
  };
  async function getRepairReason() {
    const res = await axios.get(
      "http://192.168.29.115:3000/api/get_all_assetResons"
    );
    setModalData(res?.data.data);
    setModalFilter(res?.data.data);
    console.log(res.data.data);
  }

  useEffect(() => {
    getRepairReason();
  }, []);

  const handleRepairId = (row) => {
    console.log(row, "data");
    setRepairId(row.asset_reason_id);
    setReasonUpdate(row.reason);
    setCategoryNameUpdate(row.category_id);
    setSubCategoryNameUpdate(row.sub_category_id);
  };

  // Update Function here with submittion
  const handleModalUpdate = () => {
    console.log(repairId, "id");
    axios
      .put("http://192.168.29.115:3000/api/update_asset_reason", {
        asset_reason_id: repairId,
        category_id: categoryNameUpdate,
        sub_category_id: subCategoryNameUpdate,
        reason: reasonUpdate,
      })
      .then((res) => {
        getRepairReason();
        toastAlert("Update Success");
      });
  };

  useEffect(() => {
    const result = modalData.filter((d) => {
      return d.category_name?.toLowerCase().match(search.toLocaleLowerCase());
    });
    setModalFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Repair Reason"
          title="Add Reason"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            fieldGrid={4}
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <div className="form-group col-4">
            <label className="form-label">
              Category Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={categoryDataContext.map((opt) => ({
                value: opt.category_id,
                label: opt.category_name,
              }))}
              value={{
                value: categoryName,
                label:
                  categoryDataContext.find(
                    (user) => user.category_id === categoryName
                  )?.category_name || "",
              }}
              onChange={(e) => {
                setCategoryName(e.value);
              }}
              required
            />
          </div>
          <div className="form-group col-4">
            <label className="form-label">
              Sub Category Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={subcategoryData.map((opt) => ({
                value: opt.sub_category_id,
                label: opt.sub_category_name,
              }))}
              value={{
                value: subCategoryName,
                label:
                  subcategoryData.find(
                    (user) => user.sub_category_id === subCategoryName
                  )?.sub_category_name || "",
              }}
              onChange={(e) => {
                setSubCategoryName(e.value);
              }}
              required
            />
          </div>
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Repair Reason Overview"
              columns={columns}
              data={modalFilter}
              fixedHeader
              // pagination
              fixedHeaderScrollHeight="64vh"
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
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Reason Update
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
              <div className="form-group col-12">
                <label className="form-label">
                  Category Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={categoryDataContext.map((opt) => ({
                    value: opt.category_id,
                    label: opt.category_name,
                  }))}
                  value={{
                    value: categoryNameUpdate,
                    label:
                      categoryDataContext.find(
                        (user) => user.category_id === categoryNameUpdate
                      )?.category_name || "",
                  }}
                  onChange={(e) => {
                    setCategoryNameUpdate(e.value);
                  }}
                  required
                />
              </div>
              <div className="form-group col-12">
                <label className="form-label">
                  Sub Category Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={subcategoryData.map((opt) => ({
                    value: opt.sub_category_id,
                    label: opt.sub_category_name,
                  }))}
                  value={{
                    value: subCategoryNameUpdate,
                    label:
                      subcategoryData.find(
                        (user) => user.sub_category_id === subCategoryNameUpdate
                      )?.sub_category_name || "",
                  }}
                  onChange={(e) => {
                    setSubCategoryNameUpdate(e.value);
                  }}
                  required
                />
              </div>
              <FieldContainer
                label="Reason "
                fieldGrid={12}
                value={reasonUpdate}
                onChange={(e) => setReasonUpdate(e.target.value)}
              ></FieldContainer>
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

export default RepairReason;
