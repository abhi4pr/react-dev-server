import  {  useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Autocomplete,
  Button,
  TextField,
} from "@mui/material";
import classes from "./FinanceDashboard.module.css";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import InfoIcon from '@mui/icons-material/Info';
import {baseUrl} from '../../../../utils/config'

const filterOptions = [
  "Today",
  "Current Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 1 Year",
  "Custom Date",
]; // Mapping the array to the required format

export default function FinanceDashboard() {
  const [vendorCardData, setVendorCardData] = useState([]);
  const [pendingForApprovalData, setPendingForApprovalData] = useState([]);
  const [refundReqData, setRefundReqData] = useState([]);
  const [cstPaymentData, setCstPaymentData] = useState([]);
  const [invoicePending, setInvoicePending] = useState([]);
  const [salesBookingAboutToCloseData, setSalesBookingAboutToCloseData] =
    useState([]);
  const [salesBookingOpenData, setSalesBookingOpenData] = useState([]);
  const [salesBookingCloseData, setSalesBookingCloseData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [filterPendingForApprovalData, setFilterPendingForApprovalData] =
    useState([]);
  const [filterRefundReqData, setFilterRefundReqData] = useState([]);
  const [filterCstPaymentData, setFilterCstPaymentData] = useState([]);
  const [filterInvoicePending, setFilterInvoicePending] = useState([]);
  const [
    filterSalesBookingAboutToCloseData,
    setFilterSalesBookingAboutToCloseData,
  ] = useState([]);
  const [filterSalesBookingOpenData, setFilterSalesBookingOpenData] = useState(
    []
  );
  const [filterSalesBookingCloseData, setFilterSalesBookingCloseData] =
    useState([]);
  const [filterVendorCardData, setFilterVendorCardData] = useState([]);
  const [filterValue, setFilterValue] = useState();
  const [payoutData, setPayoutData] = useState([]);
  const [filterPayoutData, setFilterPayoutData] = useState([]);
  const [incentiveData, setIncentiveData] = useState([]);
  const [incentiveFilterData, setIncentiveFilterData] = useState([]);

const handleResetClick = () => {
  setFilterValue();
  setStartDate(dayjs());
  setEndDate(dayjs(new Date()));
  setPendingForApprovalData(filterPendingForApprovalData);
  setRefundReqData(filterRefundReqData);
  setCstPaymentData(filterCstPaymentData);
  setInvoicePending(filterInvoicePending);
  setSalesBookingAboutToCloseData(filterSalesBookingAboutToCloseData);
  setSalesBookingOpenData(filterSalesBookingOpenData);
  setSalesBookingCloseData(filterSalesBookingCloseData);
  setVendorCardData(filterVendorCardData);
}


  const callApi = () => {
    axios
      .get(baseUrl+"phpvendorpaymentrequest")
      .then((res) => {
        const x = res.data.modifiedData;

        axios
          .get(
            "https://production.we-fit.in/webservices/RestController.php?view=getpaymentrequest"
          )
          .then((res) => {
            let y = x.filter((item) => {
              if (item.status == 1) {
                return item;
              }
            });
            let u = res.data.body.filter((item) => {
              return y.some((item2) => item.request_id == item2.request_id);
            });
            setFilterVendorCardData(u);
            setVendorCardData(u);
          });
      });

    axios
      .post(baseUrl+"add_php_finance_data_in_node")
      .then(() => {
        console.log("data save in local success");
      });
    axios
      .get(baseUrl+"get_all_php_finance_data_pending")
      .then((res) => {
        setFilterPendingForApprovalData(res.data.data);
        setPendingForApprovalData(res.data.data);
      });

    axios
      .post(baseUrl+"add_php_payment_refund_data_in_node")
      .then(() => {
        console.log("data save in local success");
      });
    setTimeout(() => {
      axios
        .get(
          baseUrl+"get_all_php_payment_refund_data_pending"
        )
        .then((res) => {
          setFilterRefundReqData(res.data.data);
          setRefundReqData(res.data.data);
        });
    }, 1000);

    axios
      .post(baseUrl+"add_php_payment_bal_data_in_node")
      .then(() => {
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
        setFilterCstPaymentData(res.data.body);
        console.log(res.data.body.length, "cst pay link");
        setCstPaymentData(res.data.body);
      });

    axios
      .post(
        baseUrl+"add_php_pending_invoice_data_in_node"
      )
      .then(() => {
        console.log("data save in local success");
      });
    const formDataa = new FormData();
    formDataa.append("loggedin_user_id", 36);
    axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=sales-pending_invoice_creation_list",
        formDataa,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setFilterInvoicePending(res.data.body);
        setInvoicePending(res.data.body);
      });

    axios
      .post(
        baseUrl+"add_php_sale_booking_tds_data_in_node"
      )
      .then(() => {
        console.log("data save in local success");
      });
    let formDataSalesbookingAboutToClose = new FormData();
    formDataSalesbookingAboutToClose.append("loggedin_user_id", 36);
    formDataSalesbookingAboutToClose.append("tds_status", 0);
    formDataSalesbookingAboutToClose.append("about_to_close", 1);

    axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=sales-sale_booking_for_tds",
        formDataSalesbookingAboutToClose,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        const allData = res.data.body;
        setFilterSalesBookingAboutToCloseData(allData);
        setSalesBookingAboutToCloseData(allData);
      });

    let formDataSalesbookingOpen = new FormData();
    formDataSalesbookingOpen.append("loggedin_user_id", 36);
    formDataSalesbookingOpen.append("tds_status", 0);

    axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=sales-sale_booking_for_tds",
        formDataSalesbookingOpen,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        const allData = res.data.body;
        setFilterSalesBookingOpenData(allData);
        setSalesBookingOpenData(allData);
      });

    let formDataSalesbookingClose = new FormData();
    formDataSalesbookingClose.append("loggedin_user_id", 36);
    formDataSalesbookingClose.append("tds_status", 1);

    axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=sales-sale_booking_for_tds",
        formDataSalesbookingClose,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        const allData = res.data.body;
        setFilterSalesBookingCloseData(allData);
        setSalesBookingCloseData(allData);
      });

      try {
        axios.get(`${baseUrl}`+`get_finances`).then((res) => {
          const response = res.data;
          setFilterPayoutData(response);
          setPayoutData(response);
        });
      } catch (error) {
        console.log(error);
      }


      axios
      .post(
        baseUrl+"add_php_payment_incentive_data_in_node"
      )
      .then(() => {
        console.log("data save in local success");
      });
    const formDataIncentive = new FormData();
    formDataIncentive.append("loggedin_user_id", 36);
    axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=sales-incentive_request_list",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setIncentiveFilterData(res.data.body);
        setIncentiveData(res.data.body);
      });

  };

  useEffect(() => {
    callApi();
  }, []);

  const handleFilterChange = (e) => {
    setFilterValue(e);
    const filterValue = e;

    let startFilterDate;
    let endFilterDate = new Date(); // Use a new date object for the end date

    switch (filterValue) {
      case "Today":
        startFilterDate = new Date();
        startFilterDate.setHours(0, 0, 0, 0); // Set to the start of the day
        endFilterDate.setHours(23, 59, 59, 999); // Set to the end of the day
        break;
      case "Current Month":
        startFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth(),
          1
        );
        endFilterDate = new Date();
        break;
      case "Last Month":
        startFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth() - 1,
          1
        );
        endFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth(),
          0
        );
        break;
      case "Last 3 Months":
        startFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth() - 2,
          1
        );
        endFilterDate = new Date();
        break;
      case "Last 6 Months":
        startFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth() - 5,
          1
        );
        endFilterDate = new Date();
        break;
      case "Last 1 Year":
        startFilterDate = new Date(
          endFilterDate.getFullYear() - 1,
          endFilterDate.getMonth(),
          1
        );
        endFilterDate = new Date();
        break;
        case "search":
          console.log(new Date(startDate), new Date(endDate));
          startFilterDate = new Date(startDate);
          endFilterDate = new Date(endDate);
          break;
      default:
      case "Custom Date":
        return;

     
    }

    const filteredData = filterPendingForApprovalData.filter((item) => {
      const itemDate = new Date(item.creation_date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });
    setPendingForApprovalData(filteredData);

    const filteredData1 = filterRefundReqData.filter((item) => {
      const itemDate = new Date(item.creation_date);
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });
    console.log(filteredData1);
    setRefundReqData(filteredData1);

    const filteredData2 = filterCstPaymentData.filter((item) => {
      const itemDate = new Date(item.sale_booking_date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setCstPaymentData(filteredData2);

    const filteredData3 = filterInvoicePending.filter((item) => {
      const itemDate = new Date(item.creation_date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setInvoicePending(filteredData3);

    const filteredData4 = filterSalesBookingAboutToCloseData.filter((item) => {
      const itemDate = new Date(item.booking_created_date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setSalesBookingAboutToCloseData(filteredData4);

    const filteredData5 = filterSalesBookingOpenData.filter((item) => {
      const itemDate = new Date(item.booking_created_date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setSalesBookingOpenData(filteredData5);

    const filteredData6 = filterSalesBookingCloseData.filter((item) => {
      const itemDate = new Date(item.booking_created_date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setSalesBookingCloseData(filteredData6);

    const filteredData7 = filterVendorCardData.filter((item) => {
      const itemDate = new Date(item.request_date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setVendorCardData(filteredData7);
    const filterData8 = filterPayoutData.filter((item) => {
      const itemDate = new Date(item.date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });
    setPayoutData(filterData8);

    const filterData9 = incentiveFilterData.filter((item) => {
      const itemDate = new Date(item.request_creation_date);
      // console.log(itemDate , startFilterDate, endFilterDate)
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });
    setIncentiveData(filterData9);
  };



  return (
    <div>
      <FormContainer
        mainTitle="Finance Dashboard"
        link="/admin/finance-dashboard"
      />

      <div className="row">
        <Autocomplete
          className="col-3"
          disablePortal
          value={filterValue}
          id="combo-box-demo"
          options={filterOptions}
          onChange={(event, value) => {
            handleFilterChange(value);
          }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Filter" />}
        />

        {filterValue === "Custom Date" && (
          <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="col-3"
              label="Start Date"
              format="DD/MM/YYYY"
              disableFuture
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
            />

            <DatePicker
              className="col-3 mx-2"
              label="End Date"
              format="DD/MM/YYYY"
              value={endDate}
              shouldDisableDate={(day) => dayjs(day).isBefore(startDate)}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
            />
          </LocalizationProvider>
          <Button
          variant="contained"
          className="col-1"
          onClick={() => handleFilterChange("search")}
        >
          Filter
        </Button>
        </>
        )}

        <Button
          variant="contained"
          size="small "
          onClick={handleResetClick}
          className="col-1 mx-2"
        >
          Reset
        </Button>
        
      </div>
      <div className="card">
        <div className="row gx-3 justify-content-around">
          <div
            className={`${classes.customCard} ${classes.cardSolidPrimary} ${classes.invertedColors} m-2 col-3`}
          >
            <div className={`${classes.cardContent} ${classes.horizontal}`}>
              <div className={classes.circularProgress}>
                <PointOfSaleIcon className={classes.progressValue} />
              </div>
              <div className={classes.content}>
                <p className={classes.bodyMd}>
                  Pending for Approval of Sales Payment:
                </p>
                <span className={classes.h1}>
                  {pendingForApprovalData.length}
                </span>
                <Link
                  to="/admin/finance-pendingapproveupdate"
                  className={classes.detailsLink}
                >
                  View Details
                </Link>
              </div>
            </div>
            <div className={classes.cardActions}>
            <Link to="/admin/finance-pendingapproveupdate">
                <InfoIcon  className="fs-3  pb-1  mt-3"/>
                </Link>

            </div>
          </div>
          <div
            className={`${classes.customCard} ${classes.cardSolidPrimary} ${classes.invertedColors} col-3 m-2`}
          >
            <div className={`${classes.cardContent} ${classes.horizontal}`}>
              <div className={classes.circularProgress}>
                <PointOfSaleIcon className={classes.progressValue} />
              </div>
              <div className={classes.content }>
                <h5 className={classes.bodyMd}>Pending for Vendor Payment:</h5>
                <span className={classes.h1}>{vendorCardData.length}</span>
                <Link
                  to="/admin/finance-pruchasemanagement-paymentdone"
                  className={classes.detailsLink}
                >
                  View Details
                </Link>
              </div>
            </div>
            <div className={classes.cardActions}>

                <Link to="/admin/finance-pruchasemanagement-paymentdone">
                <InfoIcon  className="fs-3  pb-1  mt-3"/>
                </Link>

            </div>
          </div>

          <div
            className={`${classes.customCard} ${classes.cardSolidPrimary} ${classes.invertedColors} col-3 m-2`}
          >
            <div className={`${classes.cardContent} ${classes.horizontal}`}>
              <div className={classes.circularProgress}>
                <PointOfSaleIcon className={classes.progressValue} />
              </div>
              <div className={`${classes.content} ${classes.buttonAlignIncentive2}`}>
                <h5 className={classes.bodyMd}>Total Payout  Pending:</h5>
                <br />
                <span className={classes.h1}>&#8377;{payoutData.map(e=>e.toPay).reduce((prev, next) => prev + next, 0)
                    .toLocaleString("en-IN")}</span>
                <Link to="#" className={classes.detailsLink}>
                  View Details
                </Link>
              </div>
            </div>
            <div className={classes.cardActions}>
            <Link to="#">
                <InfoIcon  className="fs-3  pb-1  mt-3"/>
                </Link>

            </div>
          </div>

          <div
            className={`${classes.customCard} ${classes.cardSolidPrimary} ${classes.invertedColors} col-3`}
          >
            <div
              className={`${classes.cardContent} ${classes.horizontal}  ${classes.buttonAlign}`}
            >
              <div className={classes.circularProgress}>
                <PointOfSaleIcon className={classes.progressValue} />
              </div>
              <div className={classes.content}>
                <h5 className={classes.bodyMd}>
                  Total Invoice pending count :
                </h5>
                <span className={classes.h1}>{invoicePending.length}</span>
                <Link to="#" className={classes.detailsLink}>
                  View Details
                </Link>
              </div>
            </div>
            <div className={classes.cardActions}>
            <Link to="#">
                <InfoIcon  className="fs-3  pb-1  mt-3"/>
                </Link>
                </div>
          </div>

          <div
            className={`${classes.customCard} ${classes.cardSolidPrimary} ${classes.invertedColors} col-3 mx-2`}
          >
            <div className={`${classes.cardContent} ${classes.horizontal}`}>
              <div className={`${classes.circularProgress} ${classes.tdsIcon}`}>
                <PointOfSaleIcon className={classes.progressValue} />
              </div>
              <div className={classes.content}>
                <h5 className={classes.bodyMd}>Total TDS Verification Open:</h5>
                <span className={classes.h1}>
                  {salesBookingOpenData.length}
                </span>

                <h5 className={classes.bodyMd}>
                  Total TDS Verification About to Close:
                </h5>
                <span className={classes.h1}>
                  {salesBookingAboutToCloseData.length}
                </span>

                <h5 className={classes.bodyMd}>
                  Total TDS Verification Close:
                </h5>
                <span className={classes.h1}>
                  {salesBookingCloseData.length}
                </span>

                <Link
                  to="/admin/finance-salebookingclose"
                  className={classes.detailsLink}
                >
                  View Details
                </Link>
              </div>
            </div>
            <div className={classes.cardActions}>
              <Link to="/admin/finance-salebookingclose">
                <InfoIcon  className="fs-3  pb-1  mt-3"/>
                </Link>
                </div>
          </div>

          <div
            className={`${classes.customCard} ${classes.cardSolidPrimary} ${classes.invertedColors} col-3 `}
          >
            <div
              className={`${classes.cardContent} ${classes.horizontal} ${classes.buttonAlignIncentive}`}
            >
              <div
                className={`${classes.circularProgress} ${classes.buttonAlignIncentiveIcon} `}
              >
                <PointOfSaleIcon className={classes.progressValue} />
              </div>
              <div className={classes.content}>
                <h5 className={classes.bodyMd}>Total Incentive Count:</h5>
                <h3 className={classes.h1}>{incentiveData.length}</h3>
                <h5 className={classes.bodyMd}>
                Request Amount:{" "}
                  <span className={classes.currencySymbol}>&#8377;</span>
                  {incentiveData.map((item) => +item.request_amount).reduce((prev, next) => prev + next, 0)}
                </h5>
                <h5 className={classes.bodyMd}>
                Released Amount:{" "}
                  <span className={classes.currencySymbol}>&#8377;</span>
                  {incentiveData.map((item) => +item.released_amount).reduce((prev, next) => prev + next, 0)}
                </h5><h5 className={classes.bodyMd}>
                Balance Release Amount:{" "}
                  <span className={classes.currencySymbol}>&#8377;</span>
                  {incentiveData.map((item) => +item.balance_release_amount).reduce((prev, next) => prev + next, 0)}
                </h5>
                <Link
                  to="/admin/finance-incentivepayment"
                  className={classes.detailsLink}
                >
                  View Details
                </Link>
              </div>
            </div>
            <div className={classes.cardActions}>
             <Link to="/admin/finance-incentivepayment">
                <InfoIcon  className="fs-3  pb-1  mt-3"/>
                </Link>

                
            </div>
          </div>

          <div
            className={`${classes.customCard} ${classes.cardSolidPrimary} ${classes.invertedColors} col-3 m-2`}
          >
            <div className={`${classes.cardContent} ${classes.horizontal} `}>
              <div className={classes.circularProgress}>
                <PointOfSaleIcon className={classes.progressValue} />
              </div>
              <div className={classes.content}>
                <h5 className={classes.bodyMd}>
                  Total Refund Request Amount Pending:{" "}
                  <span className={classes.h1}>
                  <span className={classes.currencySymbol}>&#8377;</span>

                  
                  
                    </span>{refundReqData
                    .map((item) => item.refund_amount)
                    .reduce((prev, next) => prev + next, 0)
                    .toLocaleString("en-IN")}
                </h5>
                <Link
                  to="/admin/finance-pendingapproverefund"
                  className={classes.detailsLink}
                >
                  <p className={classes.cardText}>View Details</p>
                </Link>
              </div>
            </div>
            <div className={classes.cardActions}>
              <Link to="/admin/finance-pendingapproverefund">
                <InfoIcon  className="fs-3  pb-1  mt-3"/>
                </Link>
            </div>
          </div>

          <div
            className={`${classes.customCard} ${classes.cardSolidPrimary} ${classes.invertedColors} col-3 m-2`}
          >
            <div className={`${classes.cardContent} ${classes.horizontal}`}>
              <div className={classes.circularProgress}>
                <PointOfSaleIcon className={classes.progressValue} />
              </div>
              <div className={classes.content}>
                <h5 className={classes.bodyMd}>
                  Customer Balance Payment Count:{" "}
                  <span className={classes.h1}>{cstPaymentData.length}</span>
                </h5>
                <h5 className={`${classes.bodyMd} mt-1 `} style={{lineHeight:"15px"}}>
                  Total Refund Request Amount Pending:{" "}
                  <span className={classes.h1}>&#8377;</span>
                  {cstPaymentData
                    .map(
                      (item) => item.campaign_amount - item.total_paid_amount
                    )
                    .reduce((prev, next) => prev + next, 0)
                    .toLocaleString("en-IN")}
                </h5>
                <Link
                  to="/admin/finance-balancepayment"
                  className={classes.detailsLink}
                >
                  <p className={classes.cardText}>View Details</p>
                </Link>
              </div>
            </div>

            <div className={classes.cardActions}>
           <Link to="/admin/finance-balancepayment">
                <InfoIcon  className="fs-3  pb-1  mt-3"/>
                </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
