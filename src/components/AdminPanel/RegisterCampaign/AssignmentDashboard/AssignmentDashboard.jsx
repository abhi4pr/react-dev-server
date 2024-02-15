import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import CampaignDetailes from "../CampaignDetailes";
//import './assignmentDashboardData';

const AssignmentDashboard = () => {
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [dashboardData, setDashboardData] = useState("");
  const [assignmentDetails, setAssignmentDetails] = useState({});
 

  const fetchData = async () => {
    try {
      const assignmentDashboardData = await axios.get(`${baseUrl}api/assignment/campaign/dashboard`);
      setDashboardData(assignmentDashboardData.data.data);

      const assignmentDetailsData = await axios.get(`${baseUrl}assignment/details`);
      setAssignmentDetails(assignmentDetailsData.data.data);


      const assignmentsResponse = await axios.get(`${baseUrl}assignments`);
      setAssignmentsData(assignmentsResponse.data.data);
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Example of how you might format some data
  const formattedPercentage = dashboardData?.occupancy && (dashboardData?.occupancy * 100).toFixed(0);

  useEffect(() => {
    
  }, []);
  
  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleCampaignChange = (event) => {
    setSelectedCampaign(event.target.value);
  };

  const handleCampaignDetailChange = (event) => {
    setSelectedCampaignDetail(event.target.value);
  };

  


  return (
    <>
         
      <div>
        <h3>Assignment Details</h3>
        <> 
</>

      </div>
      <div>
        
        <CampaignDetailes  />
      </div>
      {/* cid={singlePhaseData} */}

      <div className="section">
        <h4>Assignment Dashboard</h4>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.number_of_assignment_executed}</div>
          <div className="data-card__label">Number of Assignment Executed</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.number_of_assignment_accepted}</div>
          <div className="data-card__label">Number of Assignment Accepted</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.number_of_assignment_pending}</div>
          <div className="data-card__label">Number of Assignment Pending</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.number_of_unassigned_task}</div>
          <div className="data-card__label">Number of Unassigned Task</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.number_of_executer}</div>
          <div className="data-card__label">Number of Executer</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.number_of_category}</div>
          <div className="data-card__label">Number of Category</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.total_number_of_post}</div>
          <div className="data-card__label">Total Number of Post</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.total_number_of_story}</div>
          <div className="data-card__label">Total Number of Story</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.post_verified}</div>
          <div className="data-card__label">Post Verified</div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{dashboardData.story_verified}</div>
          <div className="data-card__label">Story Verified</div>
        </div>
        {/* Add more data points as needed */}
      </div>
      {/* <div className="assignment-list">
        <h4>Assignment Links </h4>
        {assignmentsData.map((assignment) => (
          <Link key={assignment.id} to={`/admin/assignment/${assignment.id}`}>
            <p className="assignment-list-inside">{assignment.name}</p>
          </Link>
        ))}
      </div> */}
    </>
  );
};

export default AssignmentDashboard;
