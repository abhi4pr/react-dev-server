import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { baseUrl } from "../../../utils/config";
// import { Autocomplete } from "@mui/material";
import { Autocomplete, Button, TextField } from "@mui/material";
// import { AutoComplete, Button, TextField } from "@mui/material";

const PaymentMode = () => {
  const { toastAlert } = useGlobalContext();
  const [displaySeq, setDisplaySeq] = useState("");
  const [heading, setHeading] = useState("");
  const [headingDesc, setHeadingDesc] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [title, setTitle] = useState("");
  const [bankName, setBankName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [gst, setGST] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(baseUrl + "", {
      display_sequence: displaySeq,
    });

    toastAlert("Coc created");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios.post(baseUrl + "add_php_payment_acc_data_in_node").then((res) => {});
    axios.get(baseUrl + "get_all_php_payment_acc_data").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
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
      return d.title?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  // Filters Logic :-
  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
      // Title Filter:-
      const titleFilterPassed =
        !title || item.title.toLowerCase().includes(title.toLowerCase());

      // Bank Name By Filter
      const bankNameFilterPassed =
        !bankName || item.detail.toLowerCase().includes(bankName.toLowerCase());
      // Payment Type Filter
      const paymentTypeFilterPassed =
        !paymentType ||
        item.payment_type.toLowerCase().includes(paymentType.toLowerCase());
      // row.gst_bank === 1 ? "GST" : "Non GST";
      // GST Bank Filter
      const gstFilterPassed =
        !gst ||
        (item.gst_bank === 1 && gst.toLowerCase() === "gst") ||
        (item.gst_bank !== 1 && gst.toLowerCase() === "non gst");

      // combining all logic
      const allFiltersPassed =
        titleFilterPassed &&
        bankNameFilterPassed &&
        paymentTypeFilterPassed &&
        gstFilterPassed;

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };

  const handleClearAllFilter = () => {
    setFilterData(datas);
    setBankName("");
    setPaymentType("");
    setGST("");
    setTitle("");
  };
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: <div style={{ whiteSpace: "normal" }}>Title</div>,
      selector: (row) => (
        <div style={{ whiteSpace: "normal" }}>{row.title}</div>
      ),
      width: "15%",
      sortable: false,
    },
    {
      name: "Detail",
      // selector: (row) =>  <div style={{ whiteSpace: 'normal' }}>{row.detail}
      //   <Button key={row.detail} variant="contained" color="primary" onClick={console.log('clicked')} style={{marginLeft: "10px"}}>Copy</Button>
      // </div>,
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
    },
    {
      name: "Payment Type",
      selector: (row) => row.payment_type,
      width: "12%",
    },
    {
      name: "GST Bank",

      width: "8%",
      selector: (row) => {
        return <div>{row.gst_bank === 1 ? "GST" : "Non GST"}</div>;
      },
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Payment Mode"
        link="/admin/finance-paymentmode"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label> Title</label>
            <Autocomplete
              value={title}
              onChange={(event, newValue) => setTitle(newValue)}
              options={Array.from(new Set(datas.map((option) => option.title)))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Title"
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
        <div className="col-md-3">
          <div className="form-group">
            <label> Bank Name</label>
            <Autocomplete
              value={bankName}
              onChange={(event, newValue) => setBankName(newValue)}
              options={Array.from(
                new Set(datas.map((option) => option.detail))
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bank Name"
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
        <div className="col-md-3">
          <div className="form-group">
            <label> Payment Type</label>
            <Autocomplete
              value={paymentType}
              onChange={(event, newValue) => setPaymentType(newValue)}
              options={datas.map((option) => option.payment_type)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Type"
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
        <div className="col-md-3">
          <div className="form-group">
            <label> GST</label>
            <Autocomplete
              value={gst}
              onChange={(event, newValue) => setGST(newValue)}
              options={datas.map((option) =>
                option.gst_bank === 1 ? "GST" : "Non GST"
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Type"
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

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Payment Mode"
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

export default PaymentMode;
