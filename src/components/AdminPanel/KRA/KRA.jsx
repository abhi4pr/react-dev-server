import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import { useParams } from "react-router-dom";

const KRA = () => {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [responsbility, setResponsibility] = useState([]);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  function responsibilityAPI() {
    axios
      .post(`http://34.93.221.166:3000/api/get_user_job_responsibility`, {
        user_id: Number(id),
      })
      .then((res) => {
        setResponsibility(res.data.data);
        setFilterData(res.data.data);
        console.log(res.data.data, "responsibility");
      });
  }
  useEffect(() => {
    responsibilityAPI();
  }, []);

  useEffect(() => {
    const result = responsbility.filter((d) => {
      return d.sjob_responsibility.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "Responsibility",
      width: "25%",
      selector: (row) => row.sjob_responsibility,
      sortable: true,
    },

    {
      name: "Description",
      selector: (row) => row.description,
    },
  ];

  return (
    <>
      <FormContainer mainTitle="KRA" link="/admin/department-master" />

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="KRA Overview"
            columns={columns}
            data={filterData}
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
    </>
  );
};

export default KRA;
