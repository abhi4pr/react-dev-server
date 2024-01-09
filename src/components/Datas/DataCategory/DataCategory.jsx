import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";

import FieldContainer from "../../AdminPanel/FieldContainer";
import FormContainer from "../../AdminPanel/FormContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../../../Context/Context";
import Modal from "react-modal";

const DataCategory = () => {
  const { toastAlert, toastError } = useGlobalContext();

  const [handleOpenSubCat, setHandleOpenSubCat] = useState(false);
  const [subcategoryCount, setSubcategroycount] = useState([]);

  const [modalData, setModalData] = useState([]);
  const [modalFilter, setModalFilter] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameUpdate, setCategoryNameUpdate] = useState("");
  const [search, setSearch] = useState("");

  const [modalId, setModalId] = useState(0);

  const handleSubCategroy = async (row) => {
    try {
      const response = await axios.get(
        `http://34.93.221.166:3000/api/get_data_sub_category_from_categoryid/${row}`
      );
      console.log(response, "responsne ere");
      setSubcategroycount(response.data.data.sub_categories);
      setHandleOpenSubCat(true);
    } catch (error) {
      console.log(error, "sub cat api not working");
    }
  };

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
      name: "Sub Category",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleSubCategroy(row._id)}
        >
          {row.sub_category_count}
        </button>
      ),
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
            endpoint="delete_data_category"
            id={row._id}
            getData={getModalData}
          />
        </>
      ),
    },
  ];
  const handleCloseSubCat = () => {
    setHandleOpenSubCat(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isModalExists = modalData.some(
        (d) => d.category_name === categoryName
      );
      if (isModalExists) {
        alert("Category already Exists");
      } else {
        const response = await axios.post(
          "http://34.93.221.166:3000/api/add_data_category",
          {
            category_name: categoryName,
          }
        );
        toastAlert("Successfully Add");
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
    setModalData(res.data.simcWithSubCategoryCount);
    setModalFilter(res.data.simcWithSubCategoryCount);
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
        toastAlert("Successfully Update");
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

      <Modal
        isOpen={handleOpenSubCat}
        onRequestClose={handleCloseSubCat}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {/* {selectedRow && ( */}
        <div>
          <div className="d-flex justify-content-between mb-2">
            {/* <h2>Department: {selectedRow.dept_name}</h2> */}

            <button
              className="btn btn-success float-left"
              onClick={handleCloseSubCat}
            >
              X
            </button>
          </div>
          <h1></h1>
          <DataTable
            columns={[
              {
                name: "S.No",
                cell: (row, index) => <div>{index + 1}</div>,
                width: "10%",
              },
              {
                name: "Subcategory Name",
                width: "40%",
                selector: "data_sub_cat_name",
              },
            ]}
            data={subcategoryCount}
            highlightOnHover
            subHeader
          />
        </div>
        {/* )} */}
      </Modal>
    </div>
  );
};

export default DataCategory;
