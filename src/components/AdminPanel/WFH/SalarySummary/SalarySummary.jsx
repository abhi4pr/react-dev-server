import React, { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import {baseUrl} from '../../../../utils/config'

const SalarySummary = () => {
  const [allSalaryData, setAllSalaryData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");

  const [userCount, setUserCount] = useState([]);
  const [handleOpenUser, setHandleOpenUser] = useState(false);

  const handleOpenSubCat = () => {
    setHandleOpenUser(true);
  };
  const handleCloseSubCat = () => {
    setHandleOpenUser(false);
  };

  const handleUserModal = async (row) => {
    try {
      const response = await axios.post(
        `${baseUrl}`+`get_users_count_by_dept`,
        {
          dept_id: row.dept_id,
          month: row.month,
          year: row.year,
        }
      );
      console.log(response.data.data);

      setUserCount(response.data.data);
      handleOpenSubCat();
    } catch (error) {
      console.log(error, "sub cat api not working");
    }
  };

  const getData = async () => {
    const response = await axios.get(
      baseUrl+"get_salary_calculation_data"
    );
    setAllSalaryData(response.data.data);
    setSavedData(response.data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    const searchYear = parseInt(search, 10); // Convert search string to a number for year comparison

    const result = savedData.filter((d) => {
      const matchesUserName = d.user_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesDeptName = d.dept_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesDesiName = d.desi_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesMonth = d.month?.toLowerCase().includes(lowerCaseSearch);
      const matchesYear = d.year === searchYear;

      return (
        matchesUserName ||
        matchesDeptName ||
        matchesDesiName ||
        matchesMonth ||
        (!isNaN(searchYear) && matchesYear)
      );
    });

    setAllSalaryData(result);
  }, [search, savedData]); // Dependencies

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Department Name",
      cell: (row) => row.dept_name,
    },
    {
      name: "Month",
      cell: (row) => row.month,
    },
    // {
    //   name: "User Count",
    //   cell: (row) => row.totalUsers,
    // },
    {
      name: "User Count",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleUserModal(row)}
        >
          {row.totalUsers}
        </button>
      ),
      sortable: true,
    },
    // {
    //   name: "DOJ",
    //   cell: (row) => {
    //     const date = new Date(row.joining_date);
    //     const dd = String(date.getDate()).padStart(2, "0");
    //     const mm = String(date.getMonth() + 1).padStart(2, "0");
    //     const yy = String(date.getFullYear()).slice(2);
    //     return `${dd}/${mm}/${yy}`;
    //   },
    // },

    {
      name: "Total Salary",
      cell: (row) => row.totalSalary + " ₹",
    },
    // {
    //   name: "Total Salary Disbused",
    //   cell: (row) => row.noOfabsent,
    // },

    {
      name: "Pending Amount",
      cell: (row) => row.pendingAmount + " ₹",
    },
  ];

  const SubCatColumns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
    },
    {
      name: "User Name",
      width: "50%",
      selector: (row) => row.user_name,
    },
  ];

  return (
    <>
      <div>
        <FormContainer mainTitle="Salary Summary" link={"/admin/"} />
        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Total Salary Summary"
              columns={columns}
              data={allSalaryData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search Here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
        <Modal
          isOpen={handleOpenUser}
          onRequestClose={handleCloseSubCat}
          contentLabel="Example Modal"
          appElement={document.getElementById("root")}
          style={{
            content: {
              width: "60%",
              height: "50%",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <DataTable
            columns={SubCatColumns}
            data={userCount}
            highlightOnHover
            subHeader
            // subHeaderComponent={
            //   <input
            //     type="text"
            //     placeholder="Search..."
            //     className="w-50 form-control"
            //     value={modalSearch}
            //     onChange={(e) => setModalSearch(e.target.value)}
            //   />
            // }
          />
        </Modal>
      </div>
    </>
  );
};

export default SalarySummary;
