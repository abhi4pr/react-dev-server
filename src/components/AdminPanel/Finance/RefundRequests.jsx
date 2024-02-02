import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import Button from "@mui/material/Button";
import ImageView from "./ImageView";
import {baseUrl} from '../../../utils/config'

const RefundRequests = () => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  // const [refundImage, setRefundImage] = useState(null);
  // const [singleRow, setSingleRow] = useState({})
  const [refundImage, setRefundImage] = useState([]);
  const [singleRow, setSingleRow] = useState({});
  const [imageChanged, setImageChanged] = useState(false);
  const [custName, setCustName] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundRequestFromDate, setRefundRequestFromDate] = useState("");
  const [refundRequestToDate, setRefundRequestToDate] = useState("");
  const [refundUpdateFromDate, setRefundUpdateFromDate] = useState("");
  const [refundUpdateToDate, setRefundUpdateToDate] = useState("");
  const [status, setStatus] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");


  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const uploadImage = async (e, row, index) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_refund_id", row.sale_booking_refund_id);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("refund_files", refundImage[index]);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=refund_payment_upload_file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        res.status === 200 && refundImage.splice(index, 1); // Remove the image from the array
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  const handleFileChange = (e, index) => {
    const newRefundImage = [...refundImage]; // Creating a new array
    newRefundImage[index] = e.target.files[0]; // Updating the specific index
    setRefundImage(newRefundImage); // Setting the new array as the state
    setImageChanged(!imageChanged); // Toggle the state to trigger re-render
  };

  const handleStatusChange = async (row, selectedStatus) => {
    setStatus(selectedStatus);

    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_refund_id", row.sale_booking_refund_id);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("refund_approval_status", selectedStatus);
    formData.append("refund_reason", "");
    formData.append("refund_finance_approval", 1);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=refund_finance_approval",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        getData();
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  const handleClear = () => {
    setCustName("");
    setRefundAmount("");
    setRefundRequestFromDate("");
    setRefundRequestToDate("");
    setRefundUpdateFromDate("");
    setRefundUpdateToDate("");
    setFilterData(datas);
  };

  const handleFilter = async () => {
    const result = datas
      .map((d, index) => ({
        ...d,
        key: index,
      }))
      .filter((d) => {
        const matchesCust =
          !custName ||
          (d.cust_name &&
            d.cust_name.toLowerCase().includes(custName.toLowerCase()));
        const matchesAmount =
          refundAmount === "" ||
          (d.refund_amount && Number(d.refund_amount) === Number(refundAmount));

        // const matchesStatus = status
        //   ? d.payment_approval_status === status.value
        //   : true;
        const refundRequestDate = (date, fromDate, toDate) => {
          const dateToCheck = new Date(date);
          const startDate = new Date(refundRequestFromDate);
          const endDate = new Date(refundRequestToDate);
          return (
            (dateToCheck.getTime() >= startDate.getTime() &&
              dateToCheck.getTime() <= endDate.getTime()) ||
            !fromDate ||
            !toDate
          );
        };
        const refundUpdateDate = (date, fromDate, toDate) => {
          const dateToCheck = new Date(date);
          const startDate = new Date(fromDate);
          const endDate = new Date(refundUpdateToDate);
          return (
            (dateToCheck.getTime() >= startDate.getTime() &&
              dateToCheck.getTime() <= endDate.getTime()) ||
            !fromDate ||
            !toDate
          );
        };

        return (
          matchesCust &&
          matchesAmount &&
          refundRequestDate(
            d.creation_date,
            refundRequestFromDate,
            refundRequestToDate
          ) &&
          refundUpdateDate(
            d.last_updated_date,
            refundUpdateFromDate,
            refundUpdateToDate
          )
        );
      });
    setFilterData(result);
  };

  function getData() {
    axios
      .post(baseUrl+"add_php_payment_refund_data_in_node")
      .then((res) => {
        console.log("data save in local success");
      });
    setTimeout(() => {
      axios
        .get(baseUrl+"get_all_php_payment_refund_data")
        .then((res) => {
          setData(res.data.data);
          setFilterData(res.data.data);
        });
    }, 1500);
  }

  function convertDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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
      sortable: true,
      width: "20%",
    },
    {
      name: "Refund Amount",
      selector: (row) => row.refund_amount,
      width: "15%",
    },
    {
      name: "Refund Request Reason",
      selector: (row) => row.finance_refund_reason,
      width: "20%",
    },
    {
      name: "Refund Request Date",
      // selector: (row) => row.creation_date,
      selector: (row) => {
        return <div>{convertDateToDDMMYYYY(row.creation_date)}</div>;
      },
      width: "15%",
    },

    {
      name: "Refund Updated Date",
      selector: (row) => convertDateToDDMMYYYY(row.last_updated_date),
      width: "15%",
    },
    {
      name: "Refund Payment Image",
      selector: (row, index) => (
        <>
          {row.finance_refund_status == 0 && (
            <form method="POST" encType="multipart/form-data" action="">
              <input
                type="file"
                name="refund_image"
                onChange={(e) => {
                  //   refundImage.splice(index, 1, e.target.files[0]);
                  //   console.log(index);
                  //   console.log(refundImage);
                  //   setImageChanged(!imageChanged); // Toggle the state to trigger re-render
                  handleFileChange(e, index);
                }}
              />
              <br />
              <input
                type="submit"
                value="upload"
                key={index}
                disabled={!refundImage[index] ? true : false}
                onClick={(e) => {
                  setSingleRow(row);
                  uploadImage(e, row, index);
                }}
              />
            </form>
          )}
        </>
      ),
      width: "20%",
    },
    {
      name: "Refund Payment Image",
      selector: (row, index) => (
        <>
         {row.refund_files&& <button
          className="btn btn-primary"
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(`https://sales.creativefuel.io/${row.refund_files}`);
          }}
        >
          View
        </button>}
        </>
      ),
      width: "20%",
    },
    {
      name: "Action",
      // selector: (row) => "Pending",
      cell: (row) => (
        <div>
          {" "}
          {row.finance_refund_status == 0 && (
            <>
              <select
                className="form-control"
                value={row.statusDropdown}
                onChange={(e) => handleStatusChange(row, e.target.value)}
              >
                <option value="">Select</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </>
          )}
          {row.finance_refund_status == 1 && (
            <div className="text-success btn">Approved</div>
          )}
          {row.finance_refund_status == 2 && (
            <div className="text-danger btn">Rejected</div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Payment Refund List"
        link="/admin/finance-refundrequests"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />
      <div className="row">
        <div className="card col-4">
          <div className="card-header fs-6 lead">Pending</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Pending Amount :- ₹{" "}
              {datas.length > 0
                ? datas
                    .filter((item) => item.finance_refund_status == 0)
                    .reduce((total, currentItem) => {
                      return total + currentItem.refund_amount * 1;
                    }, 0)
                : ""}
            </p>
            {/* <p className="card-text">0</p> */}
          </div>
        </div>
        <div className="card col-4">
          <div className="card-header fs-6 lead">Approved</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Approved Amount :- ₹{" "}
              {datas.length > 0
                ? datas
                    .filter((item) => item.finance_refund_status == 1)
                    .reduce((total, currentItem) => {
                      return total + currentItem.refund_amount * 1;
                    }, 0)
                : ""}
            </p>
            {/* <p className="card-text">0</p> */}
          </div>
        </div>
        <div className="card col-4">
          <div className="card-header fs-6 lead">Rejected</div>
          <div className="card-body">
            <p className="fs-6 lead ">
              Total Rejected Amount :- ₹{" "}
              {datas.length > 0
                ? datas
                    .filter((item) => item.finance_refund_status == 2)
                    .reduce((total, currentItem) => {
                      return total + currentItem.refund_amount * 1;
                    }, 0)
                : ""}
            </p>
            {/* <p className="card-text">0</p> */}
          </div>
        </div>
      </div>

      <div className="row">
        <div className=" col-2">
          <label htmlFor="">Customer Name</label>
          <input
            type="text"
            className="form-control"
            value={custName}
            // disabled
            onChange={(e) => {
              setCustName(e.target.value);
            }}
          />
        </div>
        <div className=" col-2">
          <label htmlFor="">Refund Amount</label>
          <input
            type="text"
            className="form-control"
            value={refundAmount}
            // disabled
            onChange={(e) => {
              setRefundAmount(e.target.value);
            }}
          />
        </div>

        <div className=" col-2">
          <label htmlFor="">Refund Request From Date </label>
          <input
            type="date"
            className="form-control"
            value={refundRequestFromDate}
            onChange={(e) => {
              setRefundRequestFromDate(e.target.value);
            }}
          />
        </div>
        <div className=" col-2">
          <label htmlFor="">Refund Request To Date </label>
          <input
            type="date"
            className="form-control"
            value={refundRequestToDate}
            onChange={(e) => {
              setRefundRequestToDate(e.target.value);
            }}
          />
        </div>

        <div className=" col-2">
          <label htmlFor="">Refund Update From Date </label>
          <input
            type="date"
            className="form-control"
            value={refundUpdateFromDate}
            onChange={(e) => {
              setRefundUpdateFromDate(e.target.value);
            }}
          />
        </div>
        <div className=" col-2">
          <label htmlFor="">Refund Update To Date </label>
          <input
            type="date"
            className="form-control"
            value={refundUpdateToDate}
            onChange={(e) => {
              setRefundUpdateToDate(e.target.value);
            }}
          />
        </div>

        <div className="col-2">
          <Button
            type="primary"
            variant="contained"
            onClick={handleFilter}
            className="mt-2 mb-2"
          >
            Search
          </Button>
        </div>
        <div className="col-2">
          <Button
            variant="contained"
            color="error"
            onClick={handleClear}
            className="mt-2 mb-2"
          >
            clear
          </Button>
        </div>
      </div>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="All Refund Requests"
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

      {openImageDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setOpenImageDialog}
        />
      )}
    </>
  );
};

export default RefundRequests;
