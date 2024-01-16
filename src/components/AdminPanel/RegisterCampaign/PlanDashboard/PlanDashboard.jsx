import axios from "axios";
import CampaignDetailes from "../CampaignDetailes";
import { Link, useParams } from "react-router-dom";
import { useEffect,useState } from "react";

const PlanDashboard = () => {
  const { id } = useParams();
  const [planData,setPlanData] = useState([])
  const totalCount = planData.reduce(
    (sum, current) => sum + Number(current.follower_count),
    0
  );
  const totalPost = planData.reduce(
    (sum, current) => sum + Number(current.postPerPage),
    0
  );
  const totalPages = planData.length
  console.log(totalCount,totalPost);
  const getSelectPage = async () => {
    const newPlan = await axios.get(
      `http://34.93.221.166:3000/api/campaignplan/${id}`
    );
   setPlanData(newPlan.data.data);
  };

  useEffect(() => {
    getSelectPage();
  }, []);
  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2> Plan Dashboard </h2>
        </div>
      </div>
      <CampaignDetailes cid={id} />
      <div className="section">
        <Link>
          <div className="data-card is-hoverable">
            <div className="data-card__val">
              {totalPost}
              {/* total post */}
            </div>
            <div className="data-card__label">Total No.of Post in Campgain plan</div>
            <div className="data-card__color is-green"></div>
          </div>
        </Link>
        <Link>
          <div className="data-card is-hoverable">
            <div className="data-card__val">
             {totalPages}
            </div>
            <div className="data-card__label">Total No of Pages</div>
            <div className="data-card__color is-green"></div>
          </div>
        </Link>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {/* {phaseDashbordData.total_no_of_post} */}
            total post
          </div>
          <div className="data-card__label">Total No of Post</div>
          <div className="data-card__color is-green"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {/* {phaseDashbordData.executed_execution_total} , [
            {phaseDashbordData.execution_done_percentage}%] */}
            % executon data
          </div>
          {/* <div className="">20%</div> */}
          <div className="data-card__label">Execution Total & Percentage</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {/* {phaseDashbordData.verified_execution_total} , [
            {phaseDashbordData.verified_percentage}%] */}
            % verified
          </div>
          <div className="data-card__label">verified Post & %</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <Link to="/admin/experties-overview">
            <div className="data-card__val">
              {/* {phaseDashbordData.total_executers} */}
              total Executers
            </div>
            <div className="data-card__label">Total Executer Count</div>
            <div className="data-card__color is-red"></div>
          </Link>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val percentage">
            {/* {formattedPercentage}% */}%
          </div>
          <div className="data-card__label">Phase Occupancy</div>
          <div className="data-card__color is-green"></div>
        </div>

        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {/* {phaseDashbordData.total_no_of_replacement} */}
            total replacement
          </div>
          <div className="data-card__label">Total No of Replancement</div>
          <div className="data-card__color is-red"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">categorywise</div>
          <div className="data-card__label">Category Wise Post Count & %</div>
          <div className="data-card__color is-red"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">NAN</div>
          <div className="data-card__label">
            Page Health Wise Post Count & %
          </div>
          <div className="data-card__color is-red"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val percentage">platformwise</div>
          <div className="data-card__label">Platform Wise Post Count & %</div>
          <div className="data-card__color is-green"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {/* {phaseDashbordData.verified_execution_total} */}
            verified total
          </div>
          <div className="data-card__label">Page Level Wise Post Count & %</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {/* {phaseDashbordData.total_no_of_assign_pages} */}
            total assign pages
          </div>
          <div className="data-card__label">Total No of Assigned Page</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {/* {phaseDashbordData.remaining_for_assignment} */}
            remaining assign
          </div>
          <div className="data-card__label">Balance Remaining Page</div>
          <div className="data-card__color is-orange"></div>
        </div>
      </div>
    </>
  );
};

export default PlanDashboard;
