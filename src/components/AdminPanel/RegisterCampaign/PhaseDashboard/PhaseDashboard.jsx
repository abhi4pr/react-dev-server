import "./phasedashboard.scss";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CampaignDetailes from "../CampaignDetailes";
import { Link } from "react-router-dom";

const PhaseDashboard = () => {
  const [allPhaseData, setAllPhaseData] = useState([]);
  const [singlePhaseData, setSinglePhaseData] = useState([]);
  const [phaseDashbordData, setPhaseDashbordData] = useState("");
  var planId;
  const phaseData = async () => {
    const phase = await axios.get(
      `http://34.93.221.166:3000/api/campaignphase/singlephase/${44}`
    );
    const setsinglephasedata = phase.data.data.pages[0].campaignId;
    console.log(phase.data.data.pages[0]._id, "singledasta");
    planId = phase.data.data.pages[0]._id;

    setSinglePhaseData(setsinglephasedata);

    const getallphase = await axios.get(
      `http://34.93.221.166:3000/api/campaignphase/${setsinglephasedata}`
    );

    const response = await getallphase.data.result.filter(
      (phase) => phase?.phase_id !== 44
    );

    setAllPhaseData(response);
  };

  const phaseDash = async () => {
    const phaseDashboardData = await axios.post(
      `http://34.93.221.166:3000/api/operation_phase_dashboard`,
      {
        phase_id: "44",
      }
    );
    setPhaseDashbordData(phaseDashboardData.data.data);
  };

  useEffect(() => {
    phaseDash();
    phaseData();
  }, []);

  const formattedPercentage =
    phaseDashbordData?.phase_occupancy &&
    (phaseDashbordData?.phase_occupancy).toFixed(0);
  return (
    <>
      <div>
        <h3>Campaign Details</h3>
        <CampaignDetailes cid={singlePhaseData} />
      </div>
      <div class="section">
        <h3>Phase Dashboard</h3>

        {/* <div class="data-card">
          <div class="data-card__val">17,933</div>
          <div class="data-card__label">All Saleable</div>
          <div class="data-card__color is-green"></div>
        </div> */}
      </div>
      <div class="section">
        {/* <h3>Hoverable</h3> */}

        <div class="data-card is-hoverable">
          <Link to={`/admin/planCreation/${singlePhaseData}`}>
            <div class="data-card__val">
              {phaseDashbordData.total_no_of_post_in_plan}
            </div>
          </Link>
          <div class="data-card__label">Total No.of Post in Campgain</div>
          <div class="data-card__color is-green"></div>
        </div>
        <div class="data-card is-hoverable">
          <Link to={`/admin/phase/${singlePhaseData}`}>
            <div class="data-card__val">
              {phaseDashbordData.total_no_of_page}
            </div>
            <div class="data-card__label">Total No of Pages</div>
            <div class="data-card__color is-green"></div>
          </Link>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val">{phaseDashbordData.total_no_of_post}</div>
          <div class="data-card__label">Total No of Post</div>
          <div class="data-card__color is-green"></div>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val">
            {phaseDashbordData.executed_execution_total} , [12%]
          </div>
          {/* <div class="">20%</div> */}
          <div class="data-card__label">Execution Total & Percentage</div>
          <div class="data-card__color is-orange"></div>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val">
            {phaseDashbordData.verified_execution_total}
          </div>
          <div class="data-card__label">verified Post & %</div>
          <div class="data-card__color is-orange"></div>
        </div>
        <div class="data-card is-hoverable">
          <Link to="/admin/experties-overview">
            <div class="data-card__val">
              {phaseDashbordData.total_executers}
            </div>
            <div class="data-card__label">Total Executer Count</div>
            <div class="data-card__color is-red"></div>
          </Link>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val percentage">{formattedPercentage}%</div>
          <div class="data-card__label">Phase Occupancy</div>
          <div class="data-card__color is-green"></div>
        </div>

        <div class="data-card is-hoverable">
          <div class="data-card__val">{phaseDashbordData.total_no_of_page}</div>
          <div class="data-card__label">Total No of Replancement</div>
          <div class="data-card__color is-red"></div>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val">{phaseDashbordData.total_no_of_page}</div>
          <div class="data-card__label">Category Wise Post Count & %</div>
          <div class="data-card__color is-red"></div>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val">{phaseDashbordData.page_assigned}</div>
          <div class="data-card__label">Page Health Wise Post Count & %</div>
          <div class="data-card__color is-red"></div>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val percentage">{formattedPercentage}%</div>
          <div class="data-card__label">Platform Wise Post Count & %</div>
          <div class="data-card__color is-green"></div>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val">
            {phaseDashbordData.verified_execution_total}
          </div>
          <div class="data-card__label">Page Level Wise Post Count & %</div>
          <div class="data-card__color is-orange"></div>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val">
            {phaseDashbordData.verified_execution_total}
          </div>
          <div class="data-card__label">Total No of Assigned Page</div>
          <div class="data-card__color is-orange"></div>
        </div>
        <div class="data-card is-hoverable">
          <div class="data-card__val">
            {phaseDashbordData.verified_execution_total}
          </div>
          <div class="data-card__label">Balance Remaining Page</div>
          <div class="data-card__color is-orange"></div>
        </div>
      </div>
      <div className="phase-list">
        <h4>Phase Links </h4>
        {allPhaseData.map((d) => (
          <Link>
            <p className="phase-list-inside">
              {d.phaseName}
              {""}{" "}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default PhaseDashboard;
