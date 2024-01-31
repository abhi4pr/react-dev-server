import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import axios from "axios";
import { DataGrid, GridColumnMenu, GridToolbar } from "@mui/x-data-grid";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Button } from "@mui/material";
import { downloadSelectedInvoices } from "../AdminPanel/WFH/SalaryGeneration/ZipGenerator";
import { generatePDF } from "../AdminPanel/WFH/SalaryGeneration/pdfGenerator";
import { useGlobalContext } from "../../Context/Context";
import {baseUrl} from '../../utils/config'

const accordionButtons = ["Pending Verify", "Verified", "Payment Released"];

export default function FinanceWFHDashboard() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  // const [dataRow, setDataRow] = useState({});
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [rowForPayment, setRowForPayment] = useState([]);
  const [invoice, setInvoice] = useState("");
  const [refrenceNumber, setRefrenceNumber] = useState(null);
  const [screenshot, setScreenshot] = useState([]);
  const [rowData, setDataRow] = useState(null);

  const { toastAlert } = useGlobalContext();

  const getData = async () => {
    try {
      axios.get(`${baseUrl}`+`get_finances`).then((res) => {
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

  const handleDownloadInvoices = async () => {
    try {
      await downloadSelectedInvoices(rowForPayment);
    } catch (error) {
      console.error("Error downloading invoices:", error);
      // Handle any errors related to downloading invoices here
    }
  };

  const handleRowSelectionModelChange = async (rowIds) => {
    setRowSelectionModel(rowIds);
    let x = filterData.filter((item) => {
      return rowIds.includes(item.id);
    });
    setRowForPayment(x);
    // console.log(x);
    // Call downloadSelectedInvoices when rows are selected
    // if (x.length > 0) {
    //   downloadSelectedInvoices(x);
    // }
  };

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

  const handlePay = (row, e) => {
    e.preventDefault(e);
    setShowModal(true);
    setId(row.id);
    setDataRow(row);
    setAmount("");
    setDate("");
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  function handlePayOut(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("amount", amount);
    formData.append("status_", rowData.status_ === 0 ? 1 : 2);
    formData.append("screenshot", screenshot);
    formData.append("reference_no", refrenceNumber);
    formData.append("pay_date", date);
    formData.append("attendence_id", rowData.attendence_id);

    axios
      .put(`${baseUrl}`+`edit_finance`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setRefrenceNumber("");
        setAmount("");
        toastAlert("Paid");
        setShowModal(false);
        getData();
      });
  }

  const pendingColumns = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
      renderCell: (params) => {
        const rowIndex =
          activeAccordionIndex == 0
            ? filterData
                .filter((item) => item.status_ === 0)
                .indexOf(params.row)
            : activeAccordionIndex == 1
            ? filterData
                .filter((item) => item.status_ === 1)
                .indexOf(params.row)
            : filterData
                .filter((item) => item.status_ === 2)
                .indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      headerName: "Name",
      field: "name",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.user_name}</div>;
      },
    },
    {
      headerName: "Department",
      field: "department",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.dept_name}</div>;
      },
    },
    {
      headerName: "Month",
      field: "month",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.month}</div>;
      },
    },
    {
      headerName: "Year",
      field: "year",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.year}</div>;
      },
    },
    {
      headerName: "Salary",
      field: "salary",
      width: 150,
      renderCell: (params) => {
        return <div>{`${params.row.total_salary}  ₹`} </div>;
      },
    },
    {
      headerName: "Net Salary",
      field: "net_salary",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.net_salary}</div>;
      },
    },
    {
      headerName: "TDS Deduction",
      field: "tds_deduction",
      width: 150,
      renderCell: (params) => {
        return <div>{params.row.tds_deduction}</div>;
      },
    },
    {
      headerName: "To Pay",
      field: "to_pay",
      width: 150,
      renderCell: (params) => {
        return <div>{`${params.row.toPay}  ₹`}</div>;
      },
    },
    {
      headerName: "Status",
      field: "attendence_status_flow",
      width: 150,
      renderCell: (params) => {
        return params.row.attendence_status_flow;
      },
    },
    {
      headerName: "Action",
      field: "action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {activeAccordionIndex != 2 && (
              <button
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={(e) => handlePay(params.row, e)}
              >
                Pay
              </button>
            )}

            {params.row?.invoice_template_no !== "0" && (
              <button
                className="btn btn-outline-primary btn-sm"
                title="Download Invoice"
                type="button"
                onClick={() => {
                  generatePDF(params.row);
                }}
              >
                <CloudDownloadIcon />
              </button>
            )}
          </>
        );
      },
    },
  ];

  const pending = (
    <div>
      <div style={{ height: "50px" }}>
        {rowForPayment.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ width: "100px" }}
            className="ml-3 mb-2"
            onClick={handleDownloadInvoices}
          >
            Download
          </Button>
        )}
      </div>
      <DataGrid
        rows={filterData.filter((item) => item.status_ === 0)}
        columns={pendingColumns}
        getRowId={(row) => row.id}
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
        // disableRowSelectionOnClick
        onRowSelectionModelChange={(rowIds) => {
          handleRowSelectionModelChange(rowIds);
          // console.log(rowIds);
        }}
        rowSelectionModel={rowSelectionModel}
        // unstable_ignoreValueFormatterDuringExport
        // slotProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //   },
        // }}
        // unstable_headerFilters
      />
    </div>
  );

  const verified = (
    <div>
      <DataGrid
        rows={filterData.filter((item) => item.status_ === 1)}
        columns={pendingColumns}
        getRowId={(row) => row.id}
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
        // disableRowSelectionOnClick
        onRowSelectionModelChange={(rowIds) => {
          handleRowSelectionModelChange(rowIds);
          // console.log(rowIds);
        }}
        rowSelectionModel={rowSelectionModel}
        // unstable_ignoreValueFormatterDuringExport
        // slotProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //   },
        // }}
        // unstable_headerFilters
      />
    </div>
  );

  const payoutReleased = (
    <div>
      {/* <h1>Payout Released</h1> */}
      <DataGrid
        rows={filterData.filter((item) => item.status_ === 2)}
        columns={pendingColumns}
        getRowId={(row) => row.id}
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
        // disableRowSelectionOnClick
        onRowSelectionModelChange={(rowIds) => {
          handleRowSelectionModelChange(rowIds);
          // console.log(rowIds);
        }}
        rowSelectionModel={rowSelectionModel}
        // unstable_ignoreValueFormatterDuringExport
        // slotProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //   },
        // }}
        // unstable_headerFilters
      />
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
        {invoice}

        {activeAccordionIndex === 0 && pending}
        {activeAccordionIndex === 1 && verified}
        {activeAccordionIndex === 2 && payoutReleased}
      </FormContainer>

      {showModal && (
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          tabIndex={-1}
          role="dialog"
          style={{ display: showModal ? "block" : "none" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Pay
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handlePayOut}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="col-form-label">Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <label className="col-form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="recipient-name"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={`${new Date().getFullYear()}-${String(
                        new Date().getMonth() + 1
                      ).padStart(2, "0")}-01`}
                    />
                    <label className="col-form-label">Snapshot</label>
                    <input
                      type="file"
                      className="form-control"
                      id="recipient-name"
                      onChange={(e) => setScreenshot(e.target.files[0])}
                    />
                  </div>
                  <div className="form-group">
                    <label className="col-form-label">RefrenceNumber</label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                      value={refrenceNumber}
                      onChange={(e) => setRefrenceNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    // onClick={handlePayOut}
                  >
                    Pay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
