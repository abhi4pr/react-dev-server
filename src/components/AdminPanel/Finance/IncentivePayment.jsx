import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import CloseIcon from "@mui/icons-material/Close";
import $ from "jquery";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const IncentivePayment = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [accountNo, setAccountNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [balanceReleaseAmount, setBalanceReleaseAmount] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState(dayjs(new Date()));
  const [paymentType, setPaymentType] = useState("Full Payment");
  const [partialPaymentReason, setPartialPaymentReason] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const DateFormateToYYYYMMDD = (date) => {
    console.log(date);
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${ye}-${mo}-${da}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .put(baseUrl + "edit_php_payment_incentive_data", {
        incentive_request_id: selectedData.incentive_request_id,
        requested_amount: selectedData.request_amount,
        payment_type: paymentType,
        reason: partialPaymentReason,
        requested_date: DateFormateToYYYYMMDD(
          selectedData.request_creation_date
        ),
        paid_amount: balanceReleaseAmount,
      })
      .then((res) => {
        console.log(res);
      });

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("incentive_request_id", selectedData.incentive_request_id);
    formData.append("account_number", accountNo);
    formData.append("remarks", remarks);
    formData.append("payment_ref_no", paymentRef);
    formData.append("sales_executive_id", selectedData.sales_executive_id);
    formData.append("release_amount", balanceReleaseAmount);
    formData.append("payment_date", DateFormateToYYYYMMDD(paymentDate));
    formData.append("payment_type", paymentType);
    formData.append("partial_payment_reason", partialPaymentReason);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=release_incentive_submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        getData();
        setModalOpen(false);
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios
      .post(baseUrl + "add_php_payment_incentive_data_in_node")
      .then(() => {});
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-incentive_request_list",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        // Set data received from the API response
        setData(res.data.body);
        setFilterData(res.data.body);

        // Calculate totals
        let totalRequestAmount = 0;
        let totalReleasedAmount = 0;
        let totalBalanceReleaseAmount = 0;

        res.data.body.forEach((row) => {
          totalRequestAmount += +row.request_amount;
          totalReleasedAmount += +row.released_amount || 0;
          totalBalanceReleaseAmount += +row.balance_release_amount;
        });

        // Create total row
        const totalRow = {
          request_amount: totalRequestAmount,
          released_amount: totalReleasedAmount,
          balance_release_amount: totalBalanceReleaseAmount,
          sales_executive_name: "Total",
        };

        // Append total row to the end of the data
        setData((prevData) => [...prevData, totalRow]);
        setFilterData((prevData) => [...prevData, totalRow]);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = useMemo(
    () => [
      {
        name: "S.No",
        cell: (row, index) => <div>{index + 1}</div>,
        width: "9%",
        sortable: true,
      },
      {
        name: "Sales executive name",
        selector: (row) =>
          row.sales_executive_name !== "Total" ? (
            <Link
              to={`/admin/Incentive-Request-Released-List/${row.incentive_request_id}`}
              className="link-primary"
            >
              {row.sales_executive_name}
            </Link>
          ) : (
            <div className="fs-6 font-bold text-black-50">
              {" "}
              {row.sales_executive_name}
            </div>
          ),
      },
      {
        name: "Requested Date & Time",
        selector: (row) =>
          row.sales_executive_name !== "Total"
            ? new Date(row.request_creation_date).toLocaleDateString("en-IN") +
              " " +
              new Date(row.request_creation_date).toLocaleTimeString("en-IN")
            : null,
        width: "15%",
      },
      {
        name: "Request Amount",
        selector: (row) =>
          row.sales_executive_name !== "Total" ? (
            row.request_amount
          ) : (
            <div className="fs-6 font-bold text-black-50">
              {" "}
              {row.request_amount}
            </div>
          ),
      },
      {
        name: "Released Amount",
        selector: (row) =>
          row.sales_executive_name !== "Total" ? (
            <Link
              to={`/admin/Incentive-Request-Released-List/${row.incentive_request_id}`}
              className="link-primary"
            >
              {row.released_amount
                ? row.released_amount?.toLocaleString("en-IN")
                : 0}
            </Link>
          ) : (
            <div className="fs-6 font-bold text-black-50">
              {row.released_amount?.toLocaleString("en-IN")}
            </div>
          ),
      },
      {
        name: "Balance Release Amount",
        selector: (row) =>
          row.sales_executive_name !== "Total" ? (
            row.balance_release_amount?.toLocaleString("en-IN")
          ) : (
            <div className="fs-6 font-bold text-black-50">
              {row.balance_release_amount}
            </div>
          ),
      },
      {
        name: "Status",
        selector: (row) => {
          return row.action == "Complete Release Button" ? (
            <button
              className="btn btn-sm btn-outline-info"
              data-toggle="modal"
              data-target="#incentiveModal"
              onClick={() => {
                setSelectedData(row),
                  setBalanceReleaseAmount(row.balance_release_amount);
                setAccountNo("");
                setRemarks("");
                setModalOpen(true);
              }}
            >
              Complete Release
            </button>
          ) : (
            <span>{row.action}</span>
          );
        },
        width: "15%",
      },
      {
        name: "Aging",
        selector: (row) => {
          const currentDate = new Date(
            row.action == "Complete Release Button"
              ? new Date()
              : row.request_creation_date
          );
          const requestedDate = new Date(
            row.action == "Complete Release Button"
              ? row.request_creation_date
              : row.payment_date
          );
          const diffTime = Math.abs(currentDate - requestedDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return row.sales_executive_name !== "Total" ? diffDays : null;
        },
      },
    ],
    []
  );

  const handlePendingFilterData = () => {
    const result = datas.filter((d) => {
      return d.action == "Complete Release Button";
    });

    let totalRequestAmount = 0;
    let totalReleasedAmount = 0;
    let totalBalanceReleaseAmount = 0;

    result.forEach((row) => {
      totalRequestAmount += +row.request_amount;
      totalReleasedAmount += +row.released_amount || 0;
      totalBalanceReleaseAmount += +row.balance_release_amount;
    });

    // Create total row
    const totalRow = {
      request_amount: totalRequestAmount,
      released_amount: totalReleasedAmount,
      balance_release_amount: totalBalanceReleaseAmount,
      sales_executive_name: "Total",
    };

    console.log(result, "result");
    setFilterData([...result, totalRow]);
  };

  const handleCompleteFilterData = () => {
    const result = datas.filter((d) => {
      return d.action == "Released";
    });

    let totalRequestAmount = 0;
    let totalReleasedAmount = 0;
    let totalBalanceReleaseAmount = 0;

    result.forEach((row) => {
      totalRequestAmount += +row.request_amount;
      totalReleasedAmount += +row.released_amount || 0;
      totalBalanceReleaseAmount += +row.balance_release_amount;
    });

    // Create total row
    const totalRow = {
      request_amount: totalRequestAmount,
      released_amount: totalReleasedAmount,
      balance_release_amount: totalBalanceReleaseAmount,
      sales_executive_name: "Total",
    };
    console.log(result, "resultComplete");
    setFilterData([...result, totalRow]);
  };

  useEffect(() => {
    balanceReleaseAmount * 1 + selectedData.released_amount * 1 ==
    selectedData.request_amount
      ? setPaymentType("Full Payment")
      : setPaymentType("Partial Payment");
    setPartialPaymentReason("");
  }, [balanceReleaseAmount]);

  return (
    <>
      <FormContainer
        mainTitle="Sales Executive Incentive Request List"
        link="/admin/incentive-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />

      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <DialogTitle>Balance Release</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setModalOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label>Request Amount</label>
            <input
              type="number"
              className="form-control"
              value={selectedData.request_amount}
              readOnly
            />

            <label>Balance To Release</label>
            <input
              type="number"
              className="form-control"
              value={
                selectedData.balance_release_amount
                  ? selectedData.balance_release_amount
                  : 0
              }
              readOnly
            />

            <label>
              Paid Amount <sup className="text-danger">*</sup>
            </label>
            <input
              className="form-control"
              id="images"
              name="images"
              required
              // type="number"
              value={balanceReleaseAmount}
              onChange={(e) => {
                const enteredValue = e.target.value;

                // Check if the value is a non-empty string and a valid number
                if (enteredValue !== "" && !isNaN(enteredValue)) {
                  const numericValue = parseFloat(enteredValue);

                  // Check if the numeric value is within the allowed range
                  if (numericValue <= selectedData.balance_release_amount) {
                    setBalanceReleaseAmount(numericValue);
                  } else {
                    // Handle the case where the value exceeds the maximum
                    toastError(
                      `Please enter a valid amount that does not exceed the maximum limit ${selectedData.balance_release_amount}.`
                    );
                    setBalanceReleaseAmount("");
                  }
                } else {
                  // Reset if the input is not a valid number
                  setBalanceReleaseAmount("");
                }
              }}
            />

            <label> Payment Type</label>
            <input
              className="form-control"
              type="text"
              value={paymentType}
              readOnly
            />

            {paymentType === "Partial Payment" && (
              <div>
                <label>
                  Partial Payment Reason <sup className="text-danger">*</sup>
                </label>
                <Autocomplete
                  placeholder="Partial Payment Reason"
                  disablePortal
                  value={partialPaymentReason}
                  onChange={(e, value) => setPartialPaymentReason(value)}
                  options={[
                    "Fund Management",
                    "Tax Deduction",
                    "Bad Depth Adjustment",
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={paymentType === "Partial Payment"}
                    />
                  )}
                />
              </div>
            )}

            <label>
              Last 4 digit of account Number{" "}
              <sup className="text-danger">*</sup>
            </label>
            <input
              type="number"
              className="form-control"
              id="images"
              name="images"
              value={accountNo}
              onChange={(e) => {
                return e.target.value.length <= 4
                  ? setAccountNo(e.target.value)
                  : toastError("Please enter valid account number");
              }}
              required
            />
            <label>Payment ref number </label>
            <input
              type="number"
              className="form-control"
              id="images"
              name="images"
              value={accountNo}
              onChange={(e) => setPaymentRef(e.target.value)}
              required
            />
            <label>Remarks</label>
            <input
              type="text"
              className="form-control"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={paymentDate}
                className="mt-3 w-100 mb"
                format="DD/MM/YYYY"
                onChange={(e) => setPaymentDate(e)}
                label="Payment Date"
              />
            </LocalizationProvider>
            <button
              type="submit"
              className="btn btn-primary d-block"
              style={{ marginTop: "15px" }}
            >
              Submit
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="card">
        <div className="data_tbl table-responsive">
          <div>
            <div className="float-end">
              <Button
                variant="contained"
                color="error"
                onClick={() => getData()}
              >
                Refresh
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                className="me-2"
                onClick={handlePendingFilterData}
              >
                Pending
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleCompleteFilterData}
              >
                Completed
              </Button>
            </div>
          </div>
          <DataTable
            title="Sales Executive Incentive Request List"
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

export default IncentivePayment;
