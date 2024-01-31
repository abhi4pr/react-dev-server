import axios from "axios";
import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import DeleteButton from "../DeleteButton";
import { baseUrl } from "../../../utils/config";

const HobbiesOverview = () => {
  const navigate = useNavigate();
  const [hobbiesData, setHobbiesData] = useState([]);
  const [origionalData, setOrigionalData] = useState([]);
  const [search, setSearch] = useState("");
  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl+"get_all_hobbies"
      );
      const data = response.data.data;
      setHobbiesData(data);
      setOrigionalData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = origionalData.filter((d) => {
      return d.hobby_name?.toLowerCase().includes(search.toLowerCase());
    });
    setHobbiesData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "Hobbies",
      selector: (row) => row.hobby_name,
    },
    {
      name: "Status",
      width: "4%",
      selector: (row) => (
        <div className="d-flex">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/admin/hobbies/${row.hobby_id}`)}
          >
            Edit
          </button>
          <DeleteButton
            endpoint={"delete_hobby"}
            id={row.hobby_id}
            getData={getData}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Hobbies"
            link="/admin/hobbies/0"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Hobbies Overview"
              columns={columns}
              data={hobbiesData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HobbiesOverview;
