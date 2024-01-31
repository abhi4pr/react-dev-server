import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import CloseIcon from "@mui/icons-material/Close";
import $ from "jquery";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import {baseUrl} from '../../../utils/config'

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

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("incentive_request_id", selectedData.incentive_request_id);
    formData.append("account_number", accountNo);
    formData.append("remarks", remarks);
    formData.append("payment_ref_no", paymentRef);
    formData.append("sales_executive_id", selectedData.sales_executive_id);
    formData.append("release_amount", balanceReleaseAmount);

    await axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=release_incentive_submit",
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
        $("#incentiveModal").modal("hide");
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios
      .post(
        baseUrl+"add_php_payment_incentive_data_in_node"
      )
      .then(() => {
        console.log("data save in local success");
      });
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
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
        setData(res.data.body);
        setFilterData(res.data.body);
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

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Sales executive name",
      selector: (row) => (
        <Link
          to={`/admin/Incentive-Request-Released-List/${row.incentive_request_id}`}
          className="link-primary"
        >
          {row.sales_executive_name}
        </Link>
      ),
    },
    {
      name: "Request Amount",
      selector: (row) => row.request_amount,
    },
    {
      name: "Released Amount",
      selector: (row) => (
        <Link
          to={`/admin/Incentive-Request-Released-List/${row.incentive_request_id}`}
          className="link-primary"
        >
          {row.released_amount.toLocaleString("en-IN")}
        </Link>
      ),
    },
    {
      name: "Balance Release Amount",
      selector: (row) => row.balance_release_amount.toLocaleString("en-IN"),
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
    },
  ];

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
            <label>Balance Release Amount</label>
            <input
              className="form-control"
              id="images"
              name="images"
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

            <label>Last 4 digit of account Number</label>
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
            <label>Payment ref number</label>
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
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "15px" }}
            >
              Submit
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* {isModalOpen&&<div className={isModalOpen ? "modal fade show" : "modal fade"} id="incentiveModal" role="dialog" style={{ display: isModalOpen ? "block" : "none" }}>        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
            
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>} */}

      <div className="card">
        <div className="data_tbl table-responsive">
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
