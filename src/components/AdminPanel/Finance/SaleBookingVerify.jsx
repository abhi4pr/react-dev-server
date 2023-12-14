import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import Modal from "react-modal";

const SaleBookingVerify = () => {
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [balAmount, setBalAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [ImageModalOpen, setImageModalOpen] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async (e, row) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append("loggedin_user_id",36)
    formData.append("sale_booking_id",row.sale_booking_id)
    formData.append("verified_amount",balAmount)
    formData.append("verified_remark",remark)

    await axios.post("https://production.sales.creativefuel.io/webservices/RestController.php?view=verifybooking", formData, {
      headers:{
        "application-type":"multipart/form-data"
      }
    });

    toastAlert("Data Updated");
    setIsFormSubmitted(true);
  };

  const handleImageClick = (row) => {
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  function getData() {
    axios.post("http://34.93.221.166:3000/api/add_php_sale_booking_tds_verification_data_in_node").then((res)=>{
      console.log('data save in local success')
    })
    axios.get("http://34.93.221.166:3000/api/get_all_php_sale_booking_tds_verification_data").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
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
      selector: (row) => (
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleImageClick(row)}
        >
          Verify
        </button>
      ),
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

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Sale Booking Close"
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
      
      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Sale Booking Verify</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>               
        </div> 
        <div className="row">
          <div className="col-md-12 ">
            <form onSubmit={handleSubmit}>
              
            <div className="form-group col-12"></div>

            <div className="form-group">
              <label htmlFor="images">Amount:</label>
              <input
                type="number"
                className="form-control"
                id="images"
                name="images"
                value={balAmount}
                onChange={(e)=>setBalAmount(e.target.value)}
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
                onChange={(e)=>setRemark(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>

      </Modal>
    </>
  );
};

export default SaleBookingVerify;
