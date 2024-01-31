import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import DeleteButton from "../DeleteButton";
import FormContainer from "../FormContainer";
import Modal from "react-modal";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { baseUrl } from "../../../utils/config";

export default function SubDepartmentOverview() {
  const { contextData } = useAPIGlobalContext();
  const [modalSearch, setModalSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [allUserSubDepartment, setAllUserSubDepartment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState([]);
  const [filterSubDepartmentData, setFilterSubDepartmentData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [subDepartmentData, setSubDeparmentData] = useState([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function getData() {
    axios
      .get(baseUrl+"get_all_sub_departments")
      .then((res) => {
        setData(res.data);
        setFilterData(res.data);
      });
  }
  function getSubDepartmentData(dept_id) {
    axios
      .get(`${baseUrl}`+`get_subdept_from_dept"/${dept_id}`)
      .then((res) => {
        setSubDeparmentData(res.data);
      });
  }

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentData(res.data);
      });
    getData();
  }, []);

  // useEffect(() => {
  //   const result = datas.filter((d) => {
  //     return d.dept_name.toLowerCase().match(search.toLowerCase());
  //   });
  //   setFilterData(result);
  // }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Sub-Department Name",
      width: "25%",
      selector: (row) => row.sub_dept_name,
      sortable: true,
    },
    {
      name: "Department Name",
      width: "12%",
      cell: (row) => row.dept_name,
      sortable: true,
    },
    {
      name: "Remark",
      selector: (row) => row.remark,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[3] &&
            contextData[3].update_value === 1 && (
              <Link to={`/admin/sub-department-update/${row.id}`}>
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                >
                  <FaEdit />{" "}
                </button>
              </Link>
            )}
          {contextData &&
            contextData[3] &&
            contextData[3].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="delete_sub_department"
                id={row.id}
                getData={getData}
              />
            )}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Sub-Department"
        link="/admin/sub-department-master"
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
            title="Sub-Department Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
          />
          {/* <FieldContainer
            label="Deparment Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          /> */}
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
            <h2>Sub-Department: {selectedRow.dept_name}</h2>

            <DataTable
              columns={[
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
            <button className="btn btn-success" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
