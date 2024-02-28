import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import ImageView from "./ImageView";
import { baseUrl } from "../../../utils/config";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [uniqueCustomerDialog, setUniqueCustomerDialog] = useState(false);
  const [uniqueCustomerData, setUniqueCustomerData] = useState([]);
  const [sameCustomerDialog, setSameCustomerDialog] = useState(false);
  const [sameCustomerData, setSameCustomerData] = useState([]);

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
        // For Unique Customers
        const custData = res.data.body;
        const uniqueCustomers = new Set(custData.map((item) => item.cust_name));
        setUniqueCustomerCount(uniqueCustomers.size);
        const uniqueCustomerData = Array.from(uniqueCustomers).map(
          (customerName) => {
            return custData.find((item) => item.cust_name === customerName);
          }
        );
        setUniqueCustomerData(uniqueCustomerData);
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
      // const invoiceParticularNameFilterPassed =
      //   !invoiceParticularName ||
      //   item.invoice_particular_name
      //     .toLowerCase()
      //     .includes(invoiceParticularName.toLowerCase());
      const invoiceParticularNameFilterPassed =
        !invoiceParticularName ||
        (item.invoice_particular_name &&
          item.invoice_particular_name
            .toLowerCase()
            .includes(invoiceParticularName.toLowerCase()));
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
    setInvoiceParticularName("");
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

  // Total base amount:-
  const campaignAmountTotal = datas.reduce(
    (total, item) => total + parseFloat(item.campaign_amount),
    0
  );

  const sameCustomercolumn = [
    {
      field: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      field: "Customer name",
      fieldName: "cust_name",
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "Invoice Particular",
      fieldName: "invoice_particular_name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Remark",
      fieldName: "invoice_remark",
      renderCell: (params) => params.row.invoice_remark,
      width: "250px",
    },
  ];
  const uniqueCustomercolumn = [
    {
      field: "S.No",
      renderCell: (params, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      field: "Customer name",
      fieldName: "cust_name",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleOpenSameCustomer(params.row.cust_name)}
        >
          {params.row.cust_name}
        </div>
      ),
    },
    {
      field: "Invoice Particular",
      fieldName: "invoice_particular_name",
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Download Invoice",
      fieldName: "invoice",
      renderCell: (params) => (
        <a
          className="btn btn-primary"
          href={`https://sales.creativefuel.io/${params.row.invoice}`}
          target="_blank"
          rel="noreferrer"
          download // Add the 'download' attribute to trigger the download
        >
          Download
        </a>
      ),
    },
    {
      field: "View Invoice",
      renderCell: (params) => (
        <button
          className="btn btn-primary"
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(
              `https://sales.creativefuel.io/${params.row.invoice}`
            );
          }}
        >
          View
        </button>
      ),
    },
    {
      field: "Remark",
      fieldName: "invoice_remark",
      renderCell: (params) => params.row.invoice_remark,
      width: "250px",
    },
  ];
  const columns = [
    {
      width: 60,
      field: "S.No",
      fieldName: "s_no",
      renderCell: (params, index) => (
        // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>

        <div>{[...datas].indexOf(params.row) + 1}</div>
      ),
      sortable: true,
    },
    {
      field: "Customer name",
      fieldName: "cust_name",
      width: 340,
      renderCell: (params) => params.row.cust_name,
    },
    {
      field: "Invoice Particular",
      fieldName: "invoice_particular_name",
      width: 210,
      renderCell: (params) => params.row.invoice_particular_name,
    },
    {
      field: "Campaign Amount",
      fieldName: "campaign_amount",
      width: 210,
      renderCell: (params) => params.row.campaign_amount,
    },
    {
      field: "Download Invoice",
      fieldName: "invoice",
      width: 210,
      renderCell: (params) => (
        <a
          className="btn btn-primary"
          href={`https://sales.creativefuel.io/${params.row.invoice}`}
          target="_blank"
          rel="noreferrer"
          download // Add the 'download' attribute to trigger the download
        >
          Download
        </a>
      ),
    },
    {
      field: "View Invoice",
      fieldName: "invoice",
      width: 210,
      renderCell: (params) => (
        <button
          className="btn btn-primary"
          onClick={() => {
            setOpenImageDialog(true);
            setViewImgSrc(
              `https://sales.creativefuel.io/${params.row.invoice}`
            );
          }}
        >
          View
        </button>
      ),
    },
    {
      field: "Remark",
      fieldName: "invoice_remark",
      renderCell: (params) => params.row.invoice_remark,
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
        uniqueCustomerCount={uniqueCustomerCount}
        campaignAmountTotal={campaignAmountTotal}
        handleOpenUniqueCustomerClick={handleOpenUniqueCustomerClick}
        invoiceCreatedPaymentAdditionalTitles={true}
      />
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
          }} getRowId={(row) => uniqueCustomerData.indexOf(row)}

        />
      </Dialog>
      <div className="row">
        <div className="col-md-3">
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
              options={Array.from(
                new Set(
                  datas
                    .filter(
                      (option) =>
                        option &&
                        option.invoice_particular_name !== null &&
                        option.invoice_particular_name !== undefined
                    ) // Filter out null or undefined values
                    .map((option) =>
                      option.invoice_particular_name.toLowerCase()
                    ) // Convert to lowercase here
                )
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Invoice Particular"
                  type="text"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    className: "form-control",
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
