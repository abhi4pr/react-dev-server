import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import DataTable from "react-data-table-component";
import { Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {baseUrl} from '../../../utils/config'

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
      .post(baseUrl+"add_php_payment_acc_data_in_node")
      .then((res) => {
        console.log("data save in local success");
      });
    axios
      .get(baseUrl+"get_all_php_payment_acc_data")
      .then((res) => {
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
