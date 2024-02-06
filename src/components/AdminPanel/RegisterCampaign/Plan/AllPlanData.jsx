import { Paper, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";
import exportToCSV from "../../../../utils/ExcelConverter";


const AllPlanData = () => {
  const navigate = useNavigate();
  const [allPlan, setAllPlan] = useState([]);
  const [excelData, setExcelData] = useState([]);

  const getData = async () => {
    const res = await axios.get(`http://192.168.1.11:3000/api/directplan`);
    setAllPlan(res?.data?.result);
    const createExcelData = res?.data?.result?.pages;
    console.log(createExcelData, "data");
  };

  useEffect(() => {
    getData();
  }, []);
  const goAllPlanOverview = (params) => {
    navigate(`/admin/all-planoverview/${params.row._id}`);
  };

  const excelDownload = (params) => {
    setExcelData(params?.row?.pages);
    exportToCSV(params?.row?.pages)
  };
  const col = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 120,
      renderCell: (params) => {
        const rowIndex = allPlan.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "planName",
      headerName: "Plan",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={() => goAllPlanOverview(params)}
          >
            Plan Overview
          </Button>
        </>
      ),
    },
    {
      field: "Excel",
      headerName: "Excel",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            color="success"
            title="Download Excel"
            sx={{ fontSize: "25px" }}
            onClick={() => excelDownload(params)}
          >
            <SiMicrosoftexcel />
          </Button>
        </>
      ),
    },
  ];
  return (
    <>
      <Paper>
        <div className="form-heading">
          <div className="form_heading_title">
            <h2> All Plan</h2>
          </div>
        </div>
      </Paper>

      <DataGrid rows={allPlan} columns={col} getRowId={(row) => row?._id} />
    </>
  );
};
export default AllPlanData;
