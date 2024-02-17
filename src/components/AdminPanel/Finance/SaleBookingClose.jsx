import { useEffect, useState } from "react";
import axios, { all } from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { tr } from "date-fns/locale";
import { baseUrl } from "../../../utils/config";
import { Autocomplete, Button, TextField } from "@mui/material";

const SaleBookingClose = () => {
  const { toastAlert } = useGlobalContext();
  const [displaySeq, setDisplaySeq] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [tdsStatus, setTdsStatus] = useState(0);
  const [aboutToClose, setAboutToClose] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleVerify = async (row) => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("close_booking", 1);
    formData.append("tds_status", 1);
    formData.append("sale_booking_id", row.sale_booking_id);
    await axios.post(
      "https://sales.creativefuel.io/webservices/RestController.php?view=close_booking",
      formData,
      {
        headers: {
          "application-type": "multipart/form-data",
        },
      }
    );
    getData();
    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };
  function getData() {
    axios
      .post(baseUrl + "add_php_sale_booking_tds_data_in_node")
      .then((res) => {});
    let formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("tds_status", tdsStatus);
    {
      aboutToClose && formData.append("about_to_close", 1);
    }

    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-sale_booking_for_tds",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        const allData = res.data.body;
        // const filteredData = allData.filter(
        //   (item) => item.show_fstatus == "Open"
        // );
        setData(allData);
        setFilterData(allData);
      });
  }

  useEffect(() => {
    getData();
  }, [tdsStatus, aboutToClose]);

  const aboutClose = () => {
    // const allData = datas;
    // const filteredData = allData.filter(
    //   (item) => item.show_fstatus == "About To Close"
    // );
    // setData(allData);
    // setFilterData(filteredData);
    setTdsStatus(0);
    setAboutToClose(true);
  };

  const open = () => {
    const allData = datas;
    // const filteredData = allData.filter((item) => item.show_fstatus == "Open");
    // setData(allData);
    // setFilterData(filteredData);
    setTdsStatus(0);
    setAboutToClose(false);
  };

  const close = () => {
    // const allData = datas;
    // const filteredData = allData.filter(
    //   (item) => item.show_fstatus == "Closed Link"
    // );
    // setData(allData);
    // setFilterData(filteredData);
    setTdsStatus(1);
    setAboutToClose(false);
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

  // Filters Logic :-
  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
      const date = new Date(item.payment_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.cust_name.toLowerCase().includes(customerName.toLowerCase());

      // Requested By Filter
      const salesExecutiveFilterPassed =
        !salesExecutive ||
        item.sales_exe_name
          .toLowerCase()
          .includes(salesExecutive.toLowerCase());
      // Campaign Amount filter
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
      const allFiltersPassed =
        dateFilterPassed &&
        customerNameFilterPassed &&
        salesExecutiveFilterPassed &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setCustomerName("");
    setcampaignAmountField("");
    setCampaignAmountFilter("");
    setSalesExecutive("");
  };
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.cust_name,
      width: "10%",
    },
    {
      name: "Sales Executive Name",
      selector: (row) => row.sales_exe_name,
    },
    {
      name: "Booking Date",
      selector: (row) => row.sale_booking_date,
    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
    },
    {
      name: "Base Amount",
      selector: (row) => row.base_amount,
    },
    {
      name: "GST Amount",
      selector: (row) => row.gst_amount,
    },
    {
      name: "Net Amount",
      selector: (row) => row.net_amount,
    },
    {
      name: "Paid Amount",
      selector: (row) => row.total_paid_amount,
    },
    {
      name: "Refund Amount",
      selector: (row) => row.total_refund_amount,
    },
    {
      name: "Refund Balance Amount",
      selector: (row) => row.balance_refund_amount,
    },
    {
      name: "Net Bal Cust to pay Amt (%)",
      selector: (row) => row.net_balance_amount_to_pay_percentage,
    },
    {
      name: "Booking Created Date",
      selector: (row) => row.booking_created_date,
    },
    {
      name: "Action",
      selector: (row) => {
        // return row.show_fstatus === "About To Close" ? (
        return tdsStatus === 0 && aboutToClose == true ? (
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleVerify(row)}
          >
            Close
          </button>
        ) : (
          <span>{row.show_fstatus}</span>
        );
      },
    },
  ];
  return (
    <>
      <FormContainer
        mainTitle="Sale Booking "
        link="/admin/incentive-payment-list"
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
                  label="Customer Name"
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
            <label>Sales Executive Name</label>
            <Autocomplete
              value={salesExecutive}
              onChange={(event, newValue) => setSalesExecutive(newValue)}
              options={datas.map((option) => option.sales_exe_name)}
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
                setcampaignAmountField(e.target.value);
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
      <button className="btn btn-success" onClick={open}>
        Open
      </button>
      <button className="btn btn-warning" onClick={close}>
        Closed
      </button>
      <button className="btn btn-primary" onClick={aboutClose}>
        About to close
      </button>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Sale Booking"
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

export default SaleBookingClose;
