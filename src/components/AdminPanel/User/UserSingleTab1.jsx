import React from "react";
import DateFormattingComponent from "../../DateFormator/DateFormared";
const UserSingleTab1 = ({ user }) => {
  return (
    <>
      <div className="profileInfo_area">
        <div className="row profileInfo_row pt-0">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Name</h3>
              <h4>{user.user_name}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Gender</h3>
              <h4>{user.Gender}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Father Name</h3>
              <h4>{user.fatherName ? user.fatherName : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Email Id</h3>
              <h4>{user.user_email_id}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Personal Email</h3>
              <h4>{user.PersonalEmail ? user.PersonalEmail : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Mother Name</h3>
              <h4>{user.motherName ? user.motherName : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Personal Number</h3>
              <h4>{user.PersonalNumber}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>User Contact No</h3>
              <h4>{user.user_contact_no}</h4>
            </div>
          </div>
          <div
            className={`${
              user.job_type === "WFH"
                ? "col-xl-4 col-lg-4 col-md-6 col-sm-12"
                : "col-xl-4 col-lg-4 col-md-6 col-sm-12"
            }`}
          >
            <div className="profileInfo_box">
              <h3>Spoken Languages</h3>
              <h4>{user.SpokenLanguages ? user.SpokenLanguages : "NA"}</h4>
            </div>
          </div>
        </div>
        {user.job_type === "WFH" && (
          <div className="row profileInfo_row">
            {user.job_type === "WFH" && (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>TDS Applicable</h3>
                  <h4>{user.tbs_applicable}</h4>
                </div>
              </div>
            )}
            {user.job_type === "WFH" && (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>TDS</h3>
                  <h4>{user.tds_per}</h4>
                </div>
              </div>
            )}
            {user.job_type === "WFH" && (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Salary</h3>
                  <h4>{user.salary}</h4>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Designation</h3>
              <h4>{user.designation_name}</h4>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Department</h3>
              <h4>{user.department_name}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Sub Department</h3>
              <h4>{user.sub_dept_name ? user.sub_dept_name : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Nationality</h3>
              <h4>{user.Role_name ? user.Nationality : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Date Of Birth</h3>
              <h4>
                {" "}
                <DateFormattingComponent date={user.DOB} />
              </h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Age</h3>
              <h4>{user.Age ? user.Age : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          {user.MartialStatus === "Married" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Seat Number</h3>
                <h4>
                  {roomId?.Sitting_ref_no ? roomId?.Sitting_ref_no : "NA"}{" "}
                  {roomId?.Sitting_ref_no ? "|" : ""}{" "}
                  {roomId?.Sitting_area ? roomId?.Sitting_area : "NA"}
                </h4>
              </div>
            </div>
          )}
          {user.MartialStatus === "Married" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>user Status</h3>
                <h4>{user.user_status ? user.user_status : "NA"}</h4>
              </div>
            </div>
          )}
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Martial Status</h3>
              <h4>{user.MartialStatus ? user.MartialStatus : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          {user.MartialStatus === "Married" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Date Of Marriage</h3>
                <h4>
                  {" "}
                  <DateFormattingComponent date={user.DateOfMarriage} />
                </h4>
              </div>
            </div>
          )}
          {user.MartialStatus === "Married" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Spouse Name</h3>
                <h4>{user.spouse_name}</h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSingleTab1;
