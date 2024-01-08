import CampaignDetailes from "./CampaignDetailes";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PageDetaling from "./PageDetailing";
import { DataGrid } from "@mui/x-data-grid";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import PageDetailingNew from "./PageDetailingNew";

const PlancreationNew = () => {

    const [campaignName, setCampaignName] = useState(null);

    const param = useParams();
    const id = param.id;

    const getCampaignName = (data, cmpName) => {
        setCampaignName(cmpName);
        // console.log(cmpName)
    };

    return (
        <>
            <div>
                <div className="form_heading_title">
                    <h2 className="form-heading">Plan Creation</h2>
                </div>
            </div>
            <CampaignDetailes cid={id} getCampaign={getCampaignName} />

            <PageDetailingNew
                
                pageName={"planCreation"}
               
                data={{ campaignId: id, campaignName }}
                
            />
        </>
    )
}

export default PlancreationNew