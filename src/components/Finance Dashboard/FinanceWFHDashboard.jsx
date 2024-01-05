import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import axios from "axios";
import { DataGrid, GridColumnMenu, GridToolbar } from "@mui/x-data-grid";
import { param } from "jquery";

const accordionButtons = ["Pengin Verify", "Virified", "Payment Released"];

export default function FinanceWFHDashboard() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);


  const getData = async () => {
    try {
      axios.get(`http://34.93.221.166:3000/api/get_finances`).then((res) => {
        const response = res.data;
        setData(response);
        setFilterData(response);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuColumnsItem: null,
        }}
      />
    );
  }

  const pendingColumns = [
  {headerName: "_id", field:"S.No" , renderCell: (params) =>{return params.row._id}},
  ];

  const pending = (
    <div>
       {/* <DataGrid
              rows={filterData}
              columns={pendingColumns}
              getRowId={(row) => row.p_id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 50,
                  },
                },
              }}
              slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
              pageSizeOptions={[5, 25, 50, 100, 500]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={rowSelectionModel}
              unstable_ignoreValueFormatterDuringExport
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              unstable_headerFilters
            /> */}
            pending
    </div>
  );

  const verified = (
    <div>
      <h1>Verified</h1>
    </div>
  );

  const payoutReleased = (
    <div>
      <h1>Payout Released</h1>
    </div>
  );

  return (
    <div>
      <FormContainer
        submitButton={false}
        mainTitle="Dashboard"
        title="Finance"
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
      >
        {activeAccordionIndex === 0 && pending}
        {activeAccordionIndex === 1 && verified}
        {activeAccordionIndex === 2 && payoutReleased}
      </FormContainer>
    </div>
  );
}
