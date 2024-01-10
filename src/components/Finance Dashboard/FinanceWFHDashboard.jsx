import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import axios from "axios";
import { DataGrid, GridColumnMenu, GridToolbar } from "@mui/x-data-grid";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Button } from "@mui/material";
import { downloadSelectedInvoices } from "../AdminPanel/WFH/SalaryGeneration/ZipGenerator";
import { generatePDF } from "../AdminPanel/WFH/SalaryGeneration/pdfGenerator";

const accordionButtons = ["Pending Verify", "Verified", "Payment Released"];

export default function FinanceWFHDashboard() {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [dataRow, setDataRow] = useState({});
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [rowForPayment, setRowForPayment] = useState([]);
  const [invoice, setInvoice] = useState("");

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

  // const handleRowSelectionModelChange = (rowIds) => {
  //   setRowSelectionModel(rowIds);
  //   let x = filterData.filter((item) => {
  //     return rowIds.includes(item.id);
  //   });
  //   setRowForPayment(x);
  // };

  // const downloadSelectedInvoices = async (data) => {
  //   // console.log(data);
  //   const zip = new JSZip();

  //   // console.log(data);
  //   // console.log(rowForPayment);
  //   for (const row of rowForPayment) {
  //     // console.log(row.invoice_template_no)
  //     console.log(row);
  //     if (row?.invoice_template_no !== "0") {
  //       // console.log(row);
  //       const invoiceBlob =   generatePDF(row); // Assuming generatePDF returns a Blob
  //       zip.file(`${await row.user_name}.pdf`,await invoiceBlob);
  //       console.log(zip)
  //     }
  //   }

  //    zip.generateAsync({ type: "blob" }).then((content) => {
  //     // Triggering download
  //     // console.log(content);
  //     const element = document.createElement("a");
  //     console.log(document)
  //     const url = URL.createObjectURL(content);
  //     element.href = url;
  //     element.download = "test.zip";
  //     document.body.appendChild(element);
  //     // saveAs(content, "example.zip");
  //     element.click();
  //     document.body.removeChild(element);
  //   });
  // };

  // const downloadSelectedInvoices = async (data) => {
  //   const zip = new JSZip();

  //   for (const row of rowForPayment) {
  //     if (row?.invoice_template_no !== "0") {
  //       try {
  //         const invoiceBlob = await generatePDF(row);
  //         setInvoice(invoiceBlob)

  //         console.log(invoiceBlob,"invoiceBlob")
  //         if (invoiceBlob) {
  //           const fileName = `${row.user_name}_${row.month}_invoice.pdf`;
  //           zip.file(fileName, invoiceBlob);
  //         }
  //       } catch (error) {
  //         console.error("Error generating PDF:", error);
  //         // Handle any errors in PDF generation here
  //       }
  //     }
  //   }

  //   zip.generateAsync({ type: "blob" }).then((content) => {
  //     const element = document.createElement("a");
  //     const url = URL.createObjectURL(content);
  //     element.href = url;
  //     element.download = "selected_invoices.zip";

  //     document.body.appendChild(element);
  //     element.click();
  //     document.body.removeChild(element);
  //   });
  // };

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

  const pendingColumns = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
      renderCell: (params) => {
        const rowIndex = filterData.indexOf(params.row);
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
            <button
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={(e) => handlePay(params.row, e)}
            >
              Pay
            </button>

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
      <DataGrid
        rows={filterData}
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
        {invoice}
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
        {activeAccordionIndex === 0 && pending}
        {activeAccordionIndex === 1 && verified}
        {activeAccordionIndex === 2 && payoutReleased}
      </FormContainer>
    </div>
  );
}
