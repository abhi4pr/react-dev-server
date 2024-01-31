import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import {baseUrl} from '../../../utils/config'

const OnboardExtendDateOverview = () => {
  const whatsappApi = WhatsappAPI();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [extendDate, setExtendDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rejectReason, setRejectReason] = useState("");

  const [reasonField, setReasonField] = useState(false);

  const [editableRowId, setEditableRowId] = useState(null);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const handleRejectClick = (rowId) => {
    setEditableRowId(rowId);
    setReasonField(true);
  };

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, []);

  async function getData() {
    try {
      const response = await axios.get(
        baseUrl+"get_all_users"
      );
      const data = response.data.data.filter(
        (item) => item.joining_date_extend_status == "Requested"
        // const data = response.data.data;
      );

      setDatas(data);
      setFilterData(data);
      setExtendDate(data[0].joining_date_extend);
    } catch (error) {
      console.log("Error fething Data", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const statusUpdate = (user_id, status, PersonalNumber, userName) => {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("joining_date_extend_status", status);
    if (status == "Approve") {
      formData.append("joining_date", extendDate);
    }
    if (status == "Reject") {
      formData.append("joining_date_reject_reason", rejectReason);
    }
    axios
      .put(baseUrl+"update_user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        axios.post(baseUrl+"add_send_user_mail", {
          email: "lalit@creativefuel.io",
          subject: "Extend Date Status",
          text: status,
          attachment: "",
        });
        whatsappApi.callWhatsAPI(
          "CF_Extend_status_update",
          JSON.stringify(PersonalNumber),
          user_id,
          [userName]
        );
      })
      .then(() => getData());
  };

  useEffect(() => {
    const result = data.filter((d) => {
      return d.desi_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "Joining Date",
      selector: (row) =>
        row.joining_date?.split("T")[0].split("-").reverse().join("-"),
      sortable: true,
    },
    {
      name: "Requested Joining",
      selector: (row) =>
        row?.joining_date_extend.split("T")[0].split("-").reverse().join("-"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.joining_date_extend_status,
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.joining_date_extend_reason,
      sortable: true,
    },
    {
      name: "Proof Doc",
      selector: (row) => (
        <a
          href={`http://34.93.221.166:3000/uploads/${row.joining_extend_document}`}
        >
          <CloudDownloadIcon />
        </a>
      ),
      sortable: true,
    },
    {
      name: "Reason",
      cell: (row) => {
        if (editableRowId === row.user_id && reasonField) {
          return (
            <input
              type="text"
              className="form-control"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          );
        }
        return row.joining_date_extend_reason;
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {!reasonField && (
            <>
              <button
                title="Approve"
                className="btn btn-outline-primary mr-3"
                onClick={() =>
                  statusUpdate(
                    row.user_id,
                    "Approve",
                    row.PersonalNumber,
                    row.user_name
                  )
                }
              >
                <CheckIcon />
              </button>
              <button
                title="Reject"
                className="btn btn-outline-danger"
                onClick={() => handleRejectClick(row.user_id)}
              >
                <CancelIcon />
              </button>
            </>
          )}
          {reasonField && (
            <button
              title="Save"
              className="btn btn-outline-primary"
              onClick={() =>
                statusUpdate(
                  row.user_id,
                  "Reject",
                  row.PersonalNumber,
                  row.user_name
                )
              }
            >
              Save
            </button>
          )}
        </>
      ),
      width: "300px",
      allowOverflow: true,
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Extend Date Overview"
        link="/admin/designation-master"
        buttonAccess={
          contextData &&
          contextData[10] &&
          contextData[10].insert_value === 1 &&
          true
        }
      />
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title=" Overview"
              columns={columns}
              data={filterdata}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardExtendDateOverview;
