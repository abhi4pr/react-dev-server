import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import ImageView from "./ImageView";
import { baseUrl } from "../../../utils/config";

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

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(baseUrl+"", {
      display_sequence: displaySeq,
    });

    toastAlert("Coc created");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios
      .post(
        baseUrl+"add_php_pending_invoice_data_in_node"
      )
      .then((res) => {
        console.log("data save in local success");
      });
    let formData = new FormData();
    formData.append("loggedin_user_id", 36);
    axios
      .post(
        "https://salesdev.we-fit.in/webservices/RestController.php?view=sales-invoice_created_list",
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
          href={`https://salesdev.we-fit.in/${row.invoice}`}
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
            setViewImgSrc(`https://salesdev.we-fit.in/${row.invoice}`);
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
