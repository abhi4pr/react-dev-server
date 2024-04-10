import axios from "axios";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { useEffect, useState } from "react";
import Select from "react-select";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router";
import { useGlobalContext } from "../../../Context/Context";

const PageAssignmentMaster = () => {
  const { toastAlert,toastError } = useGlobalContext();

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [user, setuser] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState("");
  const [discription, setDiscription] = useState("");

  const getUserdata = async () => {
    try {
      const res = await axios.get(
        `http://34.173.148.74:8080/api/get_user_by_deptid/48`
      );
      setuser(res?.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getPagedata = async () => {
    try {
      const res = await axios.get(
        `http://34.173.148.74:8080/api/getPageMastList`
      );
      setPages(res?.data?.data);
      console.log(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserdata();
    getPagedata();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedPages ) {
      toastError(" fill all required fields");
      return;
    }
    const res = await axios.post(`http://192.168.1.33:8080/api/add_page_assignment`, {
      page_id: selectedPages,
      assignment_by: loginUserId,
      assignment_to: selectedUser,
      description: discription,
      created_by: loginUserId,
      last_updated_by: loginUserId,
    });
    console.log(res);
    setSelectedUser("");
    setSelectedPages("");
    setDiscription("");
    navigate("/admin/page-assignment");
    toastAlert("Created Successfully")
  };

  return (
    <>
      <FormContainer
        mainTitle="Create Page Assignment"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-6">
          <label className="form-label">
            User <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={user.map((option) => ({
              value: option.user_id,
              label: option.user_name,
            }))}
            value={{
              value: selectedUser,
              label:
                user?.find((item) => item.user_id === selectedUser)
                  ?.user_name || "",
            }}
            onChange={(e) => {
              setSelectedUser(e.value);
            }}
            required
          ></Select>
        </div>
        <div className="form-group col-6">
          <label className="form-label">
            Pages <sup style={{ color: "red" }}>*</sup>
          </label>

          <Select
            options={pages?.map((opt) => ({
              value: opt.pageMast_id,
              label: opt.page_user_name,
            }))}
            value={{
              value: selectedPages,
              label:
                pages?.find((user) => user.pageMast_id === selectedPages)
                  ?.page_user_name || "",
            }}
            onChange={(e) => {
              setSelectedPages(e.value);
            }}
            // required
            required={true}

          />
        </div>

        <FieldContainer
          label="Discription"
          type="text"
          fieldGrid={4}
          value={discription}
          required={false}
          onChange={(e) => setDiscription(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default PageAssignmentMaster;
