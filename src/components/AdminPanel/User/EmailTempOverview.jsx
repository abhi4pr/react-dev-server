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

const EmailTempOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  async function getData() {
    await axios
      .get(baseUrl+"get_all_email_contents")
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
      return d.email_for.toLowerCase().match(search.toLowerCase());
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
      name: "Email Title",
      selector: (row) => row.email_for,
      sortable: true,
    },
    {
      name: "Email Content",
      selector: (row) => row.email_content,
      sortable: true,
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/admin/email-template-update/${row._id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />{" "}
            </button>
          </Link>

          <DeleteButton
            endpoint="delete_email_content"
            id={row._id}
            getData={getData}
          />
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Email Template Overview"
        title=""
        submitButton={false}
      >
        <button
          type="button"
          className="btn btn-success"
          style={{
            float: "right",
            margin: "-4% 0% 2% 89%",
            position: "relative",
            width: "10%",
            height: "10%",
          }}
        >
          <Link to="/admin/email-template">Add Email Template</Link>
        </button>

        <div className="page_height">
          <div className="card mb-4">
            <div className="data_tbl table-responsive">
              <DataTable
                title="Email Temp Overview"
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

export default EmailTempOverview;
