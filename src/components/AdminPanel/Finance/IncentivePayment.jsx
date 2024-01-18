import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";

const IncentivePayment = () => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [accountNo, setAccountNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [selectedData, setSelectedData] = useState({});

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async () => {
    // e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("incentive_request_id", selectedData.incentive_request_id);
    formData.append("account_number", accountNo);
    formData.append("remarks", remarks);
    formData.append("payment_ref_no", paymentRef);

    await axios.post(
      "https://production.sales.creativefuel.io/webservices/RestController.php?view=release_incentive_submit",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setImageModalOpen(false);

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios
      .post(
        "http://34.93.221.166:3000/api/add_php_payment_incentive_data_in_node"
      )
      .then((res) => {
        console.log("data save in local success");
      });
    axios
      .get("http://34.93.221.166:3000/api/get_all_php_payment_incentive_data")
      .then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
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
      selector: (row) => row.name,
    },
    {
      name: "Request Amount",
      selector: (row) => row.request_amount,
    },

    {
      name: "Status",
      selector: (row) => {
        return row.finance_status == 0 ? (
          <button
            className="btn btn-sm btn-outline-info"
            data-toggle="modal"
            data-target="#incentiveModal"
            onClick={(e) => setSelectedData(row)}
          >
            Complete Release
          </button>
        ) : (
          <span>{row.finance_status}</span>
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

      <div class="modal fade" id="incentiveModal" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
              <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body">
              <form onSubmit={handleSubmit}>
                <label>Last 4 digit of account Number</label>
                <input
                  type="number"
                  className="form-control"
                  id="images"
                  name="images"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
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
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

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
