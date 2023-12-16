import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";

const SaleBookingClose = () => {
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

  const handleVerify = async (row) => {
    
    const formData = new FormData();
    formData.append("loggedin_user_id",36)
    formData.append("close_booking",1)
    formData.append("tds_status",1)
    formData.append("sale_booking_id",row.sale_booking_id)

    await axios.post("https://production.sales.creativefuel.io/webservices/RestController.php?view=close_booking", formData, {
      headers:{
        "application-type":"multipart/form-data"
      }
    });

    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios.post("http://34.93.221.166:3000/api/add_php_sale_booking_tds_data_in_node").then((res)=>{
      console.log('data save in local success')
    })
    axios.get("http://34.93.221.166:3000/api/get_all_php_sale_booking_tds_data").then((res) => {
      const allData = res.data.data;
      const filteredData = allData.filter((item) => item.show_fstatus == 'Open');
      setData(allData);
      setFilterData(filteredData);
    });
  }

  const aboutClose = () => {
    const allData = datas;
    const filteredData = allData.filter((item) => item.show_fstatus == 'About To Close');
    setData(allData);
    setFilterData(filteredData);
  }

  const open = () => {
    const allData = datas;
    const filteredData = allData.filter((item) => item.show_fstatus == 'Open');
    setData(allData);
    setFilterData(filteredData);
  }

  const close = () => {
    const allData = datas;
    const filteredData = allData.filter((item) => item.show_fstatus == 'Closed Link');
    setData(allData);
    setFilterData(filteredData);
  }

  useEffect(() => {
    getData();
  }, []);

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
      width: "9%",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.cust_name,
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
      name: "Net Bal Cust To Pay Amt",
      selector: (row) => row.net_balance_amount_to_pay_percentage,
    },
    {
      name: "Net Bal Cust to pay Amt (%)",
      selector: (row) => row.vendor_name,
    },
    {
      name: "Booking Created Date",
      selector: (row) => row.booking_created_date,
    },
    {
      name: "Action",
      selector: (row) => 
      {
        return row.show_fstatus === 'About To Close' ? (
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleVerify(row)}
          >
            Verify
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

      <button className="btn btn-success" onClick={open}>Open</button>
      <button className="btn btn-warning" onClick={close}>Closed</button>
      <button className="btn btn-primary" onClick={aboutClose}>About to close</button>

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
