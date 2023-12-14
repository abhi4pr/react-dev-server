import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import Modal from "react-modal";

const DesignationOverview = () => {
  const [search, setSearch] = useState("");
  const [modalSearch, setModalSearch] = useState("");

  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [allUserDesignation, setAllUserDesignation] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `http://34.93.221.166:3000/api/get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }

    axios.get("http://34.93.221.166:3000/api/get_all_users").then((res) => {
      setAllUserDesignation(res.data.data);
    });
  }, [userID]);

  async function getData() {
    await axios
      .get("http://34.93.221.166:3000/api/get_all_designations")
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
      return d.desi_name.toLowerCase().match(search.toLowerCase());
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
      name: "Designation Name",
      selector: (row) => row.desi_name,
      sortable: true,
    },
    {
      name: "Department Name",
      selector: (row) => row.department_name,
      sortable: true,
    },
    {
      name: "Emp Count",
      width: "15%",
      cell: (row) => {
        const count = allUserDesignation.filter(
          (data) => data.designation_name === row.desi_name
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
      name: "Remarks",
      selector: (row) => row.remark,
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[10] &&
            contextData[10].update_value === 1 && (
              <Link to={`/admin/designation-update/${row.desi_id}`}>
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                >
                  <FaEdit />{" "}
                </button>
              </Link>
            )}

          {contextData &&
            contextData[10] &&
            contextData[10].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="delete_designation"
                id={row.desi_id}
                getData={getData}
              />
            )}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  const handleRowClick = (row) => {
    setSelectedRow(row);

    const filteredData = allUserDesignation.filter(
      (data) => data.designation_name === row.desi_name
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
        mainTitle="Designation"
        link="/admin/designation-master"
        buttonAccess={
          contextData &&
          contextData[10] &&
          contextData[10].insert_value === 1 &&
          true
        }
      />
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Designation overview"
              columns={columns}
              data={filterdata}
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
        {/* Render the modal content with the selected row data */}
        {selectedRow && (
          <div>
            <div className="d-flex justify-content-between mb-4">
              <h5>Department: {selectedRow.department_name}</h5>
              <h5>Designaiton: {selectedRow.desi_name}</h5>
              <button className="btn btn-success " onClick={handleCloseModal}>
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
                { name: "Report L1", selector: "Report_L1" },
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
};

export default DesignationOverview;
