import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../../../../utils/config';

const NewJoineeAndExitUsers = () => {
  const [newJoineeData, setNewJoineeData] = useState([]);
  const [exitUserData, setExistUserData] = useState([]);

    const getNewJoinersData = async () => {
        const res = await axios.get(baseUrl + "get_newjoinee_of_wfhd_users");
        setNewJoineeData(res.data.data);
      };
      const getExitUserData = async () => {
        const res = await axios.get(baseUrl + "get_newjoinee_of_wfhd_users");
        setExistUserData(res.data.data);
      };
      useEffect(() => {
        getNewJoinersData()
        getExitUserData()
      }, []);

      const capitalizeName = (name) => {
        const nameParts = name.split(" ");
        if (nameParts.length >= 2) {
          const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
          const lastNameInitial = nameParts[1].charAt(0).toUpperCase();
          return firstNameInitial + lastNameInitial;
        }
        return name.charAt(0).toUpperCase(); // In case there's only one part of the name
      };
  return (
    <>
    <div className="row">
    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <div className="card mb0">
          <div className="card-header">
            <h5 class="card-title">New Joiners</h5>
          </div>
          <div className="card-body">
            <div className="eventListArea">
              {newJoineeData.map((d) => (
                <div className="eventListBox w-100 avatarBox">
                  <div className="avatarImgBox">
                    {/* <img src={imageTest1} alt="img" /> */}
                    <h2>{capitalizeName(d.user_name)}</h2>
                  </div>
                  <div className="avatarTextBox w-100">
                    <h4 className="w-100 flexCenterBetween">
                      {d.user_name} <span>{d.joining_date}</span>
                    </h4>
                    <h5>{d.dept_name} - Indore</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <div className="card mb0">
          <div className="card-header">
            <h5 class="card-title">Exit Users</h5>
          </div>
          <div className="card-body">
            <div className="eventListArea">
              {exitUserData.map((d) => (
                <div className="eventListBox w-100 avatarBox">
                  <div className="avatarImgBox">
                    {/* <img src={imageTest1} alt="img" /> */}
                    <h2>{capitalizeName(d.user_name)}</h2>
                  </div>
                  <div className="avatarTextBox w-100">
                    <h4 className="w-100 flexCenterBetween">
                      {d.user_name} <span>{d.joining_date}</span>
                    </h4>
                    <h5>{d.dept_name} - Indore</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default NewJoineeAndExitUsers