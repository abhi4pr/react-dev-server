import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {  Paper, Button, Box } from "@mui/material";//Tooltip
import DeleteIcon from "@mui/icons-material/Delete";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReplacePagesModal from "./ReplacePagesModal";
import CampaignDetailes from "./CampaignDetailes";
import PageOverview from "./PageOverview";

const PlanOverview = () => {
  const [selectData, setSelectData] = useState([]);
  const [render,setRender]=useState(false);

  const param = useParams();
  const id = param.id;
  console.log(selectData);
  const getSelectPage = async () => {
    const newPlan = await axios.get(
      `http://localhost:3000/api/campaignplan/${id}`
    );

    const x=newPlan.data.data.filter(page=>{
      if(page.replacement_status=='pending' || page.replacement_status=="replacement" || page.replacement_status=="inactive"){
        return page
      }
    })
    setSelectData(x);
  };

  useEffect(() => {
    getSelectPage();
  }, []);

const renderHard=()=>{
 
  getSelectPage()
}

  

  return (
    <Paper>
      <div>
        <div className="form_heading_title">
          <h2 className="form-heading">Plan Overview</h2>
        </div>
      </div>
      <CampaignDetailes cid={id} />
    <PageOverview selectData={selectData} setrender={renderHard} stage={'plan'}/>

    </Paper>
  );
};

export default PlanOverview;
