import React from "react";

const CampaignExecutionSummary = ({ overviewCommitData }) => {
  // console.log(overviewCommitData?.commitmentdata?.map((d)=>d),"over view ");

  return (
    <div>
      <div className="summary-section mb-3">
        <h4>Total Summary</h4>
        <p>Total Pages: 38</p>
        <p>Total Posts: 3000 (Posted: 1500, Pending: 1500)</p>
        <p>Total Stories: 3000 (Posted: 1500, Pending: 1500)</p>
      </div>
      <div className="d-flex justify-content-around">
        <div className="card" style={{ width: "250px", background: "#F3E8EA" }}>
          <div class="card-header  ">Commitment</div>
          <div className="card-body">
            <p>Comments: {overviewCommitData?.commitmentdata?.comments}</p>
            <p>Engagement: {overviewCommitData?.commitmentdata?.engagement}</p>
            <p>Views: {overviewCommitData?.commitmentdata?.reach}</p>
          </div>
        </div>
        <div className="card" style={{ width: "250px", background: "#FFDEAD" }}>
          <div class="card-header">Achieved</div>
          <div className="card-body">
            <p>Comment : {overviewCommitData?.completedData?.post_comments}</p>
            <p>Likes : {overviewCommitData?.completedData?.post_likes}</p>
            <p> Views : {overviewCommitData?.completedData?.post_views}</p>
          </div>
        </div>
        <div className="card" style={{ width: "250px", background: "#DBE9FA" }}>
          <div class="card-header" >Difference</div>
          <div className="card-body">
            <p>
              Comments :{" "}
              {overviewCommitData?.commitmentdata?.comments -
                overviewCommitData?.completedData?.post_comments}
            </p>

            <p>Likes: 2000</p>
            <p>
              Views:{" "}
              {overviewCommitData?.completedData?.post_views >
              overviewCommitData?.commitmentdata?.reach
                ? "+"
                : "-"}{" "}
              {Math.abs(
                overviewCommitData?.commitmentdata?.reach -
                  overviewCommitData?.completedData?.post_views
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignExecutionSummary;
