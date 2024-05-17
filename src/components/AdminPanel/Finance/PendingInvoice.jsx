import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import pdf from "./pdf-file.png";
import {
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { blue } from "@mui/material/colors";
import ImageView from "./ImageView";
import moment from "moment";

const PendingInvoice = () => {
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filterDataInvoice, setFilterDataInvoice] = useState([]);
  const [dataInvoice, setDataInvoice] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [inoiceNum, setInoiceNum] = useState("");
  const [date, setDate] = useState(dayjs());
  const [salesPersonName, setSalesPersonName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [baseAmountFilter, setBaseAmountFilter] = useState("");
  const [baseAmountField, setBaseAmountField] = useState("");
  const [customerNameInvoice, setCustomerNameInvoice] = useState("");
  const [invoiceParticularName, setInvoiceParticularName] = useState("");
  const [salesPersonInvoiceName, setSalesPersonInvoiceName] = useState("");
  const [campaignAmountInvoiceFilter, setCampaignAmountInvoiceFilter] =
    useState("");
  const [campaignAmountInvoiceField, setCampaignAmountInvoiceField] =
    useState("");
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [sameCustomerData, setSameCustomerData] = useState([]);

  const [uniqueCustomerInvoiceCount, setUniqueCustomerInvoiceCount] =
    useState(0);
  const [uniqueCustomerInvoiceData, setUniqueCustomerInvoiceData] = useState(
    []
  );
  const [sameCustomerInvoiceData, setSameCustomerInvoiceData] = useState([]);

  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [
    uniqueSalesExecutiveInvoiceCount,
    setUniqueSalesExecutiveInvoiceCount,
  ] = useState("");
  const [uniqueSalesExecutiveInvoiceData, setUniqueSalesExecutiveInvoiceData] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");
  const [sameSalesExecutiveInvoiceData, setSameSalesExecutiveInvoiceData] =
    useState("");
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [editActionDialog, setEditActionDialog] = useState("");
  const [invcDate, setInvcDate] = useState("");
  const [invcNumber, setInvcNumber] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const [partyInvoiceName, setPartyInvoiceName] = useState("");
  const [imageInvoice, setImageInvoice] = useState([]);
  const [saleBookingId, setSaleBookingId] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [dateFilterInvoice, setDateFilterInvoice] = useState("");
  const [invoiceMngDate, setInvoiceMngDate] = useState("");
  const [reason, setReason] = useState("");
  const [discardSaleBookingId, setDiscardSaleBookingId] = useState("");
  const [discardDialog, setDiscardDialog] = useState(false);

  const accordionButtons = ["Pending Invoice", "Invoice Created", "Proforma"];

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleReject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", discardSaleBookingId);
    formData.append("invoice_action_reason", reason);

    const confirmation = confirm("Are you sure you want to reject this data?");
    if (confirmation) {
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
              toastAlert("Data Rejected Successfully");
              handleDiscardCloseDialog();
              getData();
              setDate(dayjs());
              setInoiceNum("");
              setPartyName("");
            });
        });
    } else {
      getData();
    }
    // toastAlert("Data updated");
    // setIsFormSubmitted(true);
  };

  const handleImageUpload = async (row) => {
    console.log(inoiceNum, "inoiceNum", date, "date", partyName, "partyName>>");
    console.log(partyName, "partyName>>>");
    // if (!inoiceNum || !date || !partyName || !fileUpload) {
    //   toastError("Please fill all the fields");
    //   return;
    // }
    if (!fileUpload) {
      toastError("Please Add Invoice Image");
      return;
    }
    // if (!inoiceNum) {
    //   toastError("Please fill Invoice Number");
    // } else if (!date) {
    //   toastError("Please fill Invoice Date ");
    // } else if (!partyName) {
    //   toastError("Please fill Party Name ");
    // } else if (!fileUpload) {
    //   toastError("Please Add File ");
    // }

    const confirmation = confirm("Are you sure you want to submit this data?");
    if (confirmation) {
      const formData = new FormData();
      formData.append("loggedin_user_id", 36);
      formData.append("sale_booking_id", row.sale_booking_id);
      formData.append("invoiceFormSubmit", 1);
      formData.append("invoice", fileUpload);
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
        .then((res) => {
          toastAlert("Data Submitted Successfully");
          getDataInvoiceCreated();
          axios
            .put(baseUrl + "pending_invoice_update", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              getData();
            });
        });
    } else {
      getData();
    }
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
        console.log(res, "RES FILTER DATA????");
        setData(res.data.body);
        setFilterData(res?.data?.body);
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

    const uniqueCustomers = new Set(filterData.map((item) => item.cust_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return filterData.find((item) => item.cust_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
    // For Unique Sales Executive
    const uniqueSalesEx = new Set(
      filterData.map((item) => item.sales_person_username)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
      return filterData.find(
        (item) => item.sales_person_username === salesEName
      );
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };
  const handleClearAllFilter = () => {
    setFilterData(datas);
    setSalesPersonName("");
    setToDate("");
    setFromDate("");
    setCustomerName("");
    setBaseAmountFilter("");
    setBaseAmountField("");

    const uniqueCustomers = new Set(datas.map((item) => item.cust_name));
    setUniqueCustomerCount(uniqueCustomers.size);
    const uniqueCustomerData = Array.from(uniqueCustomers).map(
      (customerName) => {
        return datas.find((item) => item.cust_name === customerName);
      }
    );
    setUniqueCustomerData(uniqueCustomerData);
    // For Unique Sales Executive
    const uniqueSalesEx = new Set(
      datas.map((item) => item.sales_person_username)
    );
    setUniqueSalesExecutiveCount(uniqueSalesEx.size);
    const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
      return datas.find((item) => item.sales_person_username === salesEName);
    });
    setUniqueSalesExecutiveData(uniqueSEData);
  };

  // For discard-----
  const handleDiscardOpenDialog = (e, rowData) => {
    e.preventDefault();
    setDiscardSaleBookingId(rowData.sale_booking_id);
    setDiscardDialog(true);
  };
  const handleDiscardCloseDialog = (e) => {
    // e.preventDefault();
    setDiscardDialog(false);
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

    const sameNameCustomersInvoice = dataInvoice.filter(
      (item) => item.cust_name === custName
    );
    setSameCustomerData(sameNameCustomers);
    setSameCustomerInvoiceData(sameNameCustomersInvoice);
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

    const sameNameSalesExecutiveInvoice = dataInvoice.filter(
      (item) => item.sales_person_name === salesEName
    );

    setSameSalesExecutiveData(sameNameSalesExecutive);
    setSameSalesExecutiveInvoiceData(sameNameSalesExecutiveInvoice);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };
  // Total base amount:-
  const baseAmountTotal = filterData.reduce(
    (total, item) => total + parseFloat(item.base_amount),
    0
  );

  // Edit Action Field
  const handleOpenEditFieldAction = (id, date) => {
    setSaleBookingId(id);
    setEditActionDialog(true);
    setInvoiceMngDate(date);
  };
  const handleCloseEditFieldAction = () => {
    setEditActionDialog(false);
  };
  // handle submit  function for updating fields
  const handleInvoiceEditFields = async () => {
    const formData = new FormData();
    // const moment = require("moment");

    formData.append("sale_booking_id", saleBookingId);
    formData.append("loggedin_user_id", 36);
    formData.append("invoiceFormSubmit", 1);
    formData.append("invoice_mnj_number", invcNumber);
    formData.append("invoice_mnj_date", moment(invcDate).format("YYYY/MM/DD"));
    formData.append("party_mnj_name", partyInvoiceName);
    formData.append("invoice", imageInvoice);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=invoice_upload_file",
        formData
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      )
      .then((res) => {
        handleCloseEditFieldAction();
        toastAlert("Fields Updated Successfully");
        getDataInvoiceCreated();
      });
  };
  // =========================================
  const sameSalesExecutivecolumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...sameSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "sales_person_username",
      headerName: "Sales Person Name",
      renderCell: (params) => params.row.sales_person_username,
    },

    {
      field: "sale_booking_date",
      headerName: "Requested On Date",
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      field: "description",
      fieldName: "Sale Booking Description",
      renderCell: (params) => params.row.description,
    },
    {
      field: "cust_name",
      fieldName: "Customer Name",
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
      field: "invoice_particular_name",
      headerName: "Invoice Particular Name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "invoice_type_name",
      headerName: "Invoice Type",
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      field: "base_amount",
      headerName: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      fieldName: "gst_amount",
      field: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "net_amount",
      headerName: "Net Amount",
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
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "sales_person_username",
      headerName: "Sales Person Name",
      renderCell: (params) => (
        <a
          href="#"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() =>
            handleOpenSameSalesExecutive(params.row.sales_person_username)
          }
        >
          {params.row.sales_person_username}
        </a>
      ),
    },

    {
      field: "sale_booking_date",
      headerName: "Requested On Date",
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      field: "description",
      headerName: "Sale Booking Description",
      renderCell: (params) => params.row.description,
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
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
              className="d-block"
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
      field: "invoice_particular_name",
      headerName: "Invoice Particular Name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "invoice_type_name",
      fieldName: "Invoice Type",
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      field: "base_amount",
      fieldName: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "net_amount",
      headerName: "Net Amount",
      renderCell: (params) => params.row.net_amount,
    },
  ];
  const sameCustomercolumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...sameCustomerData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "sales_person_username",
      headerName: "Sales Person Name",
      renderCell: (params) => params.row.sales_person_username,
    },

    {
      field: "sale_booking_date",
      headerName: "Requested On Date",
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      field: "description",
      headerName: "Sale Booking Description",
      renderCell: (params) => params.row.description,
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
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
      field: "invoice_particular_name",
      headerName: "Invoice Particular Name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "invoice_type_name",
      headerName: "Invoice Type",
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      field: "base_amount",
      headerName: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "net_amount",
      headerName: "Net Amount",
      renderCell: (params) => params.row.net_amount,
    },
    // {
    //   field: "Action",
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
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      field: "sales_person_username",
      headerName: "Sales Person Name",
      renderCell: (params) => params.row.sales_person_username,
    },

    {
      field: "sale_booking_date",
      headerName: "Requested On Date",
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      field: "description",
      headerName: "Sale Booking Description",
      renderCell: (params) => params.row.description,
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      renderCell: (params) => (
        <a
          href="#"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}
        </a>
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
      field: "invoice_particular_name",
      headerName: "Invoice Particular Name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "invoice_type_name",
      headerName: "Invoice Type",
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      field: "base_amount",
      headerName: "Base Amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "net_amount",
      headerName: "Net Amount",
      renderCell: (params) => params.row.net_amount,
    },
    // {
    //   field: "Action",
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
  const handlePartyNameKeyDown = (e, params) => {
    if (e.key === " " && params.value.trim().endsWith(" ")) {
      e.preventDefault();
    }
  };

  const columns = [
    {
      width: 60,
      headerName: "S.No",
      field: "s_no",
      renderCell: (params, index) => (
        <div>{[...filterData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      headerName: "Sales Person name",
      field: "sales_person_username",
      width: 220,
      renderCell: (params) => params.row.sales_person_username,
      height: "200px",
    },
    {
      headerName: " Requested On",
      field: "invoice_requested_date",
      width: 220,
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.invoice_requested_date),
    },
    {
      headerName: "Sale Booking Date",
      field: "sale_booking_date",
      width: 220,
      renderCell: (params) =>
        convertDateToDDMMYYYY(params.row.sale_booking_date),
    },
    {
      headerName: "Sale Booking Description",
      field: "description",
      width: 220,
      renderCell: (params) => params.row.description,
    },
    {
      headerName: "Customer Name",
      field: "cust_name",
      width: 220,
      renderCell: ({ row }) => (
        <>
          <Link
            className="text-primary"
            to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}
          >
            {row.cust_name}
          </Link>
        </>
      ),
    },
    {
      field: "invoice_mnj_number",
      headerName: "Invoice No.",
      width: 200,
      renderCell: (params) => (
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
      ),
    },
    {
      field: "invoice_mnj_date",
      headerName: "Invoice Date",
      width: 200,
      renderCell: (params) => (
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
      ),
    },
    {
      field: "party_mnj_name",
      headerName: "Party Name",
      width: 200,
      renderCell: (params) => (
        <TextField
          key={params.row.sale_booking_id}
          type="text"
          name="input"
          variant="outlined"
          label="Party Name"
          sx={{
            marginBottom: "1px",
            "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
              padding: "12px ",
            },
          }}
          onChange={(e) => setPartyName(e.target.value)}
          // onKeyDown={(e) => handlePartyNameKeyDown(e, params)}
        />
      ),
    },
    {
      field: "Upload Invoice",
      headerName: "Upload Invoice",
      width: 480,
      renderCell: (params, index) => (
        <div key={params.row.sale_booking_id} className="d-flex">
          <form>
            <input
              key={index}
              type="file"
              name="upload_image"
              className="w-70"
              onChange={(e) => setFileUpload(e.target.files[0])}
            />
          </form>
          <br />
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleImageUpload(params.row)}
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-success ms-3"
            onClick={(e) => handleDiscardOpenDialog(e, params.row)}
          >
            Reject
          </button>
        </div>
      ),
    },
    {
      headerName: "Invoice Particular Name",
      field: "invoice_particular_name",
      width: 200,
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "po_file",
      headerName: "PO File",
      width: 210,
      renderCell: (params) => {
        // Extract file extension and check if it's a PDF
        const fileExtension = params.row.po_file.split(".").pop().toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://sales.creativefuel.io/${params.row.po_file}`;

        return isPdf ? (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={pdf}
            style={{ width: "40px", height: "40px" }}
            title="PDF Preview"
          />
        ) : (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={imgUrl}
            alt="Invoice"
            style={{ width: "100px", height: "100px" }}
          />
        );
      },
    },
    {
      field: "po_number",
      headerName: "PO Number",
      width: 210,
      renderCell: (params) => params.row.po_number,
    },
    {
      headerName: "Invoice Type",
      field: "invoice_type_name",
      width: 180,
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      headerName: "Base Amount",
      field: "base_amount",
      width: 180,
      renderCell: (params) => params.row.base_amount,
    },
    {
      headerName: "GST Amount",
      field: "gst_amount",
      width: 180,
      renderCell: (params) => params.row.gst_amount,
    },
    {
      headerName: "Net Amount",
      field: "net_amount",
      width: 180,
      renderCell: (params) => params.row.net_amount,
    },
  ];

  console.log(filterData, "filterData------------------------ ");

  return (
    <div>
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

      {/* Edit Action Field */}
      <Dialog
        open={editActionDialog}
        onClose={handleCloseEditFieldAction}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Edit Fields</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseEditFieldAction}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="row">
            <TextField
              type="text"
              name="input"
              label="Invoice No."
              onChange={(e) => setInvcNumber(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                className="mt-3"
                defaultValue={dayjs()}
                onChange={(e) => {
                  setInvcDate(e);
                }}
              />
            </LocalizationProvider>
            <TextField
              type="text"
              name="input"
              label="Party Name"
              className="mt-3"
              onChange={(e) => setPartyInvoiceName(e.target.value)}
            />

            <input
              type="file"
              name="upload_image"
              className="mt-3"
              onChange={(e) => setImageInvoice(e.target.files[0])}
            />

            <Button
              type="button"
              className="mt-3"
              variant="contained"
              onClick={handleInvoiceEditFields}
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog For Discard */}
      <Dialog
        open={discardDialog}
        onClose={handleDiscardCloseDialog}
        fullWidth={true}
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>TDS</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDiscardCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <TextField
            multiline
            label="Reason for Discard"
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
          <div className="pack w-100 mt-3 sb">
            <div></div>
            <div className="pack gap16">
              <Button variant="contained" onClick={(e) => handleReject(e)}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={sameSalesExecutiveData}
            columns={sameSalesExecutivecolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => sameSalesExecutiveData.indexOf(row)}
          />
        </DialogContent>
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
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={uniqueSalesExecutiveData}
            columns={uniqueSalesExecutivecolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
          />
        </DialogContent>
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
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={sameCustomerData}
            columns={sameCustomercolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => sameCustomerData.indexOf(row)}
          />
        </DialogContent>
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
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <DataGrid
            rows={uniqueCustomerData}
            columns={uniqueCustomercolumn}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => uniqueCustomerData.indexOf(row)}
          />
        </DialogContent>
      </Dialog>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Search by filter</h5>
            </div>
            <div className="card-body pb4">
              <div className="row thm_form">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Sales Person Name</label>
                    <Autocomplete
                      value={salesPersonName}
                      onChange={(event, newValue) =>
                        setSalesPersonName(newValue)
                      }
                      options={Array.from(
                        new Set(
                          datas.map((option) => option.sales_person_username)
                        )
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
              </div>
            </div>
            <div className="card-footer">
              <div className="flexCenter colGap16">
                <Button
                  variant="contained"
                  onClick={handleAllFilters}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllFilter}
                  className="btn cmnbtn btn-secondary"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body thm_table p0">
              <div className="tab-content">
                <DataGrid
                  rows={filterData}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  autoHeight
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  state={{
                    keyboard: {
                      cell: null,
                      columnHeader: null,
                      isMultipleKeyPressed: false,
                    },
                  }}
                  getRowId={(row) => filterData.indexOf(row)}
                />
                {openImageDialog && (
                  <ImageView
                    viewImgSrc={viewImgSrc}
                    setViewImgDialog={setOpenImageDialog}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingInvoice;
