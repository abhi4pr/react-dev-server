import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import CampaignDetails from "./CampaignDetails";
import * as XLSX from 'xlsx';

const TempPlanCreation = () => {
    const [pageData, setPageData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    
    const param = useParams();
    const id = param.id;

    const getPageData = async () => {
        try {
            const Fdata = await axios.get(
                `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
            );
            setPageData(Fdata.data.body);
            setFilteredData(Fdata.data.body);
        } catch (error) {
            console.error("Error fetching page data", error);
        }
    }

    useEffect(() => {
        getPageData();
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("File selected:", file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const secondSheetName = workbook.SheetNames[1];
                    const worksheet = workbook.Sheets[secondSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    const uploadedPageNames = jsonData.slice(1)
                        .map(row => row[1])
                        .filter(name => name) 
                        .map(name => name.trim().toLowerCase());
                    
                    const matchedData = filterData(uploadedPageNames);
                    console.log("Matched Data:", matchedData);
                    setFilteredData(matchedData);
                } catch (error) {
                    console.error("Error reading or parsing file", error);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const filterData = (uploadedPageNames) => {
        return pageData.filter(item => uploadedPageNames.includes(item.page_name.trim().toLowerCase()));
    };

    const handleSubmit = () => {
        // Handle the submit logic here
        console.log("Submit button clicked");
    };

    const columns = [
        {
            field: 'checkbox', headerName: '', width: 40
        },
        {
            field: "S.NO", headerName: "S.NO", width: 60,
            renderCell: (params) => {
                const rowIndex = filteredData?.indexOf(params.row);
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
            field: 'posts_per_page', headerName: 'Posts Per Page', width: 250,
            renderCell: (params) => (
                <input type="number" />
            )
        },
        {
            field: 'story_per_page', headerName: 'Story Per Page', width: 250,
            renderCell: (params) => (
                <input type="number" />
            )
        },
    ];

    return (
        <>
            <FormContainer mainTitle="Plan Creation" link="true" />
            <CampaignDetails cid={id} />

            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    getRowId={(row) => row.p_id}
                    checkboxSelection
                    pagination
                />
            </div>

            <button onClick={handleSubmit} style={{width:'10%'}}>Submit</button>
        </>
    )
}

export default TempPlanCreation;
