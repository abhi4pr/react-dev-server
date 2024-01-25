import axios from 'axios'
import React, { useEffect, useState } from 'react'
import FormContainer from '../FormContainer';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';


export default function SalesExecutiveIncentiveRequestReleaseList() {
    const [contextData, setDatas] = useState([]);
    const {incentive_request_id}=useParams()
    const [data, setData] = useState([]);

    useEffect(() => {
       console.log( incentive_request_id,"incentive_request_id")
    }, [])

const formData = new FormData();
formData.append("loggedin_user_id", 36);
formData.append("incentive_request_id", incentive_request_id);
    axios.post('https://salesdev.we-fit.in/webservices/RestController.php?view=sales-incentive_released_request_list',formData,{
        headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res)=>{
      console.log(res.data.body,'res')
        setData(res.data.body)
    })

const columns = [
    { field: 'sno', headerName: 'S.No', width: 100 },
    {field:"sale_exective_name",headerName:"Sales Executive Name",width:200},
    {field:"request_amount",headerName:"Request Amount",width:200},
    {field:"release_amount",headerName:"Released Amount",width:200},
    {field:"account_number",headerName:"Account Number",width:200},
    {field:"incentive_release_creation_datetime",headerName:"Release Date & Time",width:200},
]

  return (
    <>
<FormContainer
        mainTitle="Sales Executive Incentive Request List"
        link="/admin/incentive-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />
<DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        // checkboxSelection
        disableSelectionOnClick
        autoHeight
        getRowId={(row) => row.sno}
      />
    </>
  )
}
