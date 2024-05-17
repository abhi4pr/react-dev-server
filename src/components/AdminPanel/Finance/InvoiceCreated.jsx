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

const InvoiceCreated = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(baseUrl + "", {
      display_sequence: displaySeq,
    });

    toastAlert("Coc created");
    setIsFormSubmitted(true);
  };

  function getDataInvoiceCreated() {
    axios
      .post(baseUrl + "add_php_pending_invoice_data_in_node")
      .then((res) => {});
    let formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-invoice_created_list",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setDataInvoice(res.data.body);
        setFilterDataInvoice(res.data.body);
        // For Unique Customers
        const customerData = res.data.body;
        const uniCustomers = new Set(
          customerData.map((item) => item.cust_name)
        );
        setUniqueCustomerInvoiceCount(uniCustomers.size);
        const uniqueCustData = Array.from(uniCustomers).map((customerName) => {
          return customerData.find((item) => item.cust_name === customerName);
        });
        setUniqueCustomerInvoiceData(uniqueCustData);

        // For Unique Sales Executive
        const salesExecuteiveInvoiceData = res.data.body;
        const uniqueSalesExInvoice = new Set(
          salesExecuteiveInvoiceData.map((item) => item.sales_person_name)
        );
        setUniqueSalesExecutiveInvoiceCount(uniqueSalesExInvoice.size);
        const uniqueSEInData = Array.from(uniqueSalesExInvoice).map(
          (salesEName) => {
            return salesExecuteiveInvoiceData.find(
              (item) => item.sales_person_name === salesEName
            );
          }
        );
        setUniqueSalesExecutiveInvoiceData(uniqueSEInData);
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
    getDataInvoiceCreated();
  }, []);
  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleAllInvoiceFilters = () => {
    const filterDataInvoice = dataInvoice.filter((item) => {
      // Customer Name Filter:-
      const customerNameInvoiceFilterPassed =
        !customerNameInvoice ||
        item.cust_name
          .toLowerCase()
          .includes(customerNameInvoice.toLowerCase());

      const salesPersonNameInvoiceFilterPassed =
        !salesPersonInvoiceName ||
        item.sales_person_name
          .toLowerCase()
          .includes(salesPersonInvoiceName.toLowerCase());

      const invoiceParticularNameFilterPassed =
        !invoiceParticularName ||
        (item.invoice_particular_name &&
          item.invoice_particular_name
            .toLowerCase()
            .includes(invoiceParticularName.toLowerCase()));
      // campaign amount filter:-
      const campaignAmountFilterPassed = () => {
        const campaignAmountData = parseFloat(campaignAmountInvoiceField);
        switch (campaignAmountInvoiceFilter) {
          case "greaterThan":
            return +item.campaign_amount > campaignAmountData;
          case "lessThan":
            return +item.campaign_amount < campaignAmountData;
          case "equalTo":
            return +item.campaign_amount === campaignAmountData;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        customerNameInvoiceFilterPassed &&
        salesPersonNameInvoiceFilterPassed &&
        invoiceParticularNameFilterPassed &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterDataInvoice(filterDataInvoice);
    // for customers:-
    const uniCustomers = new Set(
      filterDataInvoice.map((item) => item.cust_name)
    );
    setUniqueCustomerInvoiceCount(uniCustomers.size);
    const uniqueCustData = Array.from(uniCustomers).map((customerName) => {
      return filterDataInvoice.find((item) => item.cust_name === customerName);
    });
    setUniqueCustomerInvoiceData(uniqueCustData);
    // for sales executive :-
    const uniqueSalesExInvoice = new Set(
      filterDataInvoice.map((item) => item.sales_person_name)
    );
    setUniqueSalesExecutiveInvoiceCount(uniqueSalesExInvoice.size);
    const uniqueSEInData = Array.from(uniqueSalesExInvoice).map(
      (salesEName) => {
        return filterDataInvoice.find(
          (item) => item.sales_person_name === salesEName
        );
      }
    );
    setUniqueSalesExecutiveInvoiceData(uniqueSEInData);
  };
  const handleClearAllInvoiceFilters = () => {
    setFilterDataInvoice(dataInvoice);
    setCustomerNameInvoice("");
    setSalesPersonInvoiceName("");
    setCampaignAmountInvoiceFilter("");
    setCampaignAmountInvoiceField("");
    setInvoiceParticularName("");
    const uniCustomers = new Set(dataInvoice.map((item) => item.cust_name));
    setUniqueCustomerInvoiceCount(uniCustomers.size);
    const uniqueCustData = Array.from(uniCustomers).map((customerName) => {
      return dataInvoice.find((item) => item.cust_name === customerName);
    });
    setUniqueCustomerInvoiceData(uniqueCustData);

    const uniqueSalesExInvoice = new Set(
      dataInvoice.map((item) => item.sales_person_name)
    );
    setUniqueSalesExecutiveInvoiceCount(uniqueSalesExInvoice.size);
    const uniqueSEInData = Array.from(uniqueSalesExInvoice).map(
      (salesEName) => {
        return dataInvoice.find(
          (item) => item.sales_person_name === salesEName
        );
      }
    );
    setUniqueSalesExecutiveInvoiceData(uniqueSEInData);
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
  const campaignAmountTotal = filterData.reduce(
    (total, item) => total + parseFloat(item.campaign_amount),
    0
  );
  // accordin function:-
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
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
  //   Invoice Created Column :-
  const columnsInvoice = [
    {
      width: 60,
      headerName: "S.No",
      field: "s_no",
      renderCell: (params, index) => (
        <div>{[...filterDataInvoice].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "cust_name",
      headerName: "Customer name",
      width: 340,
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "sales_person_name",
      headerName: "Sales Person Name",
      width: 210,
      renderCell: (params) => params.row.sales_person_name,
    },
    {
      field: "invoice_particular_name",
      headerName: "Invoice Particular",
      width: 200,
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "invoice",
      headerName: "Invoice",
      width: 210,
      renderCell: (params) => {
        // Extract file extension and check if it's a PDF
        const fileExtension = params.row.invoice.split(".").pop().toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://sales.creativefuel.io/${params.row.invoice}`;

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
      field: "invoice_mnj_number",
      headerName: "Invoice Number",
      width: 200,
      renderCell: (params) => params.row.invoice_mnj_number,
    },
    {
      field: "invoice_mnj_date",
      headerName: "Invoice Date",
      width: 200,
      renderCell: (params) => params.row.invoice_mnj_date,
    },
    {
      field: "party_mnj_name",
      headerName: "Party Name",
      width: 210,
      renderCell: (params) => params.row.party_mnj_name,
    },
    {
      field: "invoice_type_name",
      headerName: "Invoice Type",
      width: 200,
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      field: "invoice_requested_date",
      headerName: "Requested Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.invoice_requested_date)}
        </div>
      ),
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      width: 210,
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      headerName: "Download Invoice",
      field: "download_invoice",
      width: 210,
      renderCell: (params) => (
        <a
          className="btn btn-primary"
          href={`https://sales.creativefuel.io/${params.row.invoice}`}
          target="_blank"
          rel="noreferrer"
          download // Add the 'download' attribute to trigger the download
        >
          Download
        </a>
      ),
    },
    // {
    //   headerName: "View Invoice",
    //   field: "invoice",
    //   width: 210,
    //   renderCell: (params) => (
    //     <button
    //       className="btn btn-primary"
    //       onClick={() => {
    //         setOpenImageDialog(true);
    //         setViewImgSrc(
    //           `https://sales.creativefuel.io/${params.row.invoice}`
    //         );
    //       }}
    //     >
    //       View
    //     </button>
    //   ),
    // },
    {
      headerName: "Remark",
      field: "invoice_remark",
      renderCell: (params) => params.row.invoice_remark,
    },
    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            onClick={() =>
              handleOpenEditFieldAction(
                params.row.sale_booking_id,
                params.row.invoice_mnj_date
              )
            }
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];
  const sameCustomercolumnInvoice = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...sameCustomerInvoiceData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      headerName: "Customer name",
      field: "cust_name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "sales_person_name",
      headerName: "Sales Person Name",
      width: 210,
      renderCell: (params) => params.row.sales_person_name,
    },
    {
      headerName: "Invoice Particular",
      field: "invoice_particular_name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      headerName: "Remark",
      field: "invoice_remark",
      renderCell: (params) => params.row.invoice_remark,
      width: "250px",
    },
  ];
  const uniqueCustomercolumnInvoice = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...uniqueCustomerInvoiceData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      headerName: "Customer name",
      field: "cust_name",
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
      field: "sales_person_name",
      headerName: "Sales Person Name",
      width: 210,
      renderCell: (params) => params.row.sales_person_name,
    },
    {
      headerName: "Invoice Particular",
      field: "invoice_particular_name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      headerName: "Download Invoice",
      field: "invoice",
      renderCell: (params) => (
        <a
          className="btn btn-primary"
          href={`https://sales.creativefuel.io/${params.row.invoice}`}
          target="_blank"
          rel="noreferrer"
          download // Add the 'download' attribute to trigger the download
        >
          Download
        </a>
      ),
    },
    {
      field: "View Invoice",
      renderCell: (params) => (
        <button
          className="btn btn-primary"
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(
              `https://sales.creativefuel.io/${params.row.invoice}`
            );
          }}
        >
          View
        </button>
      ),
    },
    {
      field: "Remark",
      fieldName: "invoice_remark",
      renderCell: (params) => params.row.invoice_remark,
      width: "250px",
    },
  ];
  const sameSalesExecutiveInvoicecolumn = [
    {
      width: 60,
      headerName: "S.No",
      field: "s_no",
      renderCell: (params, index) => (
        <div>{[...filterDataInvoice].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "cust_name",
      headerName: "Customer name",
      width: 340,
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "sales_person_name",
      headerName: "Sales Person Name",
      width: 210,
      renderCell: (params) => params.row.sales_person_name,
    },
    {
      field: "invoice_particular_name",
      headerName: "Invoice Particular",
      width: 210,
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "party_mnj_name",
      headerName: "Party Name",
      width: 210,
      renderCell: (params) => params.row.party_mnj_name,
    },
    {
      field: "invoice_type_name",
      headerName: "Invoice Type",
      width: 200,
      renderCell: (params) => params.row.invoice_type_name,
    },
    {
      field: "invoice_requested_date",
      headerName: "Requested Date",
      width: 190,
      renderCell: (params) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(params.row.invoice_requested_date)}
        </div>
      ),
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      width: 210,
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      headerName: "Download Invoice",
      field: "download_invoice",
      width: 210,
      renderCell: (params) => (
        <a
          className="btn btn-primary"
          href={`https://sales.creativefuel.io/${params.row.invoice}`}
          target="_blank"
          rel="noreferrer"
          download // Add the 'download' attribute to trigger the download
        >
          Download
        </a>
      ),
    },
    {
      headerName: "View Invoice",
      field: "invoice",
      width: 210,
      renderCell: (params) => (
        <button
          className="btn btn-primary"
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(
              `https://sales.creativefuel.io/${params.row.invoice}`
            );
          }}
        >
          View
        </button>
      ),
    },
    {
      headerName: "Remark",
      field: "invoice_remark",
      renderCell: (params) => params.row.invoice_remark,
    },
  ];
  const uniqueSalesExecutiveInvoicecolumn = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...sameSalesExecutiveInvoiceData].indexOf(params.row) + 1}</div>
      ),
    },
    {
      headerName: "Customer name",
      field: "cust_name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "sales_person_name",
      headerName: "Sales Person Name",
      renderCell: (params) => (
        <a
          href="#"
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() =>
            handleOpenSameSalesExecutive(params.row.sales_person_name)
          }
        >
          {params.row.sales_person_name}
        </a>
      ),
    },
    {
      headerName: "Invoice Particular",
      field: "invoice_particular_name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      headerName: "Campaign Amount",
      field: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      headerName: "Remark",
      field: "invoice_remark",
      renderCell: (params) => params.row.invoice_remark,
      width: "250px",
    },
  ];

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
        uniqueCustomerInvoiceCount={uniqueCustomerInvoiceCount}
        campaignAmountTotal={campaignAmountTotal}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveInvoiceCount={uniqueSalesExecutiveInvoiceCount}
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
      {/* <Dialog
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
      </Dialog> */}
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
            rows={sameSalesExecutiveInvoiceData}
            columns={sameSalesExecutiveInvoicecolumn}
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
            getRowId={(row) => sameSalesExecutiveInvoiceData.indexOf(row)}
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
            rows={uniqueSalesExecutiveInvoiceData}
            columns={uniqueSalesExecutiveInvoicecolumn}
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
            getRowId={(row) => uniqueSalesExecutiveInvoiceData.indexOf(row)}
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
            rows={sameCustomerInvoiceData}
            columns={sameCustomercolumnInvoice}
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
            getRowId={(row) => sameCustomerInvoiceData.indexOf(row)}
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
            rows={uniqueCustomerInvoiceData}
            columns={uniqueCustomercolumnInvoice}
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
            getRowId={(row) => uniqueCustomerInvoiceData.indexOf(row)}
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
                    <label>Customer Name</label>
                    <Autocomplete
                      value={customerNameInvoice}
                      onChange={(event, newValue) =>
                        setCustomerNameInvoice(newValue)
                      }
                      options={Array.from(
                        new Set(dataInvoice.map((option) => option.cust_name))
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Customer Name"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control", // Apply Bootstrap's form-control class
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Sales Person Name</label>
                    <Autocomplete
                      value={salesPersonInvoiceName}
                      onChange={(event, newValue) =>
                        setSalesPersonInvoiceName(newValue)
                      }
                      options={Array.from(
                        new Set(
                          dataInvoice.map((option) => option.sales_person_name)
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
                    <label>Invoice Particular</label>
                    <Autocomplete
                      value={invoiceParticularName}
                      onChange={(event, newValue) =>
                        setInvoiceParticularName(newValue)
                      }
                      options={Array.from(
                        new Set(
                          dataInvoice
                            .filter(
                              (option) =>
                                option &&
                                option.invoice_particular_name !== null &&
                                option.invoice_particular_name !== undefined
                            ) // Filter out null or undefined values
                            .map((option) =>
                              option.invoice_particular_name.toLowerCase()
                            ) // Convert to lowercase here
                        )
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Invoice Particular"
                          type="text"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            className: "form-control",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Campaign Amount Filter</label>
                    <select
                      value={campaignAmountInvoiceFilter}
                      className="form-control"
                      onChange={(e) =>
                        setCampaignAmountInvoiceFilter(e.target.value)
                      }
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
                    <label>Campaign Amount</label>
                    <input
                      value={campaignAmountInvoiceField}
                      type="number"
                      placeholder="Request Amount"
                      className="form-control"
                      onChange={(e) => {
                        setCampaignAmountInvoiceField(e.target.value);
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
                  onClick={handleAllInvoiceFilters}
                  className="btn cmnbtn btn-primary"
                >
                  <i className="fas fa-search"></i> Search
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClearAllInvoiceFilters}
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
                  rows={filterDataInvoice}
                  columns={columnsInvoice}
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
                  getRowId={(row) => filterDataInvoice.indexOf(row)}
                />
              </div>
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
  );
};

export default InvoiceCreated;
