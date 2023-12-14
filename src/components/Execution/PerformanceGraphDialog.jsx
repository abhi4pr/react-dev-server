import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function PerformanceGraphDialog({
  setOpenPerformanceGraphDialog,
  rowData,
}) {
  const [open, setOpen] = useState(true);
  const [filterDataVal, setFilterDataVal] = useState("Current Month");

  const handleClose = () => {
    setOpenPerformanceGraphDialog(false);
  };

  useEffect(() => {
    console.log(rowData);
    console.log(rowData.maxEngagement);
  }, []);

  const GraphAutoCompSelectdata = [
    "Current Month",
    "Last six months",
    "Last one year",
  ];
 
  return (
    <React.Fragment>

      <Dialog open={open} onClose={handleClose}  maxWidth={'xl'} >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={GraphAutoCompSelectdata}
            sx={{ width: 250 }}
            className="mt-2"
            value={filterDataVal}
            onChange={(event, newValue) => {
              if (newValue === null) {
                return setFilterDataVal("Current Month");
              }
              setFilterDataVal(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Choose Option" />
            )}
          />
          <Paper>
            <h6 className="fs-5 mx-2 pt-3">Highest</h6>
            <LineChart
              xAxis={[
                filterDataVal === "Current Month"
                  ? { data: [1] }
                  : filterDataVal === "Last six months"
                  ? { data: [1, 2, 3, 4, 5, 6] }
                  : filterDataVal === "Last one year"
                  ? { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
                  : null,
              ]}
              series={[
                {
                  label: "Engagement",
                  data:
                    filterDataVal === "Current Month"
                      ? [rowData?.maxEngagement] // Assuming rowData?.maxEngagement is a number
                      : filterDataVal === "Last six months"
                      ? [583, 4854, 7885, 444, 455, 8624] // Array for last six months
                      : filterDataVal === "Last one year"
                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // Array for last one year
                      : null, // Default case
                  // data: [rowData?.maxEngagement],
                },
                {
                  label: "Impression",
                  data:
                    filterDataVal === "Current Month"
                      ? [rowData?.maxImpression] // Assuming rowData?.maxImpression is a number for "Current Month"
                      : filterDataVal === "Last six months"
                      ? [47526, 12547, 2562, 4789, 3657, 85478] // Replace with actual data for last six months
                      : filterDataVal === "Last one year"
                      ? [
                          47526, 12547, 2562, 4789, 3657, 85478, 2547, 1256,
                          258, 147, 357, 1489,
                        ] // Replace with actual data for last one year
                      : null, // Default case
                },
                {
                  label: "Reach",
                  data:
                    filterDataVal === "Current Month"
                      ? [rowData?.maxReach] // Assuming rowData?.maxReach is a number for "Current Month"
                      : filterDataVal === "Last six months"
                      ? [474526, 128547, 25562, 47389, 36457, 875478] // Replace with actual data for last six months
                      : filterDataVal === "Last one year"
                      ? [
                          47526, 12547, 2562, 4789, 3657, 85478, 2547, 1256,
                          258, 147, 357, 1489,
                        ] // Replace with actual data for last one year
                      : null, // Default case
                },
              ]}
              width={500}
              height={250}
            />
          </Paper>
          <Paper>
            <h6 className="fs-5 mx-2 pt-3">Average</h6>
            <LineChart
              xAxis={[{ data: [1] }]}
              series={[
                {
                  data: [rowData?.avgEngagement],
                },
                {
                  data: [rowData?.avgImpression], // Second line data
                },
                {
                  data: [rowData?.avgReach], // Third line data
                },
              ]}
              width={500}
              height={250}
            />
          </Paper>

          <LineChart
            xAxis={[{ data: [1] }]}
            series={[
              {
                data: [rowData?.maxEngagement],
              },
              {
                data: [rowData?.maxImpression], // Second line data
              },
              {
                data: [rowData?.maxReach], // Third line data
              },
            ]}
            width={500}
            height={300}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>

        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
