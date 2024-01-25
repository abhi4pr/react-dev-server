import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import millify from "millify";
import * as XLSX from 'xlsx';

const SummaryDetails = ({ payload }) => {
  const [summaryData, setSummaryData] = useState({
    total: 0,
    totalPost: 0,
    lent: 0,
    totalStory: 0,
  });
  const [catNameLengths, setCatNameLengths] = useState({});
  const [totalFollowerCount, setTotalFollowerCount] = useState(0);
  const [totalPostPerPage, setTotalPostPerPage] = useState(0);
  const [totalStoryPerPage, setStoryPerPage] = useState(0);
  const [filteredData, setFilteredData] = useState(payload);

  useEffect(() => {
    const updatedCatNameLengths = {};
    payload.forEach((entry) => {
      const catName = entry.cat_name;
      updatedCatNameLengths[catName] = (updatedCatNameLengths[catName] || 0) + 1;
    });
    setCatNameLengths(updatedCatNameLengths);

    const totalCount = payload.reduce(
      (sum, current) => sum + Number(current.follower_count),
      0
    );
    const total = millify(totalCount);
    const totalPost = payload.reduce(
      (sum, current) => sum + Number(current.postPerPage),
      0
    );
    const totalStory = payload.reduce(
      (sum, current) => sum + Number(current.storyPerPage),
      0
    );
    const lent = payload.length;

    setSummaryData({ total, totalPost, lent, totalStory });
  }, [payload]);

  const handleSelectedRowData = (catName) => {
    const filteredRows = payload.filter((e) => e.cat_name === catName);
    setFilteredData(filteredRows);

    const totalFollowers = filteredRows.reduce(
      (sum, current) => sum + Number(current.follower_count),
      0
    );
    const totalPosts = filteredRows.reduce(
      (sum, current) => sum + Number(current.postPerPage),
      0
    );
    const totalStory = filteredRows.reduce(
      (sum, current) => sum + Number(current.storyPerPage),
      0
    );

    setTotalFollowerCount(millify(totalFollowers));
    setTotalPostPerPage(millify(totalPosts));
    setStoryPerPage(millify(totalStory));
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = filteredData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
   
    {
      field: "page_name",
      headerName: "Pages",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
      editable: true,
    },
    {
      field: "postPerPage",
      headerName: "Post / Page",
      width: 150,
      editable: true,
    },
    {
      field: "storyPerPage",
      headerName: "Story / Page",
      width: 150,
      editable: true,
    },
  ];

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    const overviewData = [
      ['Proposal'], 
      ['Sno.', 'Description', 'Platform', 'Count', 'Deliverables', 'Cost'], // Headers
      [1, 'Pages', 'Instagram', summaryData.totalPost, '', ''], // Data for Pages
      [2, 'Followers', '', summaryData.total, '', ''], // Data for Followers
      [3, 'Story per Page', '', summaryData.totalStory, '', ''], // Data for Story per Page
      ['', '', '', '', 'Total', summaryData.lent] 
    ];
  
    const overviewWorksheet = XLSX.utils.aoa_to_sheet(overviewData);
  
  
    const titleCellRef = XLSX.utils.encode_cell({ r: 0, c: 0 });
    overviewWorksheet[titleCellRef].s = {
      font: { sz: 18, bold: true },
      alignment: { horizontal: 'center' },
      fill: { fgColor: { rgb: '000000' } }
    };
    XLSX.utils.book_append_sheet(workbook, overviewWorksheet, "Overview");
      Object.keys(catNameLengths).forEach(catName => {
      const catData = payload
        .filter(item => item.cat_name === catName)
        .map((item,index) => ({
          "sno":index+1,
          "Page": item.page_name,
          "Link": item.page_link,
          "Followers": item.follower_count,
          "Post per Page": item.postPerPage,
          "Story per Page": item.storyPerPage
        }));
      const catWorksheet = XLSX.utils.json_to_sheet(catData);
      XLSX.utils.book_append_sheet(workbook, catWorksheet, catName);
    });
      XLSX.writeFile(workbook, "SummaryDetails.xlsx");
  };
  
  

  return (
    <>
    
      {payload?.length > 0 && (
        <Box sx={{ height: 500, width: "35%" }}>
          <Paper elevation={12} sx={{ mb: 4, height: "150px", width: "100%" }}>
            <Typography
              sx={{ textAlign: "center", fontSize: "20px", mb: 2 }}
              color="secondary"
            >
              Summary
            </Typography>
            <Box sx={{ m:2 }}>
            <Button onClick={downloadExcel} variant="contained" color="primary">
               Excel
            </Button>
          </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", gap: 1,mt:2 }}
            >
              <Typography variant="6"> Pages: {summaryData.lent}</Typography>
              <Typography variant="6">
                Followers: {summaryData.total}
              </Typography>
              <Typography variant="6">
                Posts: {summaryData.totalPost}
              </Typography>
              <Typography variant="6">
                Story: {summaryData.totalStory}
              </Typography>
            </Box>
          </Paper>

          <Box>
            <div className="summaryDetailingwebkit">
              <ul
                style={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  marginBottom: "20px",
                }}
              >
                {Object.entries(catNameLengths).map(([catName, count]) => (
                  <Box key={catName} sx={{ ml: 2 }}>
                    <Button
                      onClick={() => handleSelectedRowData(catName)}
                      variant="outlined"
                      color="secondary"
                    >
                      {catName} : {count}
                    </Button>
                  </Box>
                ))}
              </ul>
            </div>
          </Box>

          <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
            <Typography>Total Followers: {totalFollowerCount}</Typography>
            <Typography>Total Posts: {totalPostPerPage}</Typography>
            <Typography>Total Stories: {totalStoryPerPage}</Typography>
          </Box>
          <DataGrid
            rows={filteredData ||payload}
            columns={columns}
            getRowId={(row) => row.p_id}
            pageSizeOptions={[5]}
          />

         
        </Box>
      )}
    </>
  );
};

export default SummaryDetails;
