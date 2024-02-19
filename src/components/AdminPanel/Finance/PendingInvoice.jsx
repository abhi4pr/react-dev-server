import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import {
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const PendingInvoice = () => {
  const navigate = useNavigate();
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [inoiceNum, setInoiceNum] = useState("");
  const [date, setDate] = useState(dayjs());
  const [salesPersonName, setSalesPersonName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [baseAmountFilter, setBaseAmountFilter] = useState("");
  const [baseAmountField, setBaseAmountField] = useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleReject = async (row) => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", row.sale_booking_id);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=invoice_reject",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        axios
          .put(baseUrl + "pending_invoice_update", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            getData();
            setDate(dayjs());
            setInoiceNum("");
            setPartyName("");
          });
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  const handleImageUpload = async (row, fileData) => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("invoiceFormSubmit", 1);
    formData.append("invoice", fileData);
    formData.append("invoice_mnj_number", inoiceNum);
    formData.append(
      "invoice_mnj_date",
      new Date(date.$d).toISOString().split("T")[0]
    );
    formData.append("party_mnj_name", partyName);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=invoice_upload_file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toastAlert("Data updated");
        axios
          .put(baseUrl + "pending_invoice_update", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            getData();
          });
      });
  };

  function getData() {
    axios
      .post(baseUrl + "add_php_pending_invoice_data_in_node")
      .then((res) => {});
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-pending_invoice_creation_list",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setData(res.data.body);
        setFilterData(res.data.body);
        // For Unique Customers
        const custData = res.data.body;
        const uniqueCustomers = new Set(custData.map((item) => item.cust_name));
        setUniqueCustomerCount(uniqueCustomers.size);
        const uniqueCustomerData = Array.from(uniqueCustomers).map(
          (customerName) => {
            return custData.find((item) => item.cust_name === customerName);
          }
        );
        setUniqueCustomerData(uniqueCustomerData);
        // For Unique Sales Executive
        const salesExecuteiveData = res.data.body;
        const uniqueSalesEx = new Set(
          salesExecuteiveData.map((item) => item.sales_person_username)
        );
        setUniqueSalesExecutiveCount(uniqueSalesEx.size);
        const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
          return salesExecuteiveData.find(
            (item) => item.sales_person_username === salesEName
          );
        });
        setUniqueSalesExecutiveData(uniqueSEData);
      });
  }

  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
      const date = new Date(item.sale_booking_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Sales Person Filter:-
      const salesPersonNameFilterPassed =
        !salesPersonName ||
        item.sales_person_username
          .toLowerCase()
          .includes(salesPersonName.toLowerCase());
      // customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.cust_name.toLowerCase().includes(customerName.toLowerCase());
      // request amount filter:-
      const requestAmountFilterPassed = () => {
        const baseAmountData = parseFloat(baseAmountField);
        switch (baseAmountFilter) {
          case "greaterThan":
            return +item.base_amount > baseAmountData;
          case "lessThan":
            return +item.base_amount < baseAmountData;
          case "equalTo":
            return +item.base_amount === baseAmountData;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        dateFilterPassed &&
        salesPersonNameFilterPassed &&
        customerNameFilterPassed &&
        requestAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };
  const handleClearAllFilter = () => {
    setFilterData(datas);
    setSalesPersonName("");
    setToDate("");
    setFromDate("");
    setCustomerName("");
    setBaseAmountFilter("");
    setBaseAmountField("");
  };
  // For Customers
  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };

  const handleOpenSameCustomer = (custName) => {
    setSameCustomerDialog(true);

    const sameNameCustomers = datas.filter(
      (item) => item.cust_name === custName
    );
    setSameCustomerData(sameNameCustomers);
  };

  const handleCloseSameCustomer = () => {
    setSameCustomerDialog(false);
  };

  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    setSameSalesExecutiveDialog(true);

    const sameNameSalesExecutive = datas.filter(
      (item) => item.sales_person_username === salesEName
    );

    setSameSalesExecutiveData(sameNameSalesExecutive);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };

  // Total base amount:-
  const baseAmountTotal = datas.reduce(
    (total, item) => total + parseFloat(item.base_amount),
    0
  );
  const sameSalesExecutivecolumn = [
    {
      fieldName: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      fieldName: "sales_person_username",
      field: "Sales Person Name",
      renderCell: (params) => params.row.sales_person_username,
    },

    {
      fieldName: "sale_booking_date",
      field: "Requested On Date",
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      fieldName: "description",
      field: "Sale Booking Description",
      renderCell: (params) => params.row.description,
    },
    {
      fieldName: "cust_name",
      field: "Customer Name",
      renderCell: (params) => (
        <>
          <Link
            className="text-primary"
            to={`/admin/finance-pendinginvoice/customer-details/${params.row.cust_id}`}
          >
            {params.row.cust_name}
          </Link>
        </>
      ),
    },
    {
      fieldName: "invoice_particular_name",
      field: "Invoice Particular Name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      fieldName: "invoice_type_name",
      field: "Invoice Type",
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      fieldName: "base_amount",
      field: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      fieldName: "gst_amount",
      field: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      fieldName: "net_amount",
      field: "Net Amount",
      renderCell: (params) => params.row.net_amount,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //     <Link to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}>
    //       <button className="btn btn-primary" >
    //         Customer Details
    //       </button>
    //     </Link>
    //     </>
    //   ),
    // },
  ];
  const uniqueSalesExecutivecolumn = [
    {
      fieldName: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      fieldName: "sales_person_username",
      field: "Sales Person Name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            handleOpenSameSalesExecutive(params.row.sales_person_username)
          }
        >
          {params.row.sales_person_username}
        </div>
      ),
    },

    {
      fieldName: "sale_booking_date",
      field: "Requested On Date",
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      fieldName: "description",
      field: "Sale Booking Description",
      renderCell: (params) => params.row.description,
    },
    {
      fieldName: "cust_name",
      field: "Customer Name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}
        </div>
      ),
    },

    {
      field: "Input",
      selector: (params, index) => (
        <div className="mt-2">
          <TextField
            key={params.row.sale_booking_id}
            className="d-block"
            type="text"
            name="input"
            label="Invoice No."
            sx={{
              marginBottom: "1px",
              "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                padding: "12px ",
              },
            }}
            onChange={(e) => setInoiceNum(e.target.value)}
          />
          {/* //invoice num , date , party name */}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={params.row.sale_booking_id}
                format="DD/MM/YYYY"
                sx={{
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    padding: "10px",
                  },
                }}
                defaultValue={dayjs()}
                onChange={(e) => {
                  setDate(e);
                }}
              />
            </LocalizationProvider>
          </div>
          <div>
            <TextField
              key={params.row.sale_booking_id}
              type="text"
              name="input"
              label="Party Name"
              sx={{
                marginBottom: "1px",
                "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                  padding: "12px ",
                },
              }}
              onChange={(e) => setPartyName(e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      field: "Upload Invoice",
      renderCell: (params, index) => (
        <div key={params.row.sale_booking_id}>
          <form>
            <input
              key={index}
              type="file"
              name="upload_image"
              onChange={(e) => handleImageUpload(params.row, e.target.files[0])}
            />
            {/* <button type="submit" value="upload">
              Upload
            </button> */}
          </form>
          <br />
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleReject(params.row)}
          >
            Reject
          </button>
        </div>
      ),
    },
    {
      fieldName: "invoice_particular_name",
      field: "Invoice Particular Name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      fieldName: "invoice_type_name",
      field: "Invoice Type",
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      fieldName: "base_amount",
      field: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      fieldName: "gst_amount",
      field: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      fieldName: "net_amount",
      field: "Net Amount",
      renderCell: (params) => params.row.net_amount,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //     <Link to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}>
    //       <button className="btn btn-primary" >
    //         Customer Details
    //       </button>
    //     </Link>
    //     </>
    //   ),
    // },
  ];

  const sameCustomercolumn = [
    {
      fieldName: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      fieldName: "sales_person_username",
      field: "Sales Person Name",
      renderCell: (params) => params.row.sales_person_username,
    },

    {
      fieldName: "sale_booking_date",
      field: "Requested On Date",
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      fieldName: "description",
      field: "Sale Booking Description",
      renderCell: (params) => params.row.description,
    },
    {
      fieldName: "cust_name",
      field: "Customer Name",
      renderCell: (params) => (
        <>
          <Link
            className="text-primary"
            to={`/admin/finance-pendinginvoice/customer-details/${params.row.cust_id}`}
          >
            {params.row.cust_name}
          </Link>
        </>
      ),
    },
    {
      fieldName: "invoice_particular_name",
      field: "Invoice Particular Name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      fieldName: "invoice_type_name",
      field: "Invoice Type",
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      fieldName: "base_amount",
      field: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      fieldName: "gst_amount",
      field: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      fieldName: "net_amount",
      field: "Net Amount",
      renderCell: (params) => params.row.net_amount,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //     <Link to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}>
    //       <button className="btn btn-primary" >
    //         Customer Details
    //       </button>
    //     </Link>
    //     </>
    //   ),
    // },
  ];
  const uniqueCustomercolumn = [
    {
      fieldName: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      fieldName: "sales_person_username",
      field: "Sales Person Name",
      renderCell: (params) => params.row.sales_person_username,
    },

    {
      fieldName: "sale_booking_date",
      field: "Requested On Date",
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      fieldName: "description",
      field: "Sale Booking Description",
      renderCell: (params) => params.row.description,
    },
    {
      fieldName: "cust_name",
      field: "Customer Name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}
        </div>
      ),
    },

    {
      field: "Input",
      selector: (params, index) => (
        <div className="mt-2">
          <TextField
            key={params.row.sale_booking_id}
            className="d-block"
            type="text"
            name="input"
            label="Invoice No."
            sx={{
              marginBottom: "1px",
              "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                padding: "12px ",
              },
            }}
            onChange={(e) => setInoiceNum(e.target.value)}
          />
          {/* //invoice num , date , party name */}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={params.row.sale_booking_id}
                format="DD/MM/YYYY"
                sx={{
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    padding: "10px",
                  },
                }}
                defaultValue={dayjs()}
                onChange={(e) => {
                  setDate(e);
                }}
              />
            </LocalizationProvider>
          </div>
          <div>
            <TextField
              key={params.row.sale_booking_id}
              type="text"
              name="input"
              label="Party Name"
              sx={{
                marginBottom: "1px",
                "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                  padding: "12px ",
                },
              }}
              onChange={(e) => setPartyName(e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      field: "Upload Invoice",
      renderCell: (params, index) => (
        <div key={params.row.sale_booking_id}>
          <form>
            <input
              key={index}
              type="file"
              name="upload_image"
              onChange={(e) => handleImageUpload(params.row, e.target.files[0])}
            />
            {/* <button type="submit" value="upload">
              Upload
            </button> */}
          </form>
          <br />
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleReject(params.row)}
          >
            Reject
          </button>
        </div>
      ),
    },
    {
      fieldName: "invoice_particular_name",
      field: "Invoice Particular Name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      fieldName: "invoice_type_name",
      field: "Invoice Type",
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      fieldName: "base_amount",
      field: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      fieldName: "gst_amount",
      field: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      fieldName: "net_amount",
      field: "Net Amount",
      renderCell: (params) => params.row.net_amount,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //     <Link to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}>
    //       <button className="btn btn-primary" >
    //         Customer Details
    //       </button>
    //     </Link>
    //     </>
    //   ),
    // },
  ];
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "Sales Person name",
      selector: (row) => row.sales_person_username,
      width: "10%",
    },
    {
      name: "Requested On Date",
      // selector: (row) => row.sale_booking_date,
      cell: (row) => convertDateToDDMMYYYY(row.sale_booking_date),
      width: "12%",
    },
    {
      name: "Sale Booking Description",
      selector: (row) => row.description,
      width: "17%",
    },
    {
      name: "Customer Name",
      // selector: (row) => row.cust_name,
      cell: (row) => (
        <>
          <Link
            className="text-primary"
            to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}
          >
            {row.cust_name}
          </Link>
        </>
      ),
      width: "15%",
    },

    {
      name: "Input",
      selector: (row, index) => (
        <div className="mt-2">
          <TextField
            key={row.sale_booking_id}
            className="d-block"
            type="text"
            name="input"
            label="Invoice No."
            sx={{
              marginBottom: "1px",
              "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                padding: "12px ",
              },
            }}
            onChange={(e) => setInoiceNum(e.target.value)}
          />
          {/* //invoice num , date , party name */}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={row.sale_booking_id}
                format="DD/MM/YYYY"
                sx={{
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    padding: "10px",
                  },
                }}
                defaultValue={dayjs()}
                onChange={(e) => {
                  setDate(e);
                }}
              />
            </LocalizationProvider>
          </div>
          <div>
            <TextField
              key={row.sale_booking_id}
              type="text"
              name="input"
              label="Party Name"
              sx={{
                marginBottom: "1px",
                "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                  padding: "12px ",
                },
              }}
              onChange={(e) => setPartyName(e.target.value)}
            />
          </div>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Upload Invoice",
      selector: (row, index) => (
        <div key={row.sale_booking_id}>
          <form>
            <input
              key={index}
              type="file"
              name="upload_image"
              onChange={(e) => handleImageUpload(row, e.target.files[0])}
            />
            {/* <button type="submit" value="upload">
              Upload
            </button> */}
          </form>
          <br />
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleReject(row)}
          >
            Reject
          </button>
        </div>
      ),
      width: "20%",
    },
    {
      name: "Invoice Particular Name",
      selector: (row) => row.invoice_particular_name,
      width: "15%",
    },
    {
      name: "Invoice Type",
      selector: (row) => row.invoice_type_name,
      width: "15%",
    },
    {
      name: "Base Amount",
      selector: (row) => row.base_amount,
      width: "9%",
    },
    {
      name: "GST Amount",
      selector: (row) => row.gst_amount,
      width: "9%",
    },
    {
      name: "Net Amount",
      selector: (row) => row.net_amount,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //     <Link to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}>
    //       <button className="btn btn-primary" >
    //         Customer Details
    //       </button>
    //     </Link>
    //     </>
    //   ),
    // },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Pending Invoice "
        link="/admin/incentive-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        uniqueCustomerCount={uniqueCustomerCount}
        baseAmountTotal={baseAmountTotal}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        pendingInvoicePaymentAdditionalTitles={true}
      />
      {/* Same Sales Executive Dialog Box */}

      <Dialog
        open={sameSalesExecutiveDialog}
        onClose={handleCloseSameSalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameSalesExecutive}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DataGrid
          rows={sameSalesExecutiveData}
          columns={sameSalesExecutivecolumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableColumnReorder
          disableColumnResize
          disableMultipleColumnsSorting
          components={{
            Toolbar: GridToolbar,
          }}
          fv
          componentsProps={{
            toolbar: {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search",
              clearSearch: true,
              clearSearchAriaLabel: "clear",
            },
          }}
          getRowId={(row) => sameSalesExecutiveData.indexOf(row)}
        />
      </Dialog>
      {/* Unique Sales Executive Dialog Box */}
      <Dialog
        open={uniqueSalesExecutiveDialog}
        onClose={handleCloseUniquesalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniquesalesExecutive}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DataGrid
          rows={uniqueSalesExecutiveData}
          columns={uniqueSalesExecutivecolumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableColumnReorder
          disableColumnResize
          disableMultipleColumnsSorting
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search",
              clearSearch: true,
              clearSearchAriaLabel: "clear",
            },
          }}
          getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
        />
      </Dialog>
      {/* Same Customer Dialog */}
      <Dialog
        open={sameCustomerDialog}
        onClose={handleCloseSameCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Customers</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DataGrid
          rows={sameCustomerData}
          columns={sameCustomercolumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableColumnReorder
          disableColumnResize
          disableMultipleColumnsSorting
          components={{
            Toolbar: GridToolbar,
          }}
          fv
          componentsProps={{
            toolbar: {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search",
              clearSearch: true,
              clearSearchAriaLabel: "clear",
            },
          }}
          getRowId={(row) => sameCustomerData.indexOf(row)}
        />
      </Dialog>

      {/* Unique Customer Dialog Box */}
      <Dialog
        open={uniqueCustomerDialog}
        onClose={handleCloseUniqueCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Customers</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniqueCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DataGrid
          rows={uniqueCustomerData}
          columns={uniqueCustomercolumn}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableColumnReorder
          disableColumnResize
          disableMultipleColumnsSorting
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Search",
              clearSearch: true,
              clearSearchAriaLabel: "clear",
            },
          }}
          getRowId={(row) => uniqueCustomerData.indexOf(row)}
        />
      </Dialog>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Sales Person Name</label>
            <Autocomplete
              value={salesPersonName}
              onChange={(event, newValue) => setSalesPersonName(newValue)}
              options={Array.from(
                new Set(datas.map((option) => option.sales_person_username))
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sales Executive Name"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    className: "form-control", // Apply Bootstrap's form-control class
                  }}
                  style={{
                    borderRadius: "0.25rem",
                    transition:
                      "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                    "&:focus": {
                      borderColor: "#80bdff",
                      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Customer Name</label>
            <Autocomplete
              value={customerName}
              onChange={(event, newValue) => setCustomerName(newValue)}
              options={Array.from(
                new Set(datas.map((option) => option.cust_name))
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="customer Name"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    className: "form-control", // Apply Bootstrap's form-control class
                  }}
                  style={{
                    borderRadius: "0.25rem",
                    transition:
                      "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
                    "&:focus": {
                      borderColor: "#80bdff",
                      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>From Date</label>
            <input
              value={fromDate}
              type="date"
              className="form-control"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>To Date</label>
            <input
              value={toDate}
              type="date"
              className="form-control"
              onChange={(e) => {
                setToDate(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label>Requested Amount Filter</label>
            <select
              value={baseAmountFilter}
              className="form-control"
              onChange={(e) => setBaseAmountFilter(e.target.value)}
            >
              <option value="">Select Amount</option>
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
              <option value="equalTo">Equal To</option>
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Requested Amount</label>
            <input
              value={baseAmountField}
              type="number"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setBaseAmountField(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-1 mt-4 me-2">
          <Button variant="contained" onClick={handleAllFilters}>
            <i className="fas fa-search"></i> Search
          </Button>
        </div>
        <div className="col-md-1 mt-4">
          <Button variant="contained" onClick={handleClearAllFilter}>
            Clear
          </Button>
        </div>
      </div>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Pending Invoice Creation"
            columns={columns}
            data={filterData}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
    </>
  );
};

export default PendingInvoice;
