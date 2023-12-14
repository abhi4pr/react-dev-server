import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import { useGlobalContext } from "../../../Context/Context";

const PendingInvoiceCustomerDeatils = () => {

  const {id} = useParams();
  const { toastAlert } = useGlobalContext();
  const [datas, setData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  function getData() {
    const formData = new FormData();
    formData.append("loggedin_user_id",36)
    formData.append("cust_id",id)

    axios.post(`https://production.sales.creativefuel.io/webservices/RestController.php?view=sales-customer_detail`, formData, {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }).then((res) => {
      setData(res.data.body);
      // setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <FormContainer
        mainTitle="Customer Details"
        title="Customer Detail"
        submitButton={false}
      >
        <div>Customer Type: {datas.cust_type} </div>
        <div>Customer Name: {datas.cust_name} </div>
        <div>Company Name: {datas.company_name} </div>
        <div>GST Number: {datas.gst_no} </div>
        <div>Mobile: {datas.mobile_no} </div>
        <div>Alternate Number: {datas.alternative_no} </div>
        <div>Email: {datas.email_id} </div>
        <div>Country: {datas.country} </div>
        <div>State: {datas.state} </div>
        <div>City: {datas.city} </div>
        <div>Website: {datas.website} </div>
        <div>Instagram username: {datas.instagram_username} </div>
        <div>Category: {'data'} </div>
      </FormContainer>
    
    </>
  );
};

export default PendingInvoiceCustomerDeatils;