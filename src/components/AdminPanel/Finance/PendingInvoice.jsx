import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const PendingInvoice = () => {
  const navigate = useNavigate();
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [inoiceNum, setInoiceNum] = useState("");
  const [date, setDate] = useState(dayjs());

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleReject = async (row) => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", row.sale_booking_id);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=invoice_reject",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        axios
          .put(baseUrl + "pending_invoice_update", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            getData();
            setDate(dayjs());
            setInoiceNum("");
            setPartyName("");
          });
      });

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  const handleImageUpload = async (row, fileData) => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("invoiceFormSubmit", 1);
    formData.append("invoice", fileData);
    formData.append("invoice_mnj_number", inoiceNum);
    formData.append(
      "invoice_mnj_date",
      new Date(date.$d).toISOString().split("T")[0]
    );
    formData.append("party_mnj_name", partyName);

    await axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=invoice_upload_file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        toastAlert("Data updated");
        axios
          .put(baseUrl + "pending_invoice_update", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            console.log("data save in local success");
            getData();
          });
      });
  };

  function getData() {
    axios.post(baseUrl + "add_php_pending_invoice_data_in_node").then((res) => {
      console.log("data save in local success");
    });
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-pending_invoice_creation_list",
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

  const convertDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
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
      width: "5%",
      sortable: true,
    },
    {
      name: "Sales Person name",
      selector: (row) => row.sales_person_username,
      width: "10%",
    },
    {
      name: "Requested On Date",
      // selector: (row) => row.sale_booking_date,
      cell: (row) => convertDateToDDMMYYYY(row.sale_booking_date),
      width: "12%",
    },
    {
      name: "Sale Booking Description",
      selector: (row) => row.description,
      width: "17%",
    },
    {
      name: "Customer Name",
      // selector: (row) => row.cust_name,
      cell: (row) => (
        <>
          <Link
            className="text-primary"
            to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}
          >
            {row.cust_name}
          </Link>
        </>
      ),
      width: "15%",
    },

    {
      name: "Input",
      selector: (row, index) => (
        <div className="mt-2">
          <TextField
            key={row.sale_booking_id}
            className="d-block"
            type="text"
            name="input"
            label="Invoice No."
            sx={{
              marginBottom: "1px",
              "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                padding: "12px ",
              },
            }}
            onChange={(e) => setInoiceNum(e.target.value)}
          />
          {/* //invoice num , date , party name */}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                key={row.sale_booking_id}
                sx={{
                  "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                    padding: "10px",
                  },
                }}
                defaultValue={dayjs()}
                onChange={(e) => {
                  setDate(e),
                    console.log(new Date(e.$d).toISOString().split("T")[0]);
                }}
              />
            </LocalizationProvider>
          </div>
          <div>
            <TextField
              key={row.sale_booking_id}
              
              type="text"
              name="input"
              label="Party Name"
              sx={{
                marginBottom: "1px",
                "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                  padding: "12px ",
                },
              }}
              onChange={(e) => setPartyName(e.target.value)}
            />
          </div>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Upload Invoice",
      selector: (row, index) => (
        <div key={row.sale_booking_id}>
          <form>
            <input
              key={index}
              type="file"
              name="upload_image"
              onChange={(e) => handleImageUpload(row, e.target.files[0])}
            />
            {/* <button type="submit" value="upload">
              Upload
            </button> */}
          </form>
          <br />
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handleReject(row)}
          >
            Reject
          </button>
        </div>
      ),
      width: "20%",
    },
    {
      name: "Invoice Particular Name",
      selector: (row) => row.invoice_particular_name,
      width: "15%",
    },
    {
      name: "Invoice Type",
      selector: (row) => row.invoice_type_name,
      width: "15%",
    },
    {
      name: "Base Amount",
      selector: (row) => row.base_amount,
      width: "9%",
    },
    {
      name: "GST Amount",
      selector: (row) => row.gst_amount,
      width: "9%",
    },
    {
      name: "Net Amount",
      selector: (row) => row.net_amount,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //     <Link to={`/admin/finance-pendinginvoice/customer-details/${row.cust_id}`}>
    //       <button className="btn btn-primary" >
    //         Customer Details
    //       </button>
    //     </Link>
    //     </>
    //   ),
    // },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Pending invoice "
        link="/admin/incentive-payment-list"
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
            title="Pending Invoice Creation"
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

export default PendingInvoice;
