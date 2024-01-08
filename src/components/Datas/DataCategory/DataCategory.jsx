import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";

import FieldContainer from "../../AdminPanel/FieldContainer";
import FormContainer from "../../AdminPanel/FormContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";

const DataCategory = () => {
  const [subCatData, setSubCategoryData] = useState([]);
  const [subCatName, setSubCatName] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalFilter, setModalFilter] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameUpdate, setCategoryNameUpdate] = useState("");
  const [search, setSearch] = useState("");

  const [modalId, setModalId] = useState(0);
  const [subCatNameUpdate, setSubCatNameUpdate] = useState("");

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },

    {
      name: "Category Name",
      selector: (row) => row.category_name,
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
            endpoint="delete_asset_modal"
            id={row._id}
            getData={getModalData}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isModalExists = modalData.some(
        (d) => d.asset_modal_name === subCatName
      );
      if (isModalExists) {
        alert("Brand already Exists");
      } else {
        const response = await axios.post(
          "http://34.93.221.166:3000/api/add_data_category",
          {
            category_name: categoryName,
          }
        );
        setCategoryName("");
        getModalData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function getModalData() {
    const res = await axios.get(
      "http://34.93.221.166:3000/api/get_all_data_categorys"
    );
    setModalData(res.data);
    setModalFilter(res.data);
  }

  useEffect(() => {
    getModalData();
  }, []);

  const handleBrandData = (row) => {
    setModalId(row._id);
    setCategoryNameUpdate(row.category_name);
  };
  const handleModalUpdate = () => {
    axios
      .put("http://34.93.221.166:3000/api/update_data_category", {
        _id: modalId,
        category_name: categoryNameUpdate,
      })
      .then((res) => {
        getModalData();
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
          mainTitle="Data Category"
          title="category"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Cat Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
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
                label="Cat Name"
                value={categoryNameUpdate}
                onChange={(e) => setCategoryNameUpdate(e.target.value)}
              />
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

export default DataCategory;
