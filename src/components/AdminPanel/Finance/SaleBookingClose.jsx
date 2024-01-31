import { useEffect, useState } from "react";
import axios, { all } from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { tr } from "date-fns/locale";
import {baseUrl} from '../../../utils/config'

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
      "https://salesdev.we-fit.in/webservices/RestController.php?view=close_booking",
      formData,
      {
        headers: {
          "application-type": "multipart/form-data",
        },
      }
    );
getData()
    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios
      .post(
        baseUrl+"add_php_sale_booking_tds_data_in_node"
      )
      .then((res) => {
        console.log("data save in local success");
      });
      let formData = new FormData();
      formData.append("loggedin_user_id", 36);
      formData.append("tds_status", tdsStatus);
      {aboutToClose&&formData.append("about_to_close", 1);}

    axios
      .post("https://salesdev.we-fit.in/webservices/RestController.php?view=sales-sale_booking_for_tds",formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        })
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
  }, [tdsStatus,aboutToClose]);

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
    setTdsStatus(0)
setAboutToClose(false)
  };

  const close = () => {
    // const allData = datas;
    // const filteredData = allData.filter(
    //   (item) => item.show_fstatus == "Closed Link"
    // );
    // setData(allData);
    // setFilterData(filteredData);
    setTdsStatus(1);  
    setAboutToClose(false)
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
        return tdsStatus === 0 && aboutToClose==true ? (
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
