import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";


const AllTransactions = () => {
  
  const { toastAlert } = useGlobalContext();
  const [displaySeq, setDisplaySeq] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  function getData() {
    axios.post("http://34.93.221.166:3000/api/add_php_payment_acc_data_in_node").then((res)=>{
      console.log('data save in local success')
    })
    axios.get("http://34.93.221.166:3000/api/get_all_php_finance_data").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  function convertDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

const handleCopyDetail = (detail) => {
  navigator.clipboard.writeText(detail);
  toastAlert("Detail copied");
};

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
      cell: (row, index) => <div style={{ whiteSpace: 'normal' }}>{index + 1}</div>,
      width: "7%",
      sortable: true,
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Requested By</div>,
      selector: (row) => <div style={{ whiteSpace: 'normal' }}>{row.user_name} </div>,
      width: "8%",
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
      width: "170px",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Campaign Amount Without Gst</div>,
      selector: (row) => row.campaign_amount_without_gst,
      width: "6%",
    },
    {
      name: <div style={{ whiteSpace: 'normal' }}>Payment On Date</div>,
      // selector: (row) => row.payment_date,
      cell: (row) => <div style={{ whiteSpace: 'normal' }}>{convertDateToDDMMYYYY(row.payment_date)}</div>,
      width: "150px",
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
      cell: (row) => (
        <div style={{ whiteSpace: "normal" }}>
          {row.detail}
          <Button
            key={row.detail}
            color="secondary"
            onClick={() => handleCopyDetail(row.detail)}
            style={{ marginLeft: "10px" }}
          >
            <ContentCopyIcon />
          </Button>
        </div>
      ),
      width: "200px",
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
      selector: (row) => "Approved"
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
        mainTitle="All Transactions"
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
            title="All Transactions"
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

export default AllTransactions;