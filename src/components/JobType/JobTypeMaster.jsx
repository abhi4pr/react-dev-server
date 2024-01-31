import React from "react";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import UserNav from "../Pantry/UserPanel/UserNav";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import DeleteButton from "../AdminPanel/DeleteButton";
import { baseUrl } from "../../utils/config";

const JobTypeMaster = () => {
  const [jobTypeName, setJobTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [jobTypeData, setJobTypeData] = useState([]);
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [search, setSearch] = useState("");

  const [jobTypeID, setJobTypeID] = useState(0);
  const [jobTypeNameUpdate, setJobTypeNameUpdate] = useState("");
  const [jobTypeDescriptionUpdate, setJobTypeDescriptionUpdate] = useState("");

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.job_type_description,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) =>
        row.created_at.split("T")[0].split("-").reverse().join("-"),
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
            onClick={() => handleJobTypeData(row)}
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="delete_job_type"
            id={row._id}
            getData={getJobTypeData}
          />
        </>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isBrandExist = jobTypeData.some(
        (d) => d.asset_brand_name === jobTypeName
      );
      if (isBrandExist) {
        alert("Brand already Exists");
      } else {
        const response = await axios.post(
          baseUrl+"add_job_type",
          {
            job_type: jobTypeName,
            job_type_description: description,
          }
        );
        setJobTypeName("");
        setDescription("");
        getJobTypeData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getJobTypeData() {
    const res = await axios.get(
      baseUrl+"get_all_job_types"
    );
    setJobTypeData(res.data.data);
    setJobTypeFilter(res.data.data);
  }

  useEffect(() => {
    getJobTypeData();
  }, []);

  const handleJobTypeData = (row) => {
    setJobTypeID(row._id);
    setJobTypeNameUpdate(row.job_type);
    setJobTypeDescriptionUpdate(row.job_type_description);
  };

  const handleJobTypeUpdate = () => {
    axios
      .put(baseUrl+"update_job_type", {
        _id: jobTypeID,
        job_type: jobTypeNameUpdate,
        job_type_description: jobTypeDescriptionUpdate,
      })
      .then((res) => {
        setJobTypeID("");
        setJobTypeNameUpdate("");
        setJobTypeDescriptionUpdate("");
        getJobTypeData();
      });
  };

  useEffect(() => {
    const result = jobTypeData.filter((d) => {
      return d.job_type.toLowerCase().match(search.toLocaleLowerCase());
    });
    setJobTypeFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Job Type"
          title="Add Job"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Job Type"
            value={jobTypeName}
            onChange={(e) => setJobTypeName(e.target.value)}
          />
          <FieldContainer
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Brand Overview"
              columns={columns}
              data={jobTypeFilter}
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
                Job Update
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
                label="Job Type Name"
                fieldGrid={12}
                value={jobTypeNameUpdate}
                onChange={(e) => setJobTypeNameUpdate(e.target.value)}
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
                onClick={handleJobTypeUpdate}
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

export default JobTypeMaster;
