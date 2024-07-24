import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../../utils/config';

const UserCountInCards = () => {
    const [departmentData, setDepartmentData] = useState([]);
    const [departmentCount, setDepartmentCount] = useState([]);

    const getWFHDWithCount = async () => {
        const res = await axios.get(baseUrl + "get_wfh_users_with_dept");
        setDepartmentData(res.data.data);
      };
      useEffect(() => {
        getWFHDWithCount();
      }, []);
      useEffect(()=>{
        const sumMonth = departmentData?.reduce(
            (acc, obj) => acc + parseFloat(obj.user_count),
            0
          );
        setDepartmentCount(sumMonth)
      },[departmentData])
  return (
    <>
    <div className="row">
          <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div className="card mb0">
              <div className="card-body">
                <h5 className="mb10">All Users</h5>
                <h2 className="flexCenterBetween">
                  {departmentCount}
                  <span className="icon">
                    <i class="bi bi-arrow-up-right"></i>
                  </span>
                </h2>
              </div>
            </div>
          </div>
    {departmentData.map((d)=>(
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12">
            <div className="card mb0">
              <div className="card-body">
                <h5 className="mb10">{d.dept_name}</h5>
                <h2 className="flexCenterBetween">
                {d.user_count}
                  <span className="icon">
                    <i class="bi bi-arrow-up-right"></i>
                  </span>
                </h2>
              </div>
            </div>
          </div>
            ))}
            </div>
    </>
  )
}

export default UserCountInCards