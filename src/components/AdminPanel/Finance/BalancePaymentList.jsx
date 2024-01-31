import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import { Autocomplete, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { get } from "jquery";
import { set } from "date-fns";
import {baseUrl} from '../../../utils/config'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BalancePaymentList = () => {
  const { toastAlert,toastError } = useGlobalContext();
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
  const [paymentMode, setPaymentMode] = useState("");
  const [singleRow, setSingleRow] = useState({});
  const [dropdownData, setDropDownData] = useState([]);
  const [paidAmount, setPaidAmount] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e, row) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", +singleRow.sale_booking_id);
    formData.append("payment_update_id", singleRow.payment_update_id);
    formData.append("payment_ref_no", paymentRefNo);
    formData.append("payment_detail_id", paymentDetails.value);
    formData.append("payment_screenshot", paymentRefImg);
    formData.append("payment_type", paymentType.label);
    formData.append("payment_mode", paymentMode.label);
    formData.append("paid_amount", paidAmount);

    await axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=balance_payment_update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        axios
          .put(
            baseUrl+"balance_payment_list_update",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then(() => {
            console.log("data save in local success");
            getData();
            setBalAmount("");
            setPaymentRefNo("");
            setPaymentRefImg("");
            setPaymentType({ label: "", value: "" });
            setPaymentDetails("");
            setPaymentMode("");
            setPaidAmount([]);
          });
      });
    setImageModalOpen(false);

    toastAlert("Data updated");
    setIsFormSubmitted(true);
    setImageModalOpen(false);
  };

  function getData() {
    axios
      .post(baseUrl+"add_php_payment_bal_data_in_node")
      .then((res) => {
        console.log("data save in local success");
      });
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=sales-balance_payment_list",
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

  const handlePaidAmountChange = (e) => {
    // setPaidAmount(e.target.value);
  };

  const getDropdownData = async () => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    const response = await axios.post(
      "https://salesdev.we-fit.in/webservices/RestController.php?view=sales-payment_account_list",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const responseData = response.data.body;
    setDropDownData(responseData);
    console.log(responseData, "dropdown data");
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
    setPaymentMode("");
    setPaidAmount([]);
  };

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "7%",
      sortable: true,
    },
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
      selector: (row) => row.total_paid_amount,
    },
    {
      name: "Balance Amount",
      selector: (row) => row.campaign_amount - row.total_paid_amount,
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
        mainTitle="Sale Booking - All Balance Payment List Pending"
        link="/admin/balance-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />

      <div className="card">
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
      {/* <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
        style={{
          content: {
            width: "50%",
            height: "70%",
            top: "30%",
            // left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            position: "relative",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Balance Payment Update</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>
        </div>
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

              {/* <div className="form-group">
              <label htmlFor="images">Payment Type</label>
              <select name="payment_type" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="full">full</option>
              <option value="partial">partial</option>
            </select>
            </div> */}

      {/* <Autocomplete
              className="my-2"
              id="combo-box-demo"
              value={paymentType.label}
              options={[
                { label: "Full", value: "full" },
                { label: "Partial", value: "partial" },
              ]}
              // onChange={(e, value) => setPaymentType(value)}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} label="Payment Type" variant="outlined" />
              )}
            /> */}

      {/* <Autocomplete
        className="my-2"
        id="combo-box-demo"
        // value={row.statusDropdown}
        options={[
          { label: "Full", value: "full" },
          { label: "Partial", value: "partial" },
        ]}
        style={{ width: 180, zIndex: 1, position: "relative" }}
        // onChange={(e, value) => setPaymentType(value)}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField {...params} label="Status" variant="outlined" />
        )}
      /> */}

      {/* <Autocomplete
          className="my-2"
          id="combo-box-demo"
          // value={row.statusDropdown}
          options={[
            { label: "Approved", value: 1 },
            { label: "Rejected", value: 0 },
          ]}
          getOptionLabel={(option) => option.label}
          onChange={(e) => {
            // handleStatusChange(row, e.target.value),
              console.log(e.target.value);
          }}
          style={{ width: 180 }}
          renderInput={(params) => (
            <TextField {...params} label="Status" variant="outlined" />
          )}
        /> */}

      {/* <div className="form-group">
              <label htmlFor="images">Payment Details</label>
              <select name="payment_detail" value={paymentDetails} onChange={(e)=> setPaymentDetails(e.target.value)} required>
                <option value="">Please select</option>
                {dropdownData.map((item)=>(
                  <option value={item.id}>{item.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="images">Payment Mode</label>
              <select name="cars" value={paymentMode} onChange={(e)=> setPaymentMode(e.target.value)}>
                <option value="cash">cash</option>
                <option value="others">others</option>
              </select>
            </div> */}

      {/* <button type="submit" className="btn btn-primary">
              Submit
            </button> */}
      {/* </form>
          </div>
        </div>
      </Modal> */}

      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
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

                {/* <div className="form-group">
              <label htmlFor="images">Payment Type</label>
              <select name="payment_type" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="full">full</option>
              <option value="partial">partial</option>
            </select>
            </div> */}
                <TextField
                  variant="outlined"
                  label="Paid Amount *"
                  value={paidAmount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (!isNaN(inputValue)) {
                      const parsedValue = parseFloat(inputValue);
                      if (parsedValue <= balAmount) {
                        setPaidAmount(parsedValue);
                        setPaymentType(parsedValue === balAmount ? { label: "Full", value: "full" } : { label: "Partial", value: "partial" });
                      } else {
                        toastError("Paid amount should be less than or equal to the balance amount");
                      }
                    } else {
                      // Handle non-numeric input
                      toastError("Please enter a valid numeric value");
                    }
                  }}
                  
                />

                {/* <div className="form-group">
  <label htmlFor="paidAmount">Paid Amount</label>
  <input
    // type="number"
    className="form-control"
    id="paidAmount"
    name="paidAmount"

    value={paidAmount}
    onChange={handlePaidAmountChange}
    required
  />
</div> */}
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
                    setPaymentType(value), console.log(value);
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} label="Status" variant="outlined" />
                  )}
                />

                {/* <div className="form-group">
              <label htmlFor="images">Payment Details</label>
              <select name="payment_detail" value={paymentDetails} onChange={(e)=> setPaymentDetails(e.target.value)} required>
                <option value="">Please select</option>
                {dropdownData.map((item)=>(
                  <option value={item.id}>{item.title}</option>
                ))}
              </select>
            </div> */}

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
                    setPaymentDetails(value), console.log(value);
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

                {/* <div className="form-group">
              <label htmlFor="images">Payment Mode</label>
              <select name="cars" value={paymentMode} onChange={(e)=> setPaymentMode(e.target.value)}>
                <option value="cash">cash</option>
                <option value="others">others</option>
              </select>
            </div> */}

                <Autocomplete
                  className="my-2"
                  id="combo-box-demo"
                  // value={row.statusDropdown}
                  options={[
                    { label: "Cash", value: "cash" },
                    { label: "Others", value: "others" },
                  ]}
                  style={{ width: 180, zIndex: 1, position: "relative" }}
                  onChange={(e, value) => setPaymentMode(value)}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Payment Mode *"
                      variant="outlined"
                    />
                  )}
                />

                {/* <button type="submit" className="btn btn-primary">
              Submit
            </button> */}
              </form>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
          disabled={paidAmount === 0 || paidAmount === "" || paymentDetails === "" || paymentMode === ""}
          autoFocus onClick={handleSubmit}>
            Save 
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default BalancePaymentList;
