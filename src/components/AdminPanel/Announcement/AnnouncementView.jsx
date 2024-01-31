import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import {baseUrl} from '../../../utils/config'

const AnnouncementView = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserOnboardStatus = decodedToken.onboard_status;
  const [data, setData] = useState([]);
  const [filterdata, setfilterdata] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          baseUrl+"allannouncementdata"
        );
        const allData = await res.data;
        setData(allData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter(
      (item) =>
        item.onboard_status === 0 ||
        item.onboard_status === loginUserOnboardStatus
    );
    setfilterdata(filteredData);
  }, [loginUserOnboardStatus, data]);

  return (
    <>
      {console.log(loginUserOnboardStatus)}
      {filterdata.length === 1 ? (
        <div key={filterdata[0].id}>
          {filterdata[0].heading} {filterdata[0].sub_heading}
        </div>
      ) : (
        filterdata.map((item) => (
          <div key={item.id}>
            {item.heading} {item.sub_heading}
          </div>
        ))
      )}
    </>
  );
};

export default AnnouncementView;
