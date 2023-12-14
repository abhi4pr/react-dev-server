import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import Modal from "react-modal";

const BalancePaymentList = () => {
  
  const { toastAlert } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [datas, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [contextData, setDatas] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [balAmount, setBalAmount] = useState("");
  const [paymentRefNo, setPaymentRefNo] = useState("");
  const [paymentRefImg, setPaymentRefImg] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleSubmit = async(row) => {
    // e.preventDefault();

    const formData = new FormData();
    formData.append("loggedin_user_id",36);
    formData.append("sale_booking_id", row.sale_booking_id);
    formData.append("payment_update_id",row.payment_update_id);
    formData.append("payment_ref_no", paymentRefNo);
    formData.append("payment_detail_id", paymentDetails);
    formData.append("payment_screenshot", paymentRefImg);
    formData.append("payment_type", paymentType);
    formData.append("payment_mode", paymentMode);
    
    await axios.post("https://production.sales.creativefuel.io/webservices/RestController.php?view=balance_payment_update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImageModalOpen(false)

    toastAlert("Data updated");
    setIsFormSubmitted(true);
  };

  function getData() {
    axios.post("http://34.93.221.166:3000/api/add_php_payment_bal_data_in_node").then((res)=>{
      console.log('data save in local success')
    })
    axios.get("http://34.93.221.166:3000/api/get_all_php_payment_bal_data").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  const handleImageClick = (row) => {
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  useEffect(() => {
    const result = datas.filter((d) => {
      return (
        d.cust_name?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "Id",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.cust_name,
      sortable: true,
    },
    {
      name: "Sales Executive Name",
      selector: (row) => "	Bhushan",

    },
    {
      name: "Sale Booking Date",
      selector: (row) => row.sale_booking_date,

    },
    {
      name: "Campaign Amount",
      selector: (row) => row.campaign_amount,
    },
    {
      name: "Paid Amount",
      selector: (row) => row.total_paid_amount,
    },
    {
      name: "Balance Amount",
      selector: (row) => "800",
    },
    
    {
      name: "Status",
      cell: (row) => (
        <button
          className="btn btn-sm btn-outline-info"
          onClick={() => handleImageClick(row)}
        >
          Balance Update
        </button>
      ),
    },
    
  ];

  return (
    <>
      <FormContainer
        mainTitle="Sale Booking - All Balance Payment List Pending"
        link="/admin/balance-payment-list"
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
            title="Balance payment list"
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
            <h2>Balance Payment Update</h2>

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
              <label htmlFor="images">Balance Amount</label>
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
              <label htmlFor="images">Payment Reference Number:</label>
              <input
                type="text"
                className="form-control"
                id="images"
                name="images"
                value={paymentRefNo}
                onChange={(e)=>setPaymentRefNo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">Payment Reference Image:</label>
              <input
                type="file"
                className="form-control"
                id="images"
                name="images"
                accept="image/*"
                onChange={(e)=>setPaymentRefImg(e.target.files[0])}
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">Payment Type</label>
              <select name="payment_type" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="full">full</option>
              <option value="partial">partial</option>
            </select>
            </div>

            <div className="form-group">
              <label htmlFor="images">Payment Details</label>
              <select name="payment_detail" value={paymentDetails} onChange={(e)=> setPaymentDetails(e.target.value)}>
                <option value="Gst payment details">Gst payment details</option>
                <option value="paypal">paypal</option>
                <option value="other payment details">other payment details</option>
                <option value="upi details for mmc">upi details for mmc</option>
                <option value="bank details for sarcasm">bank details for sarcasm</option>
                <option value="bank details for mmc">bank details for mmc</option>
                <option value="upi mmc">upi mmc</option>
                <option value="meta mask for ethereum">meta mask for ethereum</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="images">Payment Mode</label>
              <select name="cars" value={paymentMode} onChange={(e)=> setPaymentMode(e.target.value)}>
                <option value="cash">cash</option>
                <option value="others">others</option>
              </select>
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

export default BalancePaymentList;