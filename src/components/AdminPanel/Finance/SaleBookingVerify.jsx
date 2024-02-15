import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import { set } from "date-fns";
import { baseUrl } from "../../../utils/config";
import { Autocomplete, Button, TextField } from "@mui/material";

const SaleBookingVerify = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [balAmount, setBalAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [row, setRow] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setcampaignAmountField] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("verified_amount", balAmount);
    formData.append("verified_remark", remark);
    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=verifybooking",
        formData,
        {
          headers: {
            "application-type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        handleCloseImageModal();
        getData();
      });

    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };

  const handleImageClick = (row) => {
    setImageModalOpen(true);
    setRow(row);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setBalAmount("");
    setRemark("");
  };

  function getData() {
    axios
      .post(baseUrl + "add_php_sale_booking_tds_verification_data_in_node")
      .then(() => {});
    let formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-sale_booking_tds_verification",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setFilterData(res.data.boby);
        setData(res.data.body);
      });
  }

  const convertDateToDDMMYYYY = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const output = day + "/" + month + "/" + year;
    return output;
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().includes(search.toLowerCase());
    });
    setFilterData(result);
  }, [search, datas]); // Including datas in dependencies

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
      width: "9%",
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
      width: "10%",
    },
    {
      name: "Booking Date",
      // selector: (row) => row.sale_booking_date,
      cell: (row) => convertDateToDDMMYYYY(row.sale_booking_date),
      width: "10%",
    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
      width: "10%",
    },
    {
      name: "Base Amount",
      selector: (row) => row.base_amount,
      width: "10%",
    },
    {
      name: "GST Amount",
      selector: (row) => row.gst_amount,
      width: "10%",
    },
    {
      name: "Net Amount",
      selector: (row) => row.net_amount,
      width: "10%",
    },
    {
      name: "Paid Amount",
      selector: (row) => row.total_paid_amount,
      width: "10%",
    },
    {
      name: "Refund Amount",
      selector: (row) => row.total_refund_amount,
      width: "10%",
    },
    {
      name: "Refund Balance Amount",

      cell: (row) => {
        return row.balance_refund_amount;
      },
      width: "10%",
    },
    {
      name: "Balance Amount",
      cell: (row) => {
        return row.campaign_amount - row.total_paid_amount;
      },
    },
    {
      name: "Net Bal Cust to pay Amt",
      selector: (row) => row.net_balance_amount_to_pay,
      width: "15%",
    },
    {
      name: "Net Bal Cust to pay Amt (%)",
      selector: (row) => row.net_balance_amount_to_pay_percentage,
      width: "15%",
    },
    {
      name: "Booking Created Date",
      cell: (row) => convertDateToDDMMYYYY(row.creation_date),
      width: "15%",
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          {row.tds_status == 2 ? (
            <span>Verified</span>
          ) : (
            <button
              className="btn btn-sm btn-outline-info"
              onClick={() => handleImageClick(row)}
            >
              Verify
            </button>
          )}
        </>
      ),
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
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Sale Booking Close"
            columns={columns}
            data={filterData}
            fixedHeader
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

      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
        style={{
          content: {
            width: "30%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Sale Booking Verify</h2>

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
                <label htmlFor="images">Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  id="images"
                  name="images"
                  value={balAmount}
                  onChange={(e) => {
                    if (e.target.value > row.net_balance_amount_to_pay) {
                      toastError(
                        "Amount is greater than balance amount to pay"
                      );
                      return;
                    }
                    setBalAmount(e.target.value);
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="images">Remark:</label>
                <input
                  type="text"
                  className="form-control"
                  id="images"
                  name="images"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SaleBookingVerify;
