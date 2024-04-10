import axios from "axios";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { useEffect, useState } from "react";
import Select from "react-select";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";

const PageAssignmentUpdate = () => {
  const { toastAlert,toastError } = useGlobalContext();

  const { id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [user, setUser] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [description, setDescription] = useState("");

  // user by department
  const getUserData = async () => {
    try {
      const res = await axios.get(
        `http://34.173.148.74:8080/api/get_user_by_deptid/48`
      );
      setUser(res?.data);
    } catch (err) {
      console.log(err);
    }
  };
  // single assignment
  const getSinglePageAssignmentData = async () => {
    try {
      const res = await axios.get(
        `http://192.168.1.33:8080/api/get_page_assignment/${id}`
      );
      setSingleData(res?.data?.data);
      setDescription(res?.data?.data[0]?.description);
    } catch (err) {
      console.log(err);
    }
  };

  // all page data
  const getPageData = async () => {
    try {
      const res = await axios.get(
        `http://34.173.148.74:8080/api/getPageMastList`
      );
      setPages(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
    getSinglePageAssignmentData();
    getPageData();
  }, []);

  useEffect(() => {
    if (singleData.length > 0) {
      const p = user.find((e) => e.user_id === singleData[0]?.assignment_to);
      setSelectedUser({
        label: p?.user_name,
        value: p?.user_id,
      });
    }
  }, [singleData, user]);

  useEffect(() => {
    const selectedPageData = pages.find(
      (e) => e.pageMast_id === singleData[0]?.page_id
    );
    setSelectedPage({
      label: selectedPageData?.page_user_name,
      value: selectedPageData?.pageMast_id,
    });
  }, [singleData, pages]);

  // update Assignment data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedPage ) {
      toastError("Please fill in all required fields.");
      return;
    }
    try {
      const res = await axios.put(
        `http://192.168.1.33:8080/api/update_page_assignment/${id}`,
        {
          page_id: selectedPage?.value,
          assignment_by: loginUserId,
          assignment_to: selectedUser?.value,
          description: description,
          created_by: loginUserId,
          last_updated_by: loginUserId,
        }
      );
      console.log(res);
      navigate("/admin/page-assignment");
      toastAlert("Update Successfully")
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
          value={selectedUser}
          onChange={setSelectedUser}
          required
        />
      </div>
      <div className="form-group col-6">
        <label className="form-label">
          Pages <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={pages.map((opt) => ({
            value: opt.pageMast_id,
            label: opt.page_user_name,
          }))}
          value={selectedPage} 
          onChange={setSelectedPage} 
          required
        />
      </div>
      <FieldContainer
        label="Description"
        type="text"
        fieldGrid={4}
        value={description}
        required={false}
        onChange={(e) => setDescription(e.target.value)}
      />
    </FormContainer>
  );
};

export default PageAssignmentUpdate;
