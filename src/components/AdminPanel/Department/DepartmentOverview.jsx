import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import DeleteButton from "../DeleteButton";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";

const DepartmentOverview = () => {
  const [search, setSearch] = useState("");
  const [modalSearch, setModalSearch] = useState("");

  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [allUserDepartment, setAllUserDepartment] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState([]);

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
    axios.get(baseUrl+"get_all_users").then((res) => {
      setAllUserDepartment(res.data.data);
    });
  }, [userID]);

  function getData() {
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setData(res.data);
        setFilterData(res.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.dept_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Department Name",
      width: "25%",
      selector: (row) => row.dept_name,
      sortable: true,
    },
    {
      name: "Dept Count",
      width: "12%",
      cell: (row) => {
        const count = allUserDepartment.filter(
          (data) => data.department_name === row.dept_name
        ).length;
        return (
          <button
            className="btn btn-outline-warning btn-sm user-button"
            onClick={() => handleRowClick(row)}
          >
            {count}
          </button>
        );
      },
      sortable: true,
    },
    {
      name: "Remark",
      selector: (row) => row.Remarks,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[3] &&
            contextData[3].update_value === 1 && (
              <Link to="/admin/department-update">
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                  onClick={() =>
                    setToLocalStorage(
                      row.dept_id,
                      row.dept_name,
                      row.Remarks,
                      row.Creation_date,
                      row.created_by,
                      row.Last_updated_by,
                      row.Last_updated_date,
                      row.short_name
                    )
                  }
                >
                  <FaEdit />{" "}
                </button>
              </Link>
            )}
          {contextData &&
            contextData[3] &&
            contextData[3].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="delete_department"
                id={row.dept_id}
                getData={getData}
              />
            )}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  const setToLocalStorage = (
    dept_id,
    dept_name,
    Remarks,
    Creation_date,
    created_by,
    Last_updated_by,
    Last_updated_date,
    short_name
  ) => {
    localStorage.setItem("dept_id", dept_id);
    localStorage.setItem("dept_name", dept_name);
    localStorage.setItem("Remarks", Remarks);
    localStorage.setItem("Creation_date", Creation_date);
    localStorage.setItem("created_by", created_by);
    localStorage.setItem("Last_updated_by", Last_updated_by);
    localStorage.setItem("Last_updated_date", Last_updated_date);
    localStorage.setItem("short_name");
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);

    const filteredData = allUserDepartment.filter(
      (data) => data.department_name === row.dept_name
    );
    setSelectedUserData(filteredData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <FormContainer
        mainTitle="Department"
        link="/admin/department-master"
        buttonAccess={
          contextData &&
          contextData[3] &&
          contextData[3].insert_value === 1 &&
          "true"
        }
      />

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Department Overview"
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
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
        {selectedRow && (
          <div>
            <div className="d-flex justify-content-between mb-2">
              <h2>Department: {selectedRow.dept_name}</h2>

              <button
                className="btn btn-success float-left"
                onClick={handleCloseModal}
              >
                X
              </button>
            </div>
            <DataTable
              columns={[
                {
                  name: "S.No",
                  cell: (row, index) => <div>{index + 1}</div>,
                  width: "10%",
                },
                { name: "Name", selector: "user_name" },
                { name: "Email", selector: "user_email_id" },
                { name: "Contact", selector: "user_contact_no" },
              ]}
              data={selectedUserData.filter((user) =>
                user.user_name.toLowerCase().includes(modalSearch.toLowerCase())
              )}
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-50 form-control"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              }
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default DepartmentOverview;
