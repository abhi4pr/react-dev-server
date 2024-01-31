import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReplacePagesModal from "./ReplacePagesModal";
import ReplacementRecord from "./ReplacementRecord";
import millify from "millify";
import exportToCSV from "../../../utils/ExcelConverter";
import generatePdf from "../../../utils/PdfConverter";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { SiMicrosoftexcel } from "react-icons/si";


const PageOverview = ({ selectData, setrender, stage, id }) => {
  console.log(selectData);
  const naviagte = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [selection, setSelections] = useState();
  const [realData, setRealData] = useState([]);

  useEffect(() => {
    const data = selectData.filter((page) => {
      if (
        page.replacement_status == "pending" ||
        page.replacement_status == "replacement" ||
        page.replacement_status == "inactive" 
       
      ) {
        return page;
      }
    });


    setRealData(data);
  }, [selectData]);

  console.log(realData)

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = selectData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },

    {
      field: "cat_name",
      headerName: "Category Name",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower Count",
      width: 150,
      valueFormatter: (params) => millify(params.value),
    },
    {
      field: "postPerPage",
      headerName: "post",
      width: 150,
    },
    {
      field: "storyPerPage",
      headerName: "Story",
      width: 150,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      editable: true,
      renderCell: () => {
        return (
          <Button>
            <DeleteIcon />
          </Button>
        );
      },
    },
    {
      field: "replace",
      headerName: "Replace Pages",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return (
          params.row.replacement_status == "inactive" && (
            <Button onClick={() => handleOpenModal(params.row)}>
              <PublishedWithChangesIcon />
            </Button>
          )
        );
      },
    },
    {
      field: "replacerecord",
      headerName: "Replace Pages",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return params.row.replacement_id ? (
          <Button onClick={() => handleOpenModalRecord(params.row)}>
            <PublishedWithChangesIcon />
          </Button>
        ) : (
          "N/A"
        );
      },
    },
  ];

  const handleOpenModal = (row) => {
    setSelections(row);
    setIsModalOpen(true);
  };
  const handleOpenModalRecord = (row) => {
    setSelections(row);
    setIsRecordOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setrender();
  };
  const handleCloseModalRecord = () => {
    setIsRecordOpen(false);
  };
  const handleExportClick = () => {
    exportToCSV(realData, "page_data");
  };

  const handleDownloadPdf = () => {
    generatePdf(realData);
  };
  const handlePlanDashboard = () => {
    naviagte(`/admin/plan-dashboard/${id}`);
  };

  return (
    <div>
      <Paper>
        <Box sx={{ height: 400, width: "100%", mt: 2 }}>
          <Paper sx={{display:"flex",mb:2,justifyContent:"flex-end"}}>
            <Button
              onClick={handleExportClick}
              variant="text"
              color="success"
              sx={{fontSize:"30px"}}
              title="Download Excel"

            >
             <SiMicrosoftexcel />
            </Button>
            <Button
              onClick={handleDownloadPdf}
              variant="text"
              color="error"
              title="Download Pdf"
              sx={{mr:3}}
            >
              <PictureAsPdfIcon sx={{fontSize:"40px"}} />
            </Button>
            <Button
              onClick={handlePlanDashboard}
              variant="outlined"
              color="secondary"
              sx={{mr:3}}

            >
               Plan Dashboard
            </Button>
          </Paper>

          <DataGrid
            rows={realData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row.p_id}
            tooo
            getRowClassName={(params) => {
              return params.row.replacement_status == "pending"
                ? "unavailable"
                : "available";
            }}
            sx={{
              ml: 2,
              ".unavailable": {
                bgcolor: " #FF4433",
                "&:hover": {
                  bgcolor: "#E30B5C",
                },
              },
            }}
          />
          <ReplacePagesModal
            open={isModalOpen}
            selection={selection}
            handleClose={handleCloseModal}
            planData={selectData}
            stage={stage}
          />
          <ReplacementRecord
            open={isRecordOpen}
            handleClose={handleCloseModalRecord}
            data={selection}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default PageOverview;
