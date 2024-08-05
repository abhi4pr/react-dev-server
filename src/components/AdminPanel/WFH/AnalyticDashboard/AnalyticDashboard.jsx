import React, { useEffect, useState } from "react";
import WFHDUsersGrapf from "./WFHDUsersGraph";
import UserCountInCards from "./UserCountInCards";
import SalaryDetailsInLineChart from "./SalaryDetailsInLineChart";
import BirthdayAndWorkAniCard from "./BirthdayAndWorkAniCard";
import NewJoineeAndExitUsers from "./NewJoineeAndExitUsers";
import UserCountWithLPA from "./UserCountWithLPA";
import AgeGraf from "./AgeGraf";
import YearWiseGraph from "./YearWiseGraph";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";

const AnalyticDashboard = () => {

  const [OpenBonus , setHandleOpenExitEmp] = useState(false)
  const [allExitUserData , setExitUserData] = useState([])
  const handleOpenExitUser = () =>{
    setHandleOpenExitEmp(true)
  }
  const handleCloseExitUser = () =>{
    setHandleOpenExitEmp(false)
  }
  const allExitUserDatas = () =>{
    axios.get(baseUrl+`get_all_history_data`).then((res)=>{
     setExitUserData(res.data.data)
    })
 }

 useEffect(()=>{
 allExitUserDatas()
 },[])

 const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
    // MODAL 
    const ExitUserColumns = [
      {
        field: "S.NO",
        headerName: "S.NO",
        width: 120,
        renderCell: (params) => {
          const rowIndex = allExitUserData.indexOf(params.row);
          return <div>{rowIndex + 1}</div>;
        },
      },  
      {
        field: "user_name",
        headerName: "User Name",
        width: 150,
      },
      {
        field: "department_name",
        headerName: "Department Name",
        width: 150,
      },
      {
        field: "designation_name",
        headerName: "Designation Name",
        width: 180,
      },
      {
        field:"user_email_id",
        headerName: "Email",
        width: 180,
      },
      {
        field:"job_type",
        headerName: "Job Type",
        width: 100,
      },
      {
        field: "DOB",
        headerName: "DOB",
        width: 150,
        valueGetter: (params) => {
          return formatDate(params.value);
        },
      },
      {
        field:"salary",
        headerName: "Salary",
        width: 120,
      },
      
    ]
  return (
    <>
      <div className="d-flex" style={{ justifyContent: "space-between" }}>
        <div>
          <h3 className="bold">WFHD Dashboard</h3>
        </div>
        <div className="">
          <Link to="/admin/wfhd-register">
            <button type="button" className="btn btn-outline-primary btn-sm mr-2">
              Add Buddy
            </button>
          </Link>
          <Link to="/admin/wfhd-overview">
            <button type="button" className="btn btn-outline-primary btn-sm">
              My Team
            </button>
          </Link>
          <Link to="/admin/attendence-mast">
            <button type="button" className="btn btn-outline-primary btn-sm ml-2">
            Create Attendance
            </button>
          </Link>
          <Link to="/admin/salaryWFH">
            <button type="button" className="btn btn-outline-success btn-sm ml-2">
              Payout Summary
            </button>
          </Link>
          <button onClick={handleOpenExitUser} type="button" className="btn btn-outline-danger btn-sm ml-2">
              History
            </button>
        </div>
      </div>
      <UserCountInCards />
      <BirthdayAndWorkAniCard />
      <NewJoineeAndExitUsers />
      <div className="row">
        <div className="col-6">
          <h5 className="mb-2 card-title">Department Wise Users Count</h5>
          <WFHDUsersGrapf />
        </div>
        <div className="col-5 ml-5">
          <h5 className="mb-2 card-title">Users Count With LPA</h5>
          <UserCountWithLPA />
        </div>

        <div className="col-12 mr-5">
          <h5 className="mb-2 card-title">Department & Month Wise Salary</h5>
          <SalaryDetailsInLineChart />
        </div>
        <div className="col-12">
          <h5 className="mb-2 card-title">Month Wise Joinee Users</h5>
          <YearWiseGraph />
        </div>
        <div className="col-4 mr-2">
          <h5 className="mb-2 card-title">Age Wise Users Graph</h5>
          <AgeGraf />
        </div>
      </div>



      {/* History MOdal  */}
      <Modal
          isOpen={OpenBonus}
          onRequestClose={handleCloseExitUser}
          contentLabel="Example Modal"
          appElement={document.getElementById("root")}
          style={{
            content: {
              width: "60%",
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
          <button
            className="btn btn-danger mb-3 float-right"
            onClick={handleCloseExitUser}
          >
            x
          </button>

          {/* All Exit User List  */}
          <DataGrid
          rows={allExitUserData}
          columns={ExitUserColumns}
          getRowId={(row)=>row?.user_id}
          slots={{
            toolbar: GridToolbar
          }}
          />
        </Modal>
      
    </>
  );
};

export default AnalyticDashboard;