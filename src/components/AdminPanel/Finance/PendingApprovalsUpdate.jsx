import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";

const PendingApprovalUpdate = () => {
   
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [status, setStatus] = useState("")

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleStatusChange = async(row, selectedStatus) => {
    setStatus(selectedStatus)

    const formData = new FormData();
      formData.append("loggedin_user_id",36)
      formData.append("payment_update_id",row.payment_update_id)
      formData.append("payment_approval_status",selectedStatus)
      formData.append("sale_booking_id",row.sale_booking_id)
      formData.append("action_reason","")

      await axios.post("https://production.sales.creativefuel.io/webservices/RestController.php?view=change_payment_update_status", formData ,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });

      toastAlert("Data updated");
      setIsFormSubmitted(true);
  };

  function getData() {
    axios.post("http://34.93.221.166:3000/api/add_php_finance_data_in_node").then((res)=>{
      console.log('data save in local success')
    })
    axios.get("http://34.93.221.166:3000/api/get_all_php_finance_data_pending").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return (
        d.assetsName?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);
  const columns = [
    {
      name: "Id",
      cell: (row, index) => <div style={{ whiteSpace: 'normal' }}>{index + 1} </div>,
      width: "4%",
      sortable: true,
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Requested By</div>,
      selector: (row) => <div style={{ whiteSpace: 'normal' }}>{row.user_name} </div>,
      width: "7%",
      sortable: false,
    },
    {
      name:<div style={{ whiteSpace: 'normal' }}>Customer Name</div>,
      selector: (row) => <div style={{ whiteSpace: 'normal' }}>{row.cust_name}</div>,
      width: "8%",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Campaign Amount</div>,
      selector: (row) => <div style={{ whiteSpace: 'normal' }}>{row.campaign_amount} </div>,
      width: "6%",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Campaign Amount Without Gst</div>,
      selector: (row) => row.campaign_amount_without_gst,
      width: "6%",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Payment On Date</div>,
      selector: (row) => row.payment_date,
      width: "7%",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Payment Amount</div>,
      selector: (row) => row.payment_amount,
      width: "6%",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Payment Mode</div>,
      selector: (row) => row.payment_mode,
      width: "6%",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Payment View</div>,
      selector: (row) => row.payment_approval_status,
    },
    {
      name: "Bank Name",
      selector: (row) => <div style={{ whiteSpace: 'normal' }}>{row.gst_bank} </div>,
    },
    {
      name: "Bank Detail",
      selector: (row) => <div style={{ whiteSpace: 'normal' }}> {row.detail} </div>,
      width: "12%",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Reference No</div>,
      selector: (row) => row.payment_ref_no,
      width: "5%",
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks,
      width: "8%",
    },
    {
      name: "Status",
      selector: (row) => (
        <select
          className="form-control"
          value={row.statusDropdown}
          onChange={(e) => handleStatusChange(row, e.target.value)}
        >
          <option value="">Select</option>
          <option value="1">Approved</option>
          <option value="0">Rejected</option>
        </select>
      ),
      width: "7%",
    },
    {
      name: "Payment Requested Date and Time",
      selector: (row) => row.balance_payment_ondate,
      width: "8%",
    },
    {
      name: "Action",
      selector: (row,index) => <><Link to={`/admin/payment-summary/${row.cust_id}`}>
      <button
        title="Summary"
        className="btn btn-outline-primary btn-sm user-button"
      >
        <i className="bi bi-journal-text"></i>
      </button>
    </Link></>,
      width: "4%",
    },
   
  ];

   return (
    <>
      <FormContainer
        mainTitle="Pending approval for update"
        link="/admin/finance-alltransaction"
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
            title="Pending approval for update"
            columns={columns}
            data={filterData}
            fixedHeader
            pagination
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

export default PendingApprovalUpdate;