import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CampaignDetails from "./CampaignDetails";

const TempPlanCreation = () => {
    const [pageData, setPageData] = useState([]);
    
    const param = useParams();
    const id = param.id;

    const getPageData = async () => {
        const Fdata = await axios.get(
            `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
        );
        setPageData(Fdata.data.body);
    }

    useEffect(() => {
        getPageData();
    }, []);

    const columns = [
        {
            field: 'checkbox', headerName: '',
            width: 40
        },
        {
            field: "S.NO",
            headerName: "S.NO",
            width: 60,
            renderCell: (params) => {
              const rowIndex = pageData?.indexOf(params.row);
              return <div>{rowIndex + 1}</div>;
            },
          },
        {
            field: 'page_name', headerName: 'Page Link', width: 150
        },
        {
            field: 'cat_name', headerName: 'Category', width: 200
        },
        {
            field: 'follower_count', headerName: 'Follower Count', width: 150
        },
        {
            field: 'posts_per_page', headerName: 'Posts Per Page',
            renderCell: (params) => (
                <input type="number" />
            ),
            width: 250
        },
        {
            field: 'story_per_page', headerName: 'Story Per Page',
            renderCell: (params) => (
                <input type="number" />
            ),
            width: 250
        },
    ];

    return (
        <>
            <FormContainer mainTitle="Plan Creation" link="true" />
            <CampaignDetails cid={id} />

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={pageData}
                    columns={columns}
                    getRowId={(row) => row.p_id}
                    checkboxSelection
                    pagination
                />
            </div>
            
        </>
    )
}

export default TempPlanCreation;
