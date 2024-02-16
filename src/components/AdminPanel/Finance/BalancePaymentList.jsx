import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { Alert, Autocomplete, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { baseUrl } from "../../../utils/config";
import pdfImg from "./pdf-file.png";
import ImageView from "./ImageView";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const BalancePaymentList = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [balAmount, setBalAmount] = useState("");
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [paymentRefImg, setPaymentRefImg] = useState("");
  const [paymentType, setPaymentType] = useState({ label: "", value: "" });
  const [paymentDetails, setPaymentDetails] = useState("");
  const [singleRow, setSingleRow] = useState({});
  const [dropdownData, setDropDownData] = useState([]);
  const [paidAmount, setPaidAmount] = useState([]);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [viewImgDialog, setViewImgDialog] = useState(false);
  const [paymentDate, setPaymentDate] = useState(dayjs(new Date()));
  const [customerName, setCustomerName] = useState("");
  const [salesExecutiveName, setSalesExecutiveName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setCampaignAmountField] = useState("");
  const [balanceAmountFilter, setBalanceAmountFilter] = useState("");
  const [balanceAmountField, setBalanceAmountField] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const DateFormateToYYYYMMDD = (date) => {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${ye}-${mo}-${da}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", +singleRow.sale_booking_id);
    formData.append("payment_update_id", "");
    formData.append("payment_ref_no", paymentRefNo);
    formData.append("payment_detail_id", paymentDetails.value);
    formData.append("payment_screenshot", paymentRefImg);
    formData.append("payment_type", paymentType.label);
    formData.append("payment_mode", "others");
    formData.append("paid_amount", paidAmount);

    //     // sale_booking_id:161
    //     payment_update_id:
    //     payment_ref_no:Axispo444385821
    //     payment_detail_id:43
    //     loggedin_user_id:36
    //     paid_amount:54000
    //     payment_type:Partial
    //     payment_mode:Others
    //     payment_screenshot

    //     sale_booking_id:161
    // payment_update_id:
    // payment_ref_no:Axispo444385821
    // payment_detail_id:43
    // loggedin_user_id:36
    // paid_amount:54000
    // payment_type:Partial
    // payment_mode:Others

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=balance_payment_update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        axios
          .put(baseUrl + "balance_payment_list_update", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            getData();
            setBalAmount("");
            setPaymentRefNo("");
            setPaymentRefImg("");
            setPaymentType({ label: "", value: "" });
            setPaymentDetails("");
            setPaidAmount([]);
          });
      });
    setImageModalOpen(false);

    toastAlert("Data updated");
    setIsFormSubmitted(true);
    setImageModalOpen(false);
  };

  function getData() {
    axios.post(baseUrl + "add_php_payment_bal_data_in_node").then(() => {});
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-balance_payment_list",
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
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const getDropdownData = async () => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    const response = await axios.post(
      "https://sales.creativefuel.io/webservices/RestController.php?view=sales-payment_account_list",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const responseData = response.data.body;
    setDropDownData(responseData);
  };

  useEffect(() => {
    getDropdownData();
  }, []);

  const handleImageClick = (row) => {
    setBalAmount(row.campaign_amount - row.total_paid_amount);
    setSingleRow(row);
    setImageModalOpen(true);
  };

  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setBalAmount("");
    setPaymentRefNo("");
    setPaymentRefImg("");
    setPaymentType({ label: "", value: "" });
    setPaymentDetails("");
    setPaidAmount([]);
  };

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
      // sales Booking Date Range Filter:-
      const salesBookingdateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.cust_name.toLowerCase().includes(customerName.toLowerCase());
      // sales Executive Name Filter:-
      const salesExecutiveNameFilterPassed =
        !salesExecutiveName ||
        item.username.toLowerCase().includes(salesExecutiveName.toLowerCase());

      //  Campaign Amount Filter
      const campaignAmountFilterPassed = () => {
        const campaignAmount = parseFloat(campaignAmountField);
        switch (campaignAmountFilter) {
          case "greaterThan":
            return +item.campaign_amount > campaignAmount;
          case "lessThan":
            return +item.campaign_amount < campaignAmount;
          case "equalTo":
            return +item.campaign_amount === campaignAmount;
          default:
            return true;
        }
      };
      //  Balance Amount Filter
      const balanceAmountFilterPassed = () => {
        const balanceAmount = parseFloat(balanceAmountField);
        const balance = +item.campaign_amount - item.total_paid_amount;
        switch (balanceAmountFilter) {
          case "greaterThan":
            return +balance > balanceAmount;
          case "lessThan":
            return +balance < balanceAmount;
          case "equalTo":
            return +balance === balanceAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        customerNameFilterPassed &&
        salesExecutiveNameFilterPassed &&
        salesBookingdateFilterPassed &&
        campaignAmountFilterPassed() &&
        balanceAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setSalesExecutiveName("");
    setCampaignAmountFilter("");
    setCampaignAmountField("");
    setBalanceAmountFilter("");
    setBalanceAmountField("");
  };
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "7%",
      sortable: true,
    },
    {
      name: "Aging",
      cell: (row) => {
        const date = new Date(row.sale_booking_date);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + " Days";
      },

    }
    ,
    {
      name: "Customer Name",
      selector: (row) => row.cust_name,
      sortable: true,
    },
    {
      name: "Sales Executive Name",
      selector: (row) => row.username,
    },
    {
      name: "Sale Booking Date",
      // selector: (row) => row.sale_booking_date,
      cell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {convertDateToDDMMYYYY(row.sale_booking_date)}
        </div>
      ),
    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
    },
    {
      name: "Paid Amount",
      // selector: (row) => row.total_paid_amount,
      cell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {row.total_paid_amount ? row.total_paid_amount : 0}
        </div>
      ),
    },
    {
      name: "Balance Amount",
      selector: (row) => row.campaign_amount - row.total_paid_amount,
    },
    {
      name: "Screen Shot",
      cell: (row) =>
        row.invoice ? (
          row.invoice.includes(".pdf") ? (
            <img
              src={pdfImg}
              onClick={() => {
                setViewImgSrc(
                  row.invoice
                    ? `https://sales.creativefuel.io/${row.invoice}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
            />
          ) : (
            <img
              onClick={() => {
                setViewImgSrc(
                  row.invoice
                    ? `https://sales.creativefuel.io/${row.invoice}`
                    : ""
                ),
                  setViewImgDialog(true);
              }}
              src={`https://sales.creativefuel.io/${row.invoice}`}
              alt="payment screenshot"
              style={{ width: "50px", height: "50px" }}
            />
          )
        ) : (
          "No Image"
        ),
    },
    {
      name: "Status",
      cell: (row) => (
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleImageClick(row)}
        >
          Balance Update
        </button>
      ),
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Sale Booking - Outstanding Payment"
        link="/admin/balance-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />

      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Customer Name</label>
            <Autocomplete
              value={customerName}
              onChange={(event, newValue) => setCustomerName(newValue)}
              options={datas.map((option) => option.cust_name)}
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
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Sales Executive Name</label>
            <Autocomplete
              value={salesExecutiveName}
              onChange={(event, newValue) => setSalesExecutiveName(newValue)}
              options={datas.map((option) => option.username)}
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
            <label>Campaign Amount Filter</label>
            <select
              value={campaignAmountFilter}
              className="form-control"
              onChange={(e) => setCampaignAmountFilter(e.target.value)}
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
            <label>Campaign Amount</label>
            <input
              value={campaignAmountField}
              type="number"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setCampaignAmountField(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Balance Amount Filter</label>
            <select
              value={balanceAmountFilter}
              className="form-control"
              onChange={(e) => setBalanceAmountFilter(e.target.value)}
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
            <label>Balance Amount</label>
            <input
              value={balanceAmountField}
              type="number"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setBalanceAmountField(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-1 mt-1 me-2">
          <Button variant="contained" onClick={handleAllFilters}>
            <i className="fas fa-search"></i> Search
          </Button>
        </div>
        <div className="col-md-1 mt-1">
          <Button variant="contained" onClick={handleClearAllFilter}>
            Clear
          </Button>
        </div>
      </div>
      <div className="card mt-3">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Balance payment list"
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
      <BootstrapDialog
        onClose={handleCloseImageModal}
        aria-labelledby="customized-dialog-title"
        open={ImageModalOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Payment Update
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseImageModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="row">
            <div className="col-md-12 ">
              <form onSubmit={handleSubmit}>
                <div className="form-group col-12"></div>

                <div className="form-group">
                  <label htmlFor="images">Balance Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    id="images"
                    name="images"
                    value={balAmount}
                    readOnly
                    onChange={(e) => setBalAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="images">Payment Reference Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="images"
                    name="images"
                    value={paymentRefNo}
                    onChange={(e) => setPaymentRefNo(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="images">Payment Reference Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    id="images"
                    name="images"
                    accept="image/*"
                    onChange={(e) => setPaymentRefImg(e.target.files[0])}
                  />
                </div>

                <TextField
                  variant="outlined"
                  label="Paid Amount *"
                  value={paidAmount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!isNaN(inputValue) && inputValue !== "") {
                      const parsedValue = parseFloat(inputValue);
                      if (parsedValue <= balAmount) {
                        setPaidAmount(parsedValue);
                        setPaymentType(
                          parsedValue === balAmount
                            ? { label: "Full", value: "full" }
                            : { label: "Partial", value: "partial" }
                        );
                      } else {
                        toastError(
                          "Paid amount should be less than or equal to the balance amount"
                        );
                      }
                    } else {
                      toastError("Please enter a valid numeric value");
                      setPaidAmount("");
                    }
                  }}
                />

                <Autocomplete
                  className="my-2"
                  id="combo-box-demo"
                  value={paymentType}
                  // disabled
                  readOnly
                  options={[
                    { label: "Full", value: "full" },
                    { label: "Partial", value: "partial" },
                  ]}
                  style={{ width: 180, zIndex: 1, position: "relative" }}
                  onChange={(e, value) => {
                    setPaymentType(value);
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} label="Status" variant="outlined" />
                  )}
                />

                <Autocomplete
                  className="my-2"
                  id="combo-box-demo"
                  // value={row.statusDropdown}
                  options={dropdownData.map((item) => ({
                    label: item.title,
                    value: item.id,
                  }))}
                  style={{ width: 180, zIndex: 1, position: "relative" }}
                  onChange={(e, value) => {
                    setPaymentDetails(value);
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Payment Details *"
                      variant="outlined"
                    />
                  )}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Payment Date"
                    value={paymentDate}
                    format="DD/MM/YYYY"
                    onChange={setPaymentDate}
                  />
                </LocalizationProvider>
              </form>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              paidAmount === 0 || paidAmount === "" || paymentDetails === ""
            }
            autoFocus
            onClick={handleSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {viewImgDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setViewImgDialog}
        />
      )}
    </>
  );
};

export default BalancePaymentList;
