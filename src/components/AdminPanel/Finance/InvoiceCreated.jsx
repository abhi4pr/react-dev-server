import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import ImageView from "./ImageView";
import { baseUrl } from "../../../utils/config";
import { Autocomplete, Button, TextField } from "@mui/material";

const InvoiceCreated = () => {
  const navigate = useNavigate();
  const { toastAlert } = useGlobalContext();
  const [displaySeq, setDisplaySeq] = useState("");
  const [heading, setHeading] = useState("");
  const [headingDesc, setHeadingDesc] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [campaignAmountFilter, setCampaignAmountFilter] = useState("");
  const [campaignAmountField, setCampaignAmountField] = useState("");
  const [invoiceParticularName, setInvoiceParticularName] = useState("");

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
    axios
      .post(baseUrl + "add_php_pending_invoice_data_in_node")
      .then((res) => {});
    let formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-invoice_created_list",
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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.cust_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleAllFilters = () => {
    const filterData = datas.filter((item) => {
      // Customer Name Filter:-
      const customerNameFilterPassed =
        !customerName ||
        item.cust_name.toLowerCase().includes(customerName.toLowerCase());
      // Invoice Particular Filter:-
      const invoiceParticularNameFilterPassed =
        !invoiceParticularName ||
        item.invoice_particular_name
          .toLowerCase()
          .includes(invoiceParticularName.toLowerCase());
      // campaign amount filter:-
      const campaignAmountFilterPassed = () => {
        const campaignAmounttData = parseFloat(campaignAmountField);
        switch (campaignAmountFilter) {
          case "greaterThan":
            return +item.campaign_amount > campaignAmounttData;
          case "lessThan":
            return +item.campaign_amount < campaignAmounttData;
          case "equalTo":
            return +item.campaign_amount === campaignAmounttData;
          default:
            return true;
        }
      };
      const allFiltersPassed =
        customerNameFilterPassed &&
        invoiceParticularNameFilterPassed &&
        campaignAmountFilterPassed();

      return allFiltersPassed;
    });
    setFilterData(filterData);
  };
  const handleClearAllFilter = () => {
    setFilterData(datas);
    setCustomerName("");
    setCampaignAmountField("");
    setCampaignAmountFilter("");
  };
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Customer name",
      selector: (row) => row.cust_name,
    },
    {
      name: "Invoice Particular",
      selector: (row) => row.invoice_particular_name,
    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
    },
    {
      name: "Download Invoice",
      cell: (row) => (
        <a
          className="btn btn-primary"
          href={`https://sales.creativefuel.io/${row.invoice}`}
          target="_blank"
          rel="noreferrer"
          download // Add the 'download' attribute to trigger the download
        >
          Download
        </a>
      ),
    },
    {
      name: "View Invoice",
      // selector: (row) => row.vendor_name,
      cell: (row) => (
        <button
          className="btn btn-primary"
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(`https://sales.creativefuel.io/${row.invoice}`);
          }}
        >
          View
        </button>
      ),
    },
    {
      name: "Remark",
      selector: (row) => row.invoice_remark,
      width: "250px",
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Pending Invoice "
        link="/admin/incentive-payment-list"
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
            <label>Customer Name</label>
            <Autocomplete
              value={customerName}
              onChange={(event, newValue) => setCustomerName(newValue)}
              options={datas.map((option) => option.cust_name)}
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
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Invoice Particular</label>
            <Autocomplete
              value={invoiceParticularName}
              onChange={(event, newValue) => setInvoiceParticularName(newValue)}
              options={datas.map((option) => option.invoice_particular_name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Invoice Particular"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    className: "form-control", // Apply Bootstrap's form-control class
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="col-md-3">
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
        <div className="col-md-3">
          <div className="form-group">
            <label>Campaign Amount</label>
            <input
              value={campaignAmountField}
              type="number"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setCampaignAmountField(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-md-1 mt-1 me-2">
          <Button variant="contained" onClick={handleAllFilters}>
            <i className="fas fa-search"></i> Search
          </Button>
        </div>
        <div className="col-md-1 mt-1">
          <Button variant="contained" onClick={handleClearAllFilter}>
            Clear
          </Button>
        </div>
      </div>
      <div className="card mt-3">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Invoice Created"
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
      {openImageDialog && (
        <ImageView
          viewImgSrc={viewImgSrc}
          setViewImgDialog={setOpenImageDialog}
        />
      )}
    </>
  );
};

export default InvoiceCreated;
