import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const UserAuthDetail = () => {
  const { toastAlert } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  function getData() {
    axios
      .get(`${baseUrl}`+`get_single_user_auth_detail/${id}`)
      .then((res) => {
        setData(res.data);
        setFilterData(res.data);
      });
  }
  useEffect(() => {
    const result = data.filter((d) => {
      return d.obj_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);
  const handleCheckboxChange = (event, row, property) => {
    const { checked } = event.target;
    setFilterData((prevData) =>
      prevData.map((item) => {
        if (item.obj_id === row.obj_id) {
          return {
            ...item,
            [property]: checked ? 1 : 0,
          };
        }
        return item;
      })
    );
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Object Name",
      width: "17%",
      selector: (row) => row.obj_name,
    },
    {
      name: "Insert",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={(event) => handleCheckboxChange(event, row, "insert_value")}
          checked={row.insert_value === 1}
        />
      ),
    },
    {
      name: "View",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={(event) => handleCheckboxChange(event, row, "view_value")}
          checked={row.view_value === 1}
        />
      ),
    },
    {
      name: "Update",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={(event) => handleCheckboxChange(event, row, "update_value")}
          checked={row.update_value === 1}
        />
      ),
    },
    {
      name: "Delete Flag",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={(event) =>
            handleCheckboxChange(event, row, "delete_flag_value")
          }
          checked={row.delete_flag_value === 1}
        />
      ),
    },
  ];
  function postData() {
    for (const element of filterData) {
      axios.put(baseUrl+"update_user_auth", {
        auth_id: element.auth_id,
        Juser_id: Number(id),
        obj_id: element.obj_id,
        insert: element.insert_value,
        view: element.view_value,
        update: element.update_value,
        delete_flag: element.delete_flag_value,
        Last_updated_by: userId,
      });
    }
    setIsSubmitted(true);
    toastAlert("Updated Successfully");
  }

  if (isSubmitted) {
    return <Navigate to="/admin/user-overview" />;
  }
  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>User Auth Detail</h2>
        </div>
        <div className="form_heading_action d-flex gap-2">
          <button onClick={postData} className="btn btn-primary">
            Post
          </button>
        </div>
      </div>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="user-auth-detail"
            columns={columns}
            data={filterData}
            fixedHeader
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
export default UserAuthDetail;
