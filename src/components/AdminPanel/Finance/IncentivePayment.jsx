import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
  const [paymentDate, setPaymentDate] = useState(dayjs(new Date()));
  const [paymentType, setPaymentType] = useState("Full Payment");
  const [partialPaymentReason, setPartialPaymentReason] = useState("");
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [salesExecutive, setSalesExecutive] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [requestAmountFilter, setRequestAmountFilter] = useState("");
  const [requestedAmountField, setRequestAmountField] = useState("");
  const [releasedAmountFilter, setReleasedAmountFilter] = useState("");
  const [releasedAmountField, setReleasedAmountField] = useState("");
  const [balanceAmountFilter, setBalanceAmountFilter] = useState("");
  const [balanceAmountField, setBalanceAmountField] = useState("");
  const [uniqueSalesExecutiveCount, setUniqueSalesExecutiveCount] =
    useState("");
  const [uniqueSalesExecutiveDialog, setUniqueSalesExecutiveDialog] =
    useState("");
  const [uniqueSalesExecutiveData, setUniqueSalesExecutiveData] = useState("");
  const [sameSalesExecutiveDialog, setSameSalesExecutiveDialog] = useState("");
  const [sameSalesExecutiveData, setSameSalesExecutiveData] = useState("");

  const DateFormateToYYYYMMDD = (date) => {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${ye}-${mo}-${da}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios
      .put(baseUrl + "edit_php_payment_incentive_data", {
        incentive_request_id: selectedData.incentive_request_id,
        requested_amount: selectedData.request_amount,
        payment_type: paymentType,
        reason: partialPaymentReason,
        requested_date: DateFormateToYYYYMMDD(
          selectedData.request_creation_date
        ),
        paid_amount: balanceReleaseAmount,
      })
      .then((res) => {});

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("incentive_request_id", selectedData.incentive_request_id);
    formData.append("account_number", accountNo);
    formData.append("remarks", remarks);
    formData.append("payment_ref_no", paymentRef);
    formData.append("sales_executive_id", selectedData.sales_executive_id);
    formData.append("release_amount", balanceReleaseAmount);
    formData.append("payment_date", DateFormateToYYYYMMDD(paymentDate));
    formData.append("payment_type", paymentType);
    formData.append("partial_payment_reason", partialPaymentReason);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=release_incentive_submit",
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
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios
      .post(baseUrl + "add_php_payment_incentive_data_in_node")
      .then(() => {});
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-incentive_request_list",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        // Set data received from the API response
        setData(res.data.body);
        setFilterData(res.data.body);
        const salesExecuteiveData = res.data.body;
        const uniqueSalesEx = new Set(
          salesExecuteiveData.map((item) => item.sales_executive_name)
        );
        setUniqueSalesExecutiveCount(uniqueSalesEx.size);
        const SEData = [];
        uniqueSalesEx.forEach((vendorName) => {
          const salesRows = salesExecuteiveData.filter(
            (item) => item.sales_executive_name === vendorName
          );
          SEData.push(salesRows[0]);
        });
        setUniqueSalesExecutiveData(SEData);
        // Calculate totals
        let totalRequestAmount = 0;
        let totalReleasedAmount = 0;
        let totalBalanceReleaseAmount = 0;

        res.data.body.forEach((row) => {
          totalRequestAmount += +row.request_amount;
          totalReleasedAmount += +row.released_amount || 0;
          totalBalanceReleaseAmount += +row.balance_release_amount;
        });

        // Create total row
        const totalRow = {
          request_amount: totalRequestAmount,
          released_amount: totalReleasedAmount,
          balance_release_amount: totalBalanceReleaseAmount,
          sales_executive_name: "Total",
        };

        // Append total row to the end of the data
        setData((prevData) => [...prevData, totalRow]);
        setFilterData((prevData) => [...prevData, totalRow]);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
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

  //  All Filters :-
  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
      const date = new Date(item.request_creation_date);
      const fromDate1 = new Date(fromDate);
      const toDate1 = new Date(toDate);
      toDate1.setDate(toDate1.getDate() + 1);
      // Date Range Filter:-
      const dateFilterPassed =
        !fromDate || !toDate || (date >= fromDate1 && date <= toDate1);
      // Sales Executive Filter:-
      const salesExecutiveFilterPassed =
        !salesExecutive ||
        item.sales_executive_name
          .toLowerCase()
          .includes(salesExecutive.toLowerCase());
      // request amount filter:-
      const requestAmountFilterPassed = () => {
        const requestAmount = parseFloat(requestedAmountField);
        switch (requestAmountFilter) {
          case "greaterThan":
            return +item.request_amount > requestAmount;
          case "lessThan":
            return +item.request_amount < requestAmount;
          case "equalTo":
            return +item.request_amount === requestAmount;
          default:
            return true;
        }
      };
      const releasedAmountFilterPassed = () => {
        const releasedAmount = parseFloat(releasedAmountField);
        switch (releasedAmountFilter) {
          case "greaterThan":
            return +item.released_amount > releasedAmount;
          case "lessThan":
            return +item.released_amount < releasedAmount;
          case "equalTo":
            return +item.released_amount === releasedAmount;
          default:
            return true;
        }
      };
      const balancetAmountFilterPassed = () => {
        const balanceAmount = parseFloat(balanceAmountField);
        switch (balanceAmountFilter) {
          case "greaterThan":
            return +item.balance_release_amount > balanceAmount;
          case "lessThan":
            return +item.balance_release_amount < balanceAmount;
          case "equalTo":
            return +item.balance_release_amount === balanceAmount;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        dateFilterPassed &&
        salesExecutiveFilterPassed &&
        requestAmountFilterPassed() &&
        releasedAmountFilterPassed() &&
        balancetAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };
  const handleClearAllFilter = () => {
    setFilterData(datas);
    setFromDate("");
    setToDate("");
    setSalesExecutive("");
    setRequestAmountFilter("");
    setRequestAmountField("");
    setReleasedAmountField("");
    setReleasedAmountFilter("");
    setBalanceAmountField("");
    setBalanceAmountFilter("");
  };

  const handleOpenUniqueSalesExecutive = () => {
    setUniqueSalesExecutiveDialog(true);
  };

  const handleCloseUniquesalesExecutive = () => {
    setUniqueSalesExecutiveDialog(false);
  };

  const handleOpenSameSalesExecutive = (salesEName) => {
    setSameSalesExecutiveDialog(true);

    const sameNameSalesExecutive = datas.filter(
      (item) => item.sales_executive_name === salesEName
    );
    // Calculate the total amount for vendors with the same name
    // const totalAmount = sameNameVendors.reduce(
    //   (total, item) => total + item.request_amount,
    //   0
    // );

    // Set the selected vendor data including the vendor name, data, and total amount
    setSameSalesExecutiveData(sameNameSalesExecutive);
  };

  const handleCloseSameSalesExecutive = () => {
    setSameSalesExecutiveDialog(false);
  };

  // const calculateRequestedAmountTotal = () => {
  //   let totalAmount = 0;
  //   uniqueSalesExecutiveData.forEach((customer) => {
  //     totalAmount += parseFloat(customer.request_amount);
  //   });
  //   return totalAmount;
  // };
  // const requestedAmountTotal = calculateRequestedAmountTotal();
  const requestedAmountTotal = filterData.reduce(
    (total, item) => total + parseFloat(item.request_amount) / 2,
    0
  );

  const sameSalesExecutivecolumn = [
    {
      field: "s._no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...sameSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive Name",
      renderCell: (params) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleOpenSameSalesExecutive(params.row.sales_executive_name)
            }
          >
            {params.row.sales_executive_name}
          </div>
        );
      },
    },
    {
      headerName: "Requested Date & Time",
      field: "request_creation_date",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total"
          ? new Date(params.row.request_creation_date).toLocaleDateString(
              "en-IN"
            ) +
            " " +
            new Date(params.row.request_creation_datee).toLocaleTimeString(
              "en-IN"
            )
          : null,
    },
    {
      headerName: "Request Amount",
      field: "request_amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          params.row.request_amount
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {" "}
            {params.row.request_amount}
          </div>
        ),
    },
    {
      headerName: "Released Amount",
      field: "released_amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          <Link
            to={`/admin/Incentive-Request-Released-List/${params.row.incentive_request_id}`}
            className="link-primary"
          >
            {params.row.released_amount
              ? params.row.released_amount?.toLocaleString("en-IN")
              : 0}
          </Link>
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {params.row.released_amount?.toLocaleString("en-IN")}
          </div>
        ),
    },
    {
      headerName: "Balance Release Amount",
      field: "balance_release_amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          params.row.balance_release_amount?.toLocaleString("en-IN")
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {params.row.balance_release_amount}
          </div>
        ),
    },
    {
      headerName: "Status",
      width: "15%",
      renderCell: (params) => {
        return params.row.action == "Complete Release Button" ? (
          <button
            className="btn btn-sm btn-outline-info"
            data-toggle="modal"
            data-target="#incentiveModal"
            onClick={() => {
              setSelectedData(row),
                setBalanceReleaseAmount(params.row.balance_release_amount);
              setAccountNo("");
              setRemarks("");
              setModalOpen(true);
            }}
          >
            Complete Release
          </button>
        ) : (
          <span>{params.row.action}</span>
        );
      },
    },
    {
      headerName: "Aging",
      renderCell: (params) => {
        const currentDate = new Date(
          params.row.action == "Complete Release Button"
            ? new Date()
            : params.row.request_creation_date
        );
        const requestedDate = new Date(
          params.row.action == "Complete Release Button"
            ? params.row.request_creation_date
            : params.row.payment_date
        );
        const diffTime = Math.abs(currentDate - requestedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return params.row.sales_executive_name !== "Total" ? diffDays : null;
      },
    },
  ];
  const uniqueSalesExecutivecolumn = [
    {
      field: "s._no",
      headerName: "S.No",
      renderCell: (params, index) => (
        <div>{[...uniqueSalesExecutiveData].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "sales_executive_name",
      headerName: "Sales Executive name",
      renderCell: (params) => {
        console.log(params.row);
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleOpenSameSalesExecutive(params.row.sales_executive_name)
            }
          >
            {params.row.sales_executive_name}
          </div>
        );
      },
    },
    {
      field: "request_creation_date",
      headerName: "Requested Date & Time",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total"
          ? new Date(params.row.request_creation_date).toLocaleDateString(
              "en-IN"
            ) +
            " " +
            new Date(params.row.request_creation_datee).toLocaleTimeString(
              "en-IN"
            )
          : null,
    },
    {
      field: "request_amount",
      headerName: "Request Amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          params.row.request_amount
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {" "}
            {params.row.request_amount}
          </div>
        ),
    },
    {
      field: "released_amount",
      headerName: "Released Amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          <Link
            to={`/admin/Incentive-Request-Released-List/${params.row.incentive_request_id}`}
            className="link-primary"
          >
            {params.row.released_amount
              ? params.row.released_amount?.toLocaleString("en-IN")
              : 0}
          </Link>
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {params.row.released_amount?.toLocaleString("en-IN")}
          </div>
        ),
    },
    {
      field: "balance_release_amount",
      headerName: "Balance Release Amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          params.row.balance_release_amount?.toLocaleString("en-IN")
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {params.row.balance_release_amount}
          </div>
        ),
    },
    {
      field: "Status",
      width: "15%",
      renderCell: (params) => {
        return params.row.action == "Complete Release Button" ? (
          <button
            className="btn btn-sm btn-outline-info"
            data-toggle="modal"
            data-target="#incentiveModal"
            onClick={() => {
              setSelectedData(row),
                setBalanceReleaseAmount(params.row.balance_release_amount);
              setAccountNo("");
              setRemarks("");
              setModalOpen(true);
            }}
          >
            Complete Release
          </button>
        ) : (
          <span>{params.row.action}</span>
        );
      },
    },
    {
      field: "Aging",
      renderCell: (params) => {
        const currentDate = new Date(
          params.row.action == "Complete Release Button"
            ? new Date()
            : params.row.request_creation_date
        );
        const requestedDate = new Date(
          params.row.action == "Complete Release Button"
            ? params.row.request_creation_date
            : params.row.payment_date
        );
        const diffTime = Math.abs(currentDate - requestedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return params.row.sales_executive_name !== "Total" ? diffDays : null;
      },
    },
  ];
  const columns = [
    {
      width: 70,
      headerName: "S.No",
      field: "s_no",
      renderCell: (params, index) =>
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>
        filterData.indexOf(params.row) + 1 === filterData.length ? (
          ""
        ) : (
          <div>{filterData.indexOf(params.row) + 1}</div>
        ),
      sortable: true,
    },
    {
      headerName: "Sales Executive Name",
      width: 230,
      field: "sales_executive_name",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          <Link
            to={`/admin/Incentive-Request-Released-List/${params.row.incentive_request_id}`}
            className="link-primary"
          >
            {params.row.sales_executive_name}
          </Link>
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {" "}
            {params.row.sales_executive_name}
          </div>
        ),
    },
    {
      headerName: "Requested Date & Time",
      width: 230,
      field: "request_creation_date",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total"
          ? new Date(params.row.request_creation_date).toLocaleDateString(
              "en-IN"
            ) +
            " " +
            new Date(params.row.request_creation_date).toLocaleTimeString(
              "en-IN"
            )
          : null,
    },
    {
      headerName: "Request Amount",
      width: 230,
      field: "request_amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          params.row.request_amount
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {" "}
            {params.row.request_amount}
          </div>
        ),
    },
    {
      headerName: "Released Amount",
      width: 230,
      field: "released_amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          <Link
            to={`/admin/Incentive-Request-Released-List/${params.row.incentive_request_id}`}
            className="link-primary"
          >
            {params.row.released_amount
              ? params.row.released_amount?.toLocaleString("en-IN")
              : 0}
          </Link>
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {params.row.released_amount?.toLocaleString("en-IN")}
          </div>
        ),
    },
    {
      headerName: "Balance Release Amount",
      width: 230,
      field: "balance_release_amount",
      renderCell: (params) =>
        params.row.sales_executive_name !== "Total" ? (
          params.row.balance_release_amount?.toLocaleString("en-IN")
        ) : (
          <div className="fs-6 font-bold text-black-50">
            {params.row.balance_release_amount}
          </div>
        ),
    },
    {
      field: "Status",
      headerName: "Status",
      width: 230,
      renderCell: (params) => {
        return params.row.action == "Complete Release Button" ? (
          <button
            className="btn btn-sm btn-outline-info"
            data-toggle="modal"
            data-target="#incentiveModal"
            onClick={() => {
              setSelectedData(params.row),
                setBalanceReleaseAmount(params.row.balance_release_amount);
              setAccountNo("");
              setRemarks("");
              setModalOpen(true);
            }}
          >
            Complete Release
          </button>
        ) : (
          <span>{params.row.action}</span>
        );
      },
    },
    {
      field: "Aging",
      headerName: "Aging",
      renderCell: (params) => {
        const currentDate = new Date(
          params.row.action == "Complete Release Button"
            ? new Date()
            : params.row.request_creation_date
        );
        const requestedDate = new Date(
          params.row.action == "Complete Release Button"
            ? params.row.request_creation_date
            : params.row.payment_date
        );
        const diffTime = Math.abs(currentDate - requestedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return params.row.sales_executive_name !== "Total" ? diffDays : null;
      },
    },
  ];

  const handlePendingFilterData = () => {
    const result = datas.filter((d) => {
      return d.action == "Complete Release Button";
    });

    let totalRequestAmount = 0;
    let totalReleasedAmount = 0;
    let totalBalanceReleaseAmount = 0;

    result.forEach((row) => {
      totalRequestAmount += +row.request_amount;
      totalReleasedAmount += +row.released_amount || 0;
      totalBalanceReleaseAmount += +row.balance_release_amount;
    });

    // Create total row
    const totalRow = {
      request_amount: totalRequestAmount,
      released_amount: totalReleasedAmount,
      balance_release_amount: totalBalanceReleaseAmount,
      sales_executive_name: "Total",
    };

    setFilterData([...result, totalRow]);
  };

  const handleCompleteFilterData = () => {
    const result = datas.filter((d) => {
      return d.action == "Released";
    });

    let totalRequestAmount = 0;
    let totalReleasedAmount = 0;
    let totalBalanceReleaseAmount = 0;

    result.forEach((row) => {
      totalRequestAmount += +row.request_amount;
      totalReleasedAmount += +row.released_amount || 0;
      totalBalanceReleaseAmount += +row.balance_release_amount;
    });

    // Create total row
    const totalRow = {
      request_amount: totalRequestAmount,
      released_amount: totalReleasedAmount,
      balance_release_amount: totalBalanceReleaseAmount,
      sales_executive_name: "Total",
    };
    setFilterData([...result, totalRow]);
  };

  useEffect(() => {
    balanceReleaseAmount * 1 + selectedData.released_amount * 1 ==
    selectedData.request_amount
      ? setPaymentType("Full Payment")
      : setPaymentType("Partial Payment");
    setPartialPaymentReason("");
  }, [balanceReleaseAmount]);

  return (
    <>
      <FormContainer
        mainTitle="Incentive Disbursement Request"
        link="/admin/incentive-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
        handleOpenUniqueSalesExecutive={handleOpenUniqueSalesExecutive}
        uniqueSalesExecutiveCount={uniqueSalesExecutiveCount}
        requestedAmountTotal={requestedAmountTotal}
        incentivePaymentAdditionalTitles={true}
      />

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
        <DialogTitle>Same Vendors</DialogTitle>
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
          <DataGrid
            rows={sameSalesExecutiveData}
            columns={sameSalesExecutivecolumn}
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
            getRowId={(row) => sameSalesExecutiveData.indexOf(row)}
          />
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
          <DataGrid
            rows={uniqueSalesExecutiveData}
            columns={uniqueSalesExecutivecolumn}
            fullWidth={"md"}
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
        </DialogContent>
      </Dialog>
      <div className="card body-padding">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>Sales Executive</label>
              <Autocomplete
                value={salesExecutive}
                onChange={(event, newValue) => setSalesExecutive(newValue)}
                options={Array.from(
                  new Set(
                    datas
                      .filter(
                        (option) => option.sales_executive_name !== "Total"
                      )
                      .map((option) => option.sales_executive_name)
                  )
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
          <div className="col-md-4">
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
          <div className="col-md-4">
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
              <label>Requested Amount Filter</label>
              <select
                value={requestAmountFilter}
                className="form-control"
                onChange={(e) => setRequestAmountFilter(e.target.value)}
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
              <label>Requested Amount</label>
              <input
                value={requestedAmountField}
                type="number"
                placeholder="Requested Amount"
                className="form-control"
                onChange={(e) => {
                  setRequestAmountField(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>Released Amount Filter</label>
              <select
                value={releasedAmountFilter}
                className="form-control"
                onChange={(e) => setReleasedAmountFilter(e.target.value)}
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
              <label>Released Amount</label>
              <input
                value={releasedAmountField}
                type="number"
                placeholder="Released Amount"
                className="form-control"
                onChange={(e) => {
                  setReleasedAmountField(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label> Balance Released Amount Filter</label>
              <select
                value={balanceAmountFilter}
                className="form-control"
                onChange={(e) => setBalanceAmountFilter(e.target.value)}
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
              <label> Balance Released Amount</label>
              <input
                value={balanceAmountField}
                type="number"
                placeholder="Request Amount"
                className="form-control"
                onChange={(e) => {
                  setBalanceAmountField(e.target.value);
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
      </div>
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
            <label>Request Amount</label>
            <input
              type="number"
              className="form-control"
              value={selectedData.request_amount}
              readOnly
            />

            <label>Balance To Release</label>
            <input
              type="number"
              className="form-control"
              value={
                selectedData.balance_release_amount
                  ? selectedData.balance_release_amount
                  : 0
              }
              readOnly
            />

            <label>
              Paid Amount <sup className="text-danger">*</sup>
            </label>
            <input
              className="form-control"
              id="images"
              name="images"
              required
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

            <label> Payment Type</label>
            <input
              className="form-control"
              type="text"
              value={paymentType}
              readOnly
            />

            {paymentType === "Partial Payment" && (
              <div>
                <label>
                  Partial Payment Reason <sup className="text-danger">*</sup>
                </label>
                <Autocomplete
                  placeholder="Partial Payment Reason"
                  disablePortal
                  value={partialPaymentReason}
                  onChange={(e, value) => setPartialPaymentReason(value)}
                  options={[
                    "Fund Management",
                    "Tax Deduction",
                    "Bad Depth Adjustment",
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={paymentType === "Partial Payment"}
                    />
                  )}
                />
              </div>
            )}

            <label>
              Last 4 digit of account Number{" "}
              <sup className="text-danger">*</sup>
            </label>
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
            <label>Payment ref number </label>
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={paymentDate}
                className="mt-3 w-100 mb"
                format="DD/MM/YYYY"
                onChange={(e) => setPaymentDate(e)}
                label="Payment Date"
              />
            </LocalizationProvider>
            <button
              type="submit"
              className="btn btn-primary d-block"
              style={{ marginTop: "15px" }}
            >
              Submit
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="card">
        <div className="data_tbl table-responsive">
          <div>
            <div className="float-end">
              <Button
                variant="contained"
                color="error"
                onClick={() => getData()}
              >
                Refresh
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                className="me-2"
                onClick={handlePendingFilterData}
              >
                Pending
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleCompleteFilterData}
              >
                Completed
              </Button>
            </div>
          </div>
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
            getRowId={(row) => filterData.indexOf(row)}
          />
        </div>
      </div>
    </>
  );
};

export default IncentivePayment;
