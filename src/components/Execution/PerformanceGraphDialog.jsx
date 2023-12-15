import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

export default function PerformanceGraphDialog({
  setOpenPerformanceGraphDialog,
  rowData,
  intervalFlag,
  setIntervalFlag,
  intervalFlagOptions
}) {
  const [open, setOpen] = useState(true);
  // const [intervalFlag, setintervalFlag] = useState("Current Month");

  const handleClose = () => {
    setOpenPerformanceGraphDialog(false);
  };

  useEffect(() => {
    console.log(rowData);
    // console.log(rowData.maxEngagement);
  }, []);

  // const GraphAutoCompSelectdata = [
  //   "Current Month",
  //   "Last six months",
  //   "Last one year",
  // ];

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} maxWidth={"xl"}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          {/* <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={GraphAutoCompSelectdata}
            sx={{ width: 250 }}
            className="mt-2"
            value={intervalFlag}
            onChange={(event, newValue) => {
              if (newValue === null) {
                return setintervalFlag("Current Month");
              }
              setintervalFlag(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Choose Option" />
            )}
          /> */}

<Autocomplete
          disablePortal
          va
          lue={intervalFlag.label}
          defaultValue={intervalFlagOptions[0].label}
          id="combo-box-demo"
          options={intervalFlagOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChange={(event, newValue) => {
            if (newValue === null) {
              return setIntervalFlag({ label: "Current Month", value: 1 });
            }
            console.log(newValue);
            setIntervalFlag(newValue);
          }}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Filter Date" />
          )}
        />

          {intervalFlag.label === "Current Month" && (
            <>
              <Paper>
                <h6 className="fs-5 mx-2 pt-3">Highest</h6>
                <BarChart
                  xAxis={[{ scaleType: "band", data: ["Highest"] }]}
                  series={[
                    { data: [rowData?.maxEngagement], label: "Reach" },
                    { data: [rowData?.maxImpression], label: "Impression" },
                    { data: [rowData?.maxReach], label: "Engagement" },
                  ]}
                  width={500}
                  height={300}
                />
              </Paper>
              <Paper>
                <h6 className="fs-5 mx-2 pt-3">Average</h6>
                <BarChart
                  xAxis={[{ scaleType: "band", data: ["Average"] }]}
                  series={[
                    { data: [rowData?.avgEngagement], label: "Reach" },
                    { data: [rowData?.avgImpression], label: "Impression" },
                    { data: [rowData?.avgReach], label: "Engagement" },
                  ]}
                  width={500}
                  height={300}
                />
              </Paper>
              <Paper>
                <h6 className="fs-5 mx-2 pt-3">Lowest</h6>
                <BarChart
                  xAxis={[{ scaleType: "band", data: ["Lowest"] }]}
                  series={[
                    { data: [rowData?.minEngagement], label: "Reach" },
                    { data: [rowData?.minImpression], label: "Impression" },
                    { data: [rowData?.minReach], label: "Engagement" },
                  ]}
                  width={500}
                  height={300}
                />
              </Paper>
            </>
          )}
          {intervalFlag?.label !== "Current Month" && (
            <>
              {" "}
              <Paper>
                <h6 className="fs-5 mx-2 pt-3">Highest</h6>
                <LineChart
                  xAxis={[
                    intervalFlag?.label === "Current Month"
                      ? { data: [1] }
                      : intervalFlag.label === "Last six months"
                      ? { data: [1, 2, 3, 4, 5, 6] }
                      : intervalFlag.label === "Last one year"
                      ? { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
                      : null,
                  ]}
                  series={[
                    {
                      label: "Engagement",
                      data:
                        intervalFlag?.label === "Current Month"
                          ? [rowData?.maxEngagement] // Assuming rowData?.maxEngagement is a number
                          : intervalFlag.label === "Last six months"
                          ? [583, 4854, 7885, 444, 455, 8624] // Array for last six months
                          : intervalFlag.label === "Last one year"
                          ? [rowData?.maxEngagement] // Array for last one year
                          : null, // Default case
                      // data: [rowData?.maxEngagement],
                    },
                    {
                      label: "Impression",
                      data:
                        intervalFlag?.label === "Current Month"
                          ? [rowData?.maxImpression] // Assuming rowData?.maxImpression is a number for "Current Month"
                          : intervalFlag.label === "Last six months"
                          ? [47526, 12547, 2562, 4789, 3657, 85478] // Replace with actual data for last six months
                          : intervalFlag.label === "Last one year"
                          ? [
                            rowData?.maxImpression
                            ] // Replace with actual data for last one year
                          : null, // Default case
                    },
                    {
                      label: "Reach",
                      data:
                        intervalFlag?.label === "Current Month"
                          ? [rowData?.maxReach] // Assuming rowData?.maxReach is a number for "Current Month"
                          : intervalFlag.label === "Last six months"
                          ? [474526, 128547, 25562, 47389, 36457, 875478] // Replace with actual data for last six months
                          : intervalFlag.label === "Last one year"
                          ? [
                            rowData?.maxReach
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
              <Paper>
                <h6 className="fs-5 mx-2 pt-3">Lowest</h6>

                <LineChart
                  xAxis={[{ data: [1] }]}
                  series={[
                    {
                      data: [rowData?.minEngagement],
                    },
                    {
                      data: [rowData?.minImpression], // Second line data
                    },
                    {
                      data: [rowData?.minReach], // Third line data
                    },
                  ]}
                  width={500}
                  height={300}
                />
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
