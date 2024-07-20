import { Avatar } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function PageDetails({ creatorDetail, setCreatorDetail }) {
  const { creatorName } = useParams();
  // const [creatorDetail,setCreatorDetail]= useState(null)
  useEffect(() => {
    axios
      .post(`https://insights.ist:8080/api/getCreatorReport`, {
        creatorName: creatorName,
      })
      .then((res) => {
        // console.log(res.data.data,"res.getCreatorReport");
        setCreatorDetail(res.data.data);
        // setPostRows(res.data);
        // setPostdataLoaded(true);
        // const sumOfMetrics = calculateAverageOfMetricsByPostType(res.data);
        // setEngagementArray(sumOfMetrics);
      });
  }, []);

  const formatString = (s) => {
    // Remove leading underscores
    let formattedString = s.replace(/^_+/, "");
    // Capitalize the first letter and make the rest lowercase
    if (formattedString) {
      formattedString =
        formattedString.charAt(0).toUpperCase() +
        formattedString.slice(1).toLowerCase();
    }
    return formattedString;
  };
  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} k`;
    } else {
      return Math.round(value).toString();
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="row pgHeader">
          <div className="col pgAccountCol">
                <Link
                  to={`https://www.instagram.com/${creatorName}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
            <div className="pgAccount">
              <div className="pgAccountAvatar">
                  <Avatar
                    src={`https://storage.googleapis.com/insights_backend_bucket/cr/${creatorName}.jpeg`}
                    alt={creatorName}
                  />
              </div>
               
              <div className="pgAccountText">
                <h2>{formatString(creatorName)}</h2>
                <div>
                  <p>{creatorDetail?.biography}</p>
                  {/* <p>You Talking to me? sir Robert</p> */}
                </div>
                <ul className="pgAccountSocial">
                  <li>
                    <a href="#">
                      <i className="bi bi-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="bi bi-youtube"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
              </Link>
          </div>
          {creatorDetail && (
            <div className="col pgStatsCol">
              <div className="col pgStats">
                <ul>
                  <li>
                    {formatNumber(creatorDetail.mediaCount)}
                    <span>Posts</span>
                  </li>
                  <li>
                    {formatNumber(creatorDetail.followersCount)}
                    <span>Followers</span>
                  </li>
                  <li>
                    {formatNumber(creatorDetail.followingCount)}
                    <span>Following</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageDetails;
