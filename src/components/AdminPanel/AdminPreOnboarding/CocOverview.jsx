import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../AdminPanel/DeleteButton";

import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const CocOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  async function getData() {
    await axios
      .get(baseUrl+"get_all_cocs")
      .then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.heading.toLowerCase().match(search.toLowerCase());
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
      name: "Display sequence",
      selector: (row) => row.display_sequence,
      sortable: true,
    },
    {
      name: "Heading",
      selector: (row) => row.heading,
      sortable: true,
    },
    {
      name: "Sub heading",
      selector: (row) => row.sub_heading,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/pre-onboard-coc-update/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
              type="button"
            >
              <FaEdit />{" "}
            </button>
          </Link>

          <Link to={`/admin/pre-onboard-coc-history/${row._id}`}>
            <button
              title="Coc History"
              className="btn btn-outline-success btn-sml"
              type="button"
            >
              {"H"}
            </button>
          </Link>

          <DeleteButton endpoint="delete_coc" id={row._id} getData={getData} />
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="COC"
        title="Coc Creation"
        // handleSubmit={handleSubmit}
      >
        <div className="page_height">
          <div className="card mb-4">
            <div className="data_tbl table-responsive">
              <DataTable
                title="Pre Onboard User"
                columns={columns}
                data={filterdata}
                fixedHeader
                // pagination
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
      </FormContainer>
    </>
  );
};

export default CocOverview;
