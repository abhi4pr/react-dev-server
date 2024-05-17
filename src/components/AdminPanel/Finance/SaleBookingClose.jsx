import { useEffect, useState } from "react";
import axios, { all } from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tr } from "date-fns/locale";
import { baseUrl } from "../../../utils/config";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { set } from "date-fns";

const SaleBookingClose = ({
  onHandleOpenUniqueSalesExecutiveChange,
  onHandleOpenUniqueCustomerClickChange,
  setAbouttoclosecount,
  setButtonaccess,
  setclosecount,
  setOpencount,
  setUniquecustomerCount,
  setBaseamountTotal,
  setUniquesalesexecutiveCount,
}) => {
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
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [balAmount, setBalAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [row, setRow] = useState({});
  const [openBtnCount, setOpenBtnCount] = useState(0);
  const [closeBtnCount, setCloseBtnCount] = useState(0);

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
        setData(res.data.body);
        setFilterData(res.data.body);
        const custData = res.data.body;
        const uniqueCustomers = new Set(custData.map((item) => item.cust_name));
        setUniqueCustomerCount(uniqueCustomers.size);
        setUniquecustomerCount(uniqueCustomers.size);
        const uniqueCustomerData = Array.from(uniqueCustomers).map(
          (customerName) => {
            return custData.find((item) => item.cust_name === customerName);
          }
        );
        setUniqueCustomerData(uniqueCustomerData);
        // For Unique Sales Executive
        const salesExecuteiveData = res.data.body;
        const uniqueSalesEx = new Set(
          salesExecuteiveData.map((item) => item.sales_exe_name)
        );
        setUniqueSalesExecutiveCount(uniqueSalesEx.size);
        setUniquesalesexecutiveCount(uniqueSalesEx.size);
        const uniqueSEData = Array.from(uniqueSalesEx).map((salesEName) => {
          return salesExecuteiveData.find(
            (item) => item.sales_exe_name === salesEName
          );
        });
        setUniqueSalesExecutiveData(uniqueSEData);

        const dateFilterData = filterDataBasedOnSelection(res.data.body);
        setFilterData(dateFilterData);
      });
  }

  useEffect(() => {
    getData();
    setButtonaccess(
      contextData &&
        contextData[2] &&
        contextData[2].insert_value === 1 &&
        false
    );
  }, [tdsStatus, aboutToClose, dateFilter]);

  // const aboutClose = (e) => {
  //   e.preventDefault();
  //   setTdsStatus(0);
  //   setAboutToClose(true);
  // };

  const open = (e) => {
    e.preventDefault();
    setTdsStatus(0);
    setAboutToClose(false);
  };

  const close = (e) => {
    e.preventDefault();
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
  // For Customers
  const handleOpenUniqueCustomerClick = () => {
    setUniqueCustomerDialog(true);
  };

  const handleCloseUniqueCustomer = () => {
    setUniqueCustomerDialog(false);
  };

  const handleOpenSameCustomer = (custName) => {
    setSameCustomerDialog(true);

    const sameNameCustomers = datas.filter(
      (item) => item.cust_name === custName
    );
    setSameCustomerData(sameNameCustomers);
  };

  const handleCloseSameCustomer = () => {
    setSameCustomerDialog(false);
  };

  // For Sales Executive
  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    setSameSalesExecutiveDialog(true);

    const sameNameSalesExecutive = datas.filter(
      (item) => item.sales_exe_name === salesEName
    );

    setSameSalesExecutiveData(sameNameSalesExecutive);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };
  useEffect(() => {
    onHandleOpenUniqueSalesExecutiveChange(
      () => handleOpenUniqueSalesExecutive
    );
    onHandleOpenUniqueCustomerClickChange(() => handleOpenUniqueCustomerClick);
  }, []);
  // Total base amount:-
  const baseAmountTotal = filterData.reduce(
    (total, item) => total + parseFloat(item.base_amount),
    0
  );
  setBaseamountTotal(baseAmountTotal);
  // For Verify :-
  const handleOpenVerifyDialog = (e, row) => {
    e.preventDefault();
    setVerifyDialog(true);
    setRow(row);
  };

  const handleCloseVerifyDialog = () => {
    setVerifyDialog(false);
    setBalAmount("");
    setRemark("");
  };
  const handleVerifySubmit = async (e) => {
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
        handleCloseVerifyDialog();
        getData();
      });

    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };
  // ========================================================
  const sameSalesExecutivecolumn = [
    {
      field: "S.No",
      width: 200,

      renderCell: (params, index) => (
        <div>{[...sameSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),

      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      renderCell: (params) => params.row.cust_name,
      width: 200,
    },
    {
      field: "Sales Executive Name",
      fieldName: "sales_exe_name",
      width: 200,

      renderCell: (params) => params.row.sales_exe_name,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      width: 200,

      renderCell: (params) => params.row.sale_booking_date,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      width: 200,

      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      width: 200,

      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      width: 200,

      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      width: 200,

      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      width: 200,

      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      width: 200,

      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      width: 200,

      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "booking_created_date",
      width: 200,

      renderCell: (params) => params.row.booking_created_date,
    },
  ];
  const uniqueSalesExecutivecolumn = [
    {
      field: "S.No",
      renderCell: (params, index) => (
        <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
      width: 80,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      renderCell: (params) => {
        return <div>{params.row.cust_name}</div>;
      },
      width: 200,
    },
    {
      field: "Sales Executive Name",
      fieldName: "sales_exe_name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            handleOpenSameSalesExecutive(params.row.sales_exe_name)
          }
        >
          {params.row.sales_exe_name}
        </div>
      ),
      width: 200,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      renderCell: (params) => params.row.sale_booking_date,
      width: 200,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "booking_created_date",
      renderCell: (params) => params.row.booking_created_date,
      width: 200,
    },
    {
      field: "Action",
      renderCell: (params) => {
        // return row.show_fstatus === "About To Close" ? (
        return tdsStatus === 0 && aboutToClose == true ? (
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleVerify(params.row)}
          >
            Close
          </button>
        ) : (
          <span>{params.row.show_fstatus}</span>
        );
      },
      width: 200,
    },
  ];
  const sameCustomercolumn = [
    {
      field: "S.No",
      width: 80,

      renderCell: (params, index) => (
        <div>{[...sameCustomerData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      renderCell: (params) => (
        <div style={{ wordWrap: "break-word" }}>{params.row.cust_name} </div>
      ),
      width: 200,
    },
    {
      field: "Sales Executive Name",
      fieldName: "sales_exe_name",
      renderCell: (params) => params.row.sales_exe_name,
      width: 200,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      renderCell: (params) => params.row.sale_booking_date,
      width: 200,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
      width: 200,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      renderCell: (params) => params.row.base_amount,
      width: 200,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      renderCell: (params) => params.row.gst_amount,
      width: 200,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      width: 200,

      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      renderCell: (params) => params.row.total_paid_amount,
      width: 200,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      width: 200,

      width: 200,

      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      width: 200,

      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "booking_created_date",
      width: 200,

      renderCell: (params) => params.row.booking_created_date,
    },
  ];

  const uniqueCustomercolumn = [
    {
      field: "S.No",
      width: 80,

      renderCell: (params, index) => (
        <div>{[...uniqueCustomerData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "Customer Name",
      fieldName: "cust_name",
      width: 200,

      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
          title={params.row.cust_name} // Add this line
        >
          {params.row.cust_name}
        </div>
      ),
    },
    {
      field: "Sales Executive Name",
      fieldName: "sales_exe_name",
      width: 200,

      renderCell: (params) => params.row.sales_exe_name,
    },
    {
      field: "Booking Date",
      fieldName: "sale_booking_date",
      width: 200,

      renderCell: (params) => params.row.sale_booking_date,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      width: 200,

      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Base Amount",
      fieldName: "base_amount",
      width: 200,

      renderCell: (params) => params.row.base_amount,
    },
    {
      field: "GST Amount",
      fieldName: "gst_amount",
      width: 200,

      renderCell: (params) => params.row.gst_amount,
    },
    {
      field: "Net Amount",
      fieldName: "net_amount",
      width: 200,

      renderCell: (params) => params.row.net_amount,
    },
    {
      field: "Paid Amount",
      fieldName: "total_paid_amount",
      width: 200,

      renderCell: (params) => params.row.total_paid_amount,
    },
    {
      field: "Refund Amount",
      fieldName: "total_refund_amount",
      width: 200,

      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "Refund Balance Amount",
      fieldName: "balance_refund_amount",
      width: 200,

      renderCell: (params) => params.row.balance_refund_amount,
    },
    {
      field: "Net Bal Cust to pay Amt (%)",
      fieldName: "net_balance_amount_to_pay_percentage",
      width: 200,

      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
    },
    {
      field: "Booking Created Date",
      fieldName: "booking_created_date",
      width: 200,

      renderCell: (params) => params.row.booking_created_date,
    },
    {
      field: "Action",
      width: 200,

      renderCell: (params) => {
        // return row.show_fstatus === "About To Close" ? (
        return tdsStatus === 0 && aboutToClose == true ? (
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => handleVerify(params.row)}
          >
            Close
          </button>
        ) : (
          <span>{params.row.show_fstatus}</span>
        );
      },
    },
  ];

  // const handleMouseDown = (e) => {
  //   e.preventDefault();
  //   document.addEventListener('mousemove', handleMouseMove);
  //   document.addEventListener('mouseup', handleMouseUp);
  // };

  // const handleMouseMove = (e) => {
  //   setColumnWidth(prevWidth => prevWidth + e.movementX);
  // };

  // const handleMouseUp = () => {
  //   document.removeEventListener('mousemove', handleMouseMove);
  //   document.removeEventListener('mouseup', handleMouseUp);
  // <div onMouseDown={handleMouseDown} style={{ cursor: 'col-resize' }}>{row.cust_name}</div>
  // };
  const columns = [
    {
      field: "s_no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...filterData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "sale_booking_id",
      headerName: "Booking Id",
      renderCell: (params) => {
        return <div>{params.row.sale_booking_id}</div>;
      },
      width: 150,
    },
    {
      field: "cust_name",
      headerName: "Customer Name",
      renderCell: (params) => {
        return <div>{params.row.cust_name}</div>;
      },
      width: 150,
    },
    {
      field: "sales_exe_name",
      headerName: "Sales Executive Name",
      renderCell: (params) => <div>{params.row.sales_exe_name}</div>,
      width: 150,
    },
    {
      field: "sale_booking_date",
      headerName: "Booking Date",
      renderCell: (params) => params.row.sale_booking_date,
      width: 150,
    },
    {
      field: "campaign_amount",
      headerName: "Campaign Amount",
      renderCell: (params) => params.row.campaign_amount,
      width: 150,
    },

    {
      field: "base_amount",
      headerName: "Base Amount",
      renderCell: (params) => params.row.base_amount,
      width: 150,
    },
    {
      field: "tds_amount",
      headerName: "TDS Amount",
      width: 150,
      renderCell: (params) => (
        <div>{params.row.tds_amount !== "" ? params.row.tds_amount : 0}</div>
      ),
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      renderCell: (params) => params.row.gst_amount,
      width: 150,
    },
    {
      field: "net_amount",
      headerName: "Net Amount",
      renderCell: (params) => params.row.net_amount,
      width: 150,
    },
    {
      field: "total_paid_amount",
      headerName: "Paid Amount",
      renderCell: (params) => params.row.total_paid_amount,
      width: 150,
    },

    {
      field: "total_refund_amount",
      headerName: "Refund Amount",
      renderCell: (params) => params.row.total_refund_amount,
    },
    {
      field: "balance_refund_amount",
      headerName: "Refund Balance Amount",
      renderCell: (params) => params.row.balance_refund_amount,
      width: 150,
    },
    {
      field: "net_balance_amount_to_pay_percentage",
      headerName: "Net Bal Cust to pay Amt (%)",
      renderCell: (params) => params.row.net_balance_amount_to_pay_percentage,
      width: 150,
    },
    {
      field: "booking_created_date",
      headerName: "Booking Created Date",
      renderCell: (params) => params.row.booking_created_date,
      width: 150,
    },
    {
      field: "show_fstatus",
      headerName: "Status",
      renderCell: (params) => params.row.show_fstatus,
    },

    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => {
        // return row.show_fstatus === "About To Close" ? (
        return tdsStatus === 0 ? (
          // <button
          //   className="btn btn-sm btn-outline-info"
          //   onClick={() => handleVerify(params.row)}
          // >
          //   Close
          // </button>
          ""
        ) : (
          <div className="flex-row gap16">
            {params.row.show_fstatus === "Closed" ? (
              <button
                className="btn cmnbtn btn_sm btn-outline-primary mr4"
                onClick={(e) => handleOpenVerifyDialog(e, params.row)}
              >
                Verify
              </button>
            ) : null}
          </div>
        );
      },
    },
    // {
    //   field: "Action",
    //   fieldName: "Action",
    //   renderCell: (params) => <></>,
    //   width: "170px",
    // },
  ];

  console.log(filterData, "FILTER DATA>>");

  const filterDataBasedOnSelection = (apiData) => {
    const now = moment();
    switch (dateFilter) {
      case "last7Days":
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            now.clone().subtract(7, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "last30Days":
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            now.clone().subtract(30, "days"),
            now,
            "day",
            "[]"
          )
        );
      case "thisWeek":
        const startOfWeek = now.clone().startOf("week");
        const endOfWeek = now.clone().endOf("week");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            startOfWeek,
            endOfWeek,
            "day",
            "[]"
          )
        );
      case "lastWeek":
        const startOfLastWeek = now
          .clone()
          .subtract(1, "weeks")
          .startOf("week");
        const endOfLastWeek = now.clone().subtract(1, "weeks").endOf("week");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            startOfLastWeek,
            endOfLastWeek,
            "day",
            "[]"
          )
        );
      case "currentMonth":
        const startOfMonth = now.clone().startOf("month");
        const endOfMonth = now.clone().endOf("month");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            startOfMonth,
            endOfMonth,
            "day",
            "[]"
          )
        );
      case "nextMonth":
        const startOfNextMonth = now.clone().add(1, "months").startOf("month");
        const endOfNextMonth = now.clone().add(1, "months").endOf("month");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            startOfNextMonth,
            endOfNextMonth,
            "day",
            "[]"
          )
        );
      case "currentQuarter":
        const quarterStart = moment().startOf("quarter");
        const quarterEnd = moment().endOf("quarter");
        return apiData.filter((item) =>
          moment(item.sale_booking_date).isBetween(
            quarterStart,
            quarterEnd,
            "day",
            "[]"
          )
        );
      default:
        return apiData; // No filter applied
    }
  };

  useEffect(() => {
    const openCount = filterData.filter(
      (item) => item.show_fstatus === "Open"
    ).length;
    setOpenBtnCount(openCount);
    // setOpencount(openCount);

    const closeCount = filterData.filter(
      (item) => item.show_fstatus === "Closed"
    ).length;
    setCloseBtnCount(closeCount);
    // setclosecount(closeCount);
  }, [filterData]);

  console.log(filterData, "filterData>");
  return (
    <>
      {/* verify dialog box */}
      <Dialog
        open={verifyDialog}
        onClose={handleCloseVerifyDialog}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseVerifyDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="row">
            <div className="col-md-12 ">
              <form onSubmit={handleVerifySubmit}>
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
                      // if (e.target.value > row.net_balance_amount_to_pay) {
                      //   toastError(
                      //     "Amount is greater than balance amount to pay"
                      //   );
                      //   return;
                      // }
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

                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleVerifySubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Same Sales Executive Dialog Box */}
      <Dialog
        open={sameSalesExecutiveDialog}
        onClose={handleCloseSameSalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameSalesExecutive}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="thm_table fx-head">
            <DataGrid
              rows={sameSalesExecutiveData}
              columns={sameSalesExecutivecolumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              disableColumnResize={false}
              autoHeight
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => sameSalesExecutiveData.indexOf(row)}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Unique Sales Executive Dialog Box */}
      <Dialog
        open={uniqueSalesExecutiveDialog}
        onClose={handleCloseUniquesalesExecutive}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Sales Executive</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniquesalesExecutive}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="thm_table fx-head">
            <DataGrid
              rows={uniqueSalesExecutiveData}
              columns={uniqueSalesExecutivecolumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => uniqueSalesExecutiveData.indexOf(row)}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Same Customer Dialog */}
      <Dialog
        open={sameCustomerDialog}
        onClose={handleCloseSameCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Same Customers</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSameCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="thm_table fx-head">
            <DataGrid
              rows={sameCustomerData}
              columns={sameCustomercolumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => sameCustomerData.indexOf(row)}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Unique Customer Dialog Box */}
      <Dialog
        open={uniqueCustomerDialog}
        onClose={handleCloseUniqueCustomer}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Unique Customers</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseUniqueCustomer}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <div className="thm_table fx-head">
            <DataGrid
              rows={uniqueCustomerData}
              columns={uniqueCustomercolumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => uniqueCustomerData.indexOf(row)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Search by filter</h5>
          <div className="flexCenter colGap12">
            <div className="form-group flexCenter colGap8">
              <label className="w-100 m0">Select Date Range:</label>
              <select
                className="form-control form_sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="last7Days">Last 7 Days</option>
                <option value="last30Days">Last 30 Days</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="currentMonth">Current Month</option>
                <option value="nextMonth">Next Month</option>
                <option value="currentQuarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-4 col-sm-12">
              <div className="form-group">
                <label>Customer Name</label>
                <Autocomplete
                  value={customerName}
                  onChange={(event, newValue) => setCustomerName(newValue)}
                  options={Array.from(
                    new Set(datas.map((option) => option.cust_name))
                  )}
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
            <div className="col-md-4 col-sm-12">
              <div className="form-group">
                <label>Sales Executive Name</label>
                <Autocomplete
                  value={salesExecutive}
                  onChange={(event, newValue) => setSalesExecutive(newValue)}
                  options={Array.from(
                    new Set(datas.map((option) => option.sales_exe_name))
                  )}
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
            <div className="col-md-4 col-sm-12">
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
            <div className="col-md-4 col-sm-12">
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
            <div className="col-md-4 col-sm-12">
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
            <div className="col-md-4 col-sm-12">
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
          </div>
        </div>
        <div className="card-footer">
          <div className="flexCenter colGap16">
            <Button
              variant="contained"
              onClick={handleAllFilters}
              className="btn cmnbtn btn-primary"
            >
              <i className="fas fa-search"></i> Search
            </Button>
            <Button
              variant="contained"
              onClick={handleClearAllFilter}
              className="btn cmnbtn btn-secondary"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Sale Booking Close</h5>
          <div className="flexCenter colGap12">
            <input
              type="text"
              placeholder="Search here"
              className="w-25 form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn cmnbtn btn_sm btn-success"
              onClick={(e) => open(e)}
            >
              Open ({openBtnCount})
            </button>
            <button
              className="btn cmnbtn btn_sm btn-danger"
              onClick={(e) => close(e)}
            >
              Closed({closeBtnCount})
            </button>
          </div>
        </div>
        <div className="card-body thm_table fx-head data_tbl table-responsive">
          <DataGrid
            rows={filterData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            state={{
              keyboard: {
                cell: null,
                columnHeader: null,
                isMultipleKeyPressed: false,
              },
            }}
            getRowId={(row) => filterData.indexOf(row)}
          />
        </div>
      </div>
    </>
  );
};

export default SaleBookingClose;
