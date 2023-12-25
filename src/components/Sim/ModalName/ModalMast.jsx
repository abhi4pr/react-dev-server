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

const ModalMast = () => {
  const { getBrandDataContext } = useGlobalContext();
  const [modalName, setModalName] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalFilter, setModalFilter] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [brandNameUpdate, setBrandNameUpdate] = useState("");
  const [search, setSearch] = useState("");

  const [modalId, setModalId] = useState(0);
  const [modalNameUpdate, setModalNameUpdate] = useState("");

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
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Modal Name",
      selector: (row) => row.asset_modal_name,
      sortable: true,
    },
    {
      name: "Brand Name",
      selector: (row) => row.asset_brand_name,
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
            onClick={() => handleBrandData(row)}
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="delete_asset_brand"
            id={row.asset_modal_id}
            getData={getModalData}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://34.93.221.166:3000/api/add_asset_modal",
        {
          asset_modal_name: modalName,
          asset_brand_id: brandName,
        }
      );
      setModalName("");
      setBrandName("");
      getModalData();
    } catch (error) {
      console.log(error);
    }
  };
  async function getModalData() {
    const res = await axios.get(
      "http://34.93.221.166:3000/api/get_all_asset_modals"
    );
    setModalData(res.data);
    setModalFilter(res.data);
  }

  useEffect(() => {
    getModalData();
  }, []);

  const handleBrandData = (row) => {
    console.log(row, "data");
    setModalId(row.asset_modal_id);
    setModalNameUpdate(row.asset_modal_name);
    setBrandNameUpdate(row.asset_brand_id);
  };
  const handleModalUpdate = () => {
    console.log(modalId, "id");
    axios
      .put("http://34.93.221.166:3000/api/update_asset_modal", {
        asset_modal_id: modalId,
        asset_brand_id: brandNameUpdate,
        asset_modal_name: modalNameUpdate,
      })
      .then((res) => {
        getModalData();
      });
  };

  useEffect(() => {
    const result = modalData.filter((d) => {
      return d.asset_brand_name
        ?.toLowerCase()
        .match(search.toLocaleLowerCase());
    });
    setModalFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Modal"
          title="Add Modal"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Modal Name"
            value={modalName}
            onChange={(e) => setModalName(e.target.value)}
          />
          <div className="form-group col-6">
            <label className="form-label">
              Brand Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={getBrandDataContext.map((opt) => ({
                value: opt.asset_brand_id,
                label: opt.asset_brand_name,
              }))}
              value={{
                value: brandName,
                label:
                  getBrandDataContext.find(
                    (user) => user.asset_brand_id === brandName
                  )?.asset_brand_name || "",
              }}
              onChange={(e) => {
                setBrandName(e.value);
              }}
              required
            />
          </div>
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Modal Overview"
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
                Modal Update
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
              <FieldContainer
                label="Modal Name"
                fieldGrid={12}
                value={modalNameUpdate}
                onChange={(e) => setModalNameUpdate(e.target.value)}
              ></FieldContainer>
              <div className="form-group col-12">
                <label className="form-label">
                  Brand Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={getBrandDataContext.map((opt) => ({
                    value: opt.asset_brand_id,
                    label: opt.asset_brand_name,
                  }))}
                  value={{
                    value: brandNameUpdate,
                    label:
                      getBrandDataContext.find(
                        (user) => user.asset_brand_id === brandNameUpdate
                      )?.asset_brand_name || "",
                  }}
                  onChange={(e) => {
                    setBrandNameUpdate(e.value);
                  }}
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

export default ModalMast;
