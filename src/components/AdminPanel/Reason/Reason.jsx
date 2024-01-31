import { useState } from "react";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const Reason = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserID = decodedToken.id;
  const { toastAlert } = useGlobalContext();
  const [reason, setReason] = useState("");
  const [remark, setRemark] = useState("");
  const [data, setData] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(baseUrl+"add_reason", {
        created_by: loginUserID,
        reason: reason,
        remark: remark,
      });
      setReason("");
      setRemark("");
      getData();
      toastAlert("Form Submitted success");
    } catch (error) {
      toastAlert("Reason Already Exists");
    }
  }

  async function getData() {
    try {
      const response = await axios.get(
        baseUrl+"get_all_reasons"
      );
      setData(response.data);
    } catch (error) {
      toastAlert("An error occurred:", error);
    }
  }
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "15%",
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      width: "30%",
      sortable: true,
    },
    {
      name: "Remark",
      selector: (row) => row.remark,
      width: "30%",
      sortable: true,
    },
  ];
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <FormContainer
        mainTitle="Reason"
        title="Reason"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <FieldContainer
          label="Remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            columns={columns}
            data={data}
            fixedHeader
            highlightOnHover
            subHeader
          />
        </div>
      </div>
    </>
  );
};

export default Reason;
