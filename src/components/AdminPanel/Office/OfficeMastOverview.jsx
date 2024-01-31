import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import FormContainer from "../FormContainer";
import DeleteButton from "../DeleteButton";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const OfficeMastOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);

  async function getData() {
    try {
      const res = await axios.get(
        baseUrl+"get_all_rooms"
      );

      setData(res.data.data);
      setFilterData(res.data.data);
    } catch (error) {
      console.error("An error occurred while fetching data", error);
    }
  }

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Sitting_Ref No",
      selector: (row) => row.sitting_ref_no,
      width: "20%",
      sortable: true,
    },
    {
      name: "Room Image",
      selector: (row) => (
        <img
          style={{ height: "80px" }}
          src={row.room_image_url}
          alt="Room Image"
        />
      ),
      width: "20%",
      sortable: true,
    },
    {
      name: "remark",
      selector: (row) => row.remarks,
    },
    {
      name: "Action",
      width: "15%",
      cell: (row) => (
        <>
          {contextData &&
            contextData[6] &&
            contextData[6].update_value === 1 && (
              <Link to="/admin/office-mast-update">
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sml"
                  onClick={() =>
                    setToLocalStorage(
                      row.room_id,
                      row.sitting_ref_no,
                      row.remarks,
                      row.created_by_name
                    )
                  }
                >
                  <FaEdit />{" "}
                </button>
              </Link>
            )}
          {contextData &&
            contextData[6] &&
            contextData[6].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="delete_room"
                id={row.room_id}
                getData={getData}
              />
            )}
        </>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.sitting_ref_no.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const setToLocalStorage = (
    room_id,
    sitting_ref_no,
    remarks,
    created_by_name
  ) => {
    localStorage.setItem("room_id", room_id);
    localStorage.setItem("sitting_ref_no", sitting_ref_no);
    localStorage.setItem("remarks", remarks);
    localStorage.setItem("created_by_name", created_by_name);
  };

  return (
    <>
      <FormContainer
        mainTitle="Office"
        link="/admin/office-mast"
        buttonAccess={
          contextData && contextData[6] && contextData[6].insert_value === 1
        }
      />

      <button
        type="button"
        className="btn btn-primary"
        style={{
          float: "right",
          margin: "-70px 75px 0 0",
          position: "relative",
        }}
      >
        <Link to="/admin/sitting-overview">Sittings</Link>
      </button>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Office Overview"
            columns={columns}
            data={filterdata}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="62vh"
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

export default OfficeMastOverview;
