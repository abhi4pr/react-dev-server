import { Paper, TextField, Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../utils/config";

let commInfo = [];

const CampaignDetails = ({ cid, getCampaign }) => {
  const [campaignData, setCampaignData] = useState({});
  const [brandData, setBrandData] = useState([]);
  const [cmpName, setCmpName] = useState({});
  const [commitData, setCommitData] = useState([]);
  const [commitmentCompleteData, setCommitmentCompleteData] = useState([]);

  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}` + `opcampaign/${cid}`);
      setCampaignData(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getData();
  }, [cid]);

  const getCommitments = async () => {
    const comm = await axios.get(baseUrl + "get_all_commitments");
    const myComm = comm.data.data.filter((comm) =>
      commInfo.includes(comm.cmtId)
    );
    setCommitData(myComm);
    let data = [];
    myComm.forEach((x, index) => {
      data.push({
        commitment: x.cmtName,
        value: "0",
        max: campaignData?.commitment[index]?.textValue,
      });
    });

    setCommitmentCompleteData(data);
  };

  useEffect(() => {
    if (commitmentCompleteData.length > 0 && getCampaign) {
      getCampaign(commitmentCompleteData, cmpName?.exeCmpName, campaignData);
    }
  }, [commitmentCompleteData, cmpName]);

  useEffect(() => {
    if (campaignData.brand_id) {
      campaignData.commitment.forEach((element) => {
        commInfo.push(element.selectValue);
      });
      getCommitments();
    }
  }, [campaignData]);

  return (
    <>
      <div className="card body-padding">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Brand"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              value={
                campaignData?.brand_data?.brand_name
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              label="Campaign"
              InputLabelProps={{ shrink: true }}
              value={
                campaignData?.campaign_data?.exeCmpName
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              label="Campaign Details"
              InputLabelProps={{ shrink: true }}
              value={
                campaignData?.details
              }
            />
          </Grid>
          {campaignData?.commitments > 0 &&
            campaignData?.commitments?.map((comm, index) => {
              return (
                <>
                  <Grid sx={{ m: 2 }}>
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      label={campaignData?.commitments?.selectValue}
                      value={campaignData?.commitment[index]?.textValue}
                    />
                  </Grid>
                  
                </>
              );
            })}
        </Grid>
      </div>
    </>
  );
};

export default CampaignDetails;
