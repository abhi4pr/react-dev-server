import React from "react";
import DateFormattingComponent from "../../DateFormator/DateFormared";

const UserSingleTab2 = ({ user }) => {
  return (
    <>
      <div className="profileInfo_area">
        <div className="row profileInfo_row pt-0">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Report L1N Name</h3>
              <h4>{user.Report_L1N ? user.Report_L1N : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Report L2N Name</h3>
              <h4>{user.Report_L2N ? user.Report_L2N : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Report L3N Name</h3>
              <h4>{user.Report_L3N ? user.Report_L3N : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Job Type</h3>
              <h4>{user.job_type}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>User Status</h3>
              <h4>{user.user_status ? user.user_status : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Joining Date</h3>
              <h4>
                <DateFormattingComponent
                  date={user.joining_date?.split("T")[0]}
                />
              </h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Hobbies</h3>
              <h4>{user.Hobbies ? user.Hobbies : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Blood Group</h3>
              <h4>{user.BloodGroup ? user.BloodGroup : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Role Name</h3>
              <h4>{user.Role_name ? user.Role_name : "NA"}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSingleTab2;
