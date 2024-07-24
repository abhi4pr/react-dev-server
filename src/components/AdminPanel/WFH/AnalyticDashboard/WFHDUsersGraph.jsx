import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Stack, Tabs, Tab, Box } from "@mui/material";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "Page C",
    uv: 6000,
    pv: 1398,
  },
  {
    name: "Page D",
    uv: 7000,
    pv: 1896,
  },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function WFHDUsersGrapf() {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const [graphData, setGraphData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    axios
      .post(baseUrl + "get_user_graph_data_of_wfhd", {
        caseType: "department_wise",
      })
      .then((res) => {
        setGraphData(res.data);
      });
  }, []);

  const handleFilterChange = async (e) => {
    const newFilter = e.target ? e.target.value : e;
    setSelectedFilter(newFilter);
    await axios
      .post(baseUrl + "get_user_graph_data_of_wfhd", {
        caseType: e.target.value,
      })
      .then((res) => {
        setGraphData(res.data);
      });
  };

  const handleOpen = (data) => {
    setModalData(data);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <div className="col-4">
        <FieldContainer
          Tag="select"
          label="Select Filter"
          fieldGrid={6}
          value={selectedFilter}
          required={false}
          onChange={(e) => handleFilterChange(e)}
        >
          {/* <option value=""> Select To See Graph </option> */}
          <option value="department_wise"> Department </option>
          <option value="year"> Joined in year </option>
          <option value="age"> Age </option>
        </FieldContainer>
      </div>

      <BarChart
        width={500}
        height={300}
        data={graphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="dept_name"
          fill="#8884d8"
          onClick={(entry) => handleOpen(entry)}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
        <Bar
          dataKey="maleCount"
          label={"ok"}
          fill="#82ca9d"
          onClick={(entry) => handleOpen(entry)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
        <Bar
          dataKey="femaleCount"
          fill="#FF5733"
          onClick={(entry) => handleOpen(entry)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
        <Bar
          dataKey="age"
          fill="#259DFA"
          onClick={(entry) => handleOpen(entry)}
        >
          {data.map((entry, index) => (
            <>
              <Cell key={`cell-${index}`} />
            </>
          ))}
        </Bar>
        <Bar
          dataKey="userCount"
          fill="#82ca9d"
          onClick={(entry) => handleOpen(entry)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
        <Bar
          dataKey="userjoined"
          fill="#B027F5"
          onClick={(entry) => handleOpen(entry)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
        <Bar
          dataKey="year"
          fill="#B027F5"
          onClick={(entry) => handleOpen(entry)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
      </BarChart>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Stack sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {modalData?.name}
          </Typography>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            {/* <Tab label="UV" />
            <Tab label="PV" /> */}
            <Tab label="Department" />
            <Tab label="Age" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {tabIndex === 0 && (
              <Typography id="modal-description">
                UV: {modalData?.uv}
              </Typography>
            )}
            {tabIndex === 1 && (
              <Typography id="modal-description">
                PV: {modalData?.pv}
              </Typography>
            )}
          </Box>
        </Stack>
      </Modal>
    </div>
  );
}
