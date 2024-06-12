import React from 'react'
import { Autocomplete, Box, Grid, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useGetAllPageCategoryQuery,   } from "../../../Store/PageBaseURL";
import {
    useGetAllVendorQuery,
    useGetAllVendorTypeQuery,
    useGetPmsPayCycleQuery,
    useGetPmsPaymentMethodQuery,
    useGetPmsPlatformQuery,
  } from "../../../Store/reduxBaseURL";
  

function VendorFilters({filterData,setFilterData}) {
    const { data: pageCate } = useGetAllPageCategoryQuery();
    const {
        data: vendorData,
        isLoading: loading,
        refetch: refetchVendor,
      } = useGetAllVendorQuery();


    const category = pageCate?.data;
    console.log(filterData,"category");
    let vendorGlobalData = vendorData?.data;



    const handleCategoryfilter = (e,newValue) => {
        if(newValue && newValue != ""){
            console.log(newValue);

            setFilterData ( vendorGlobalData?.filter((ele)=> ele.vendor_category?.toLowerCase() == newValue?.toLowerCase() ))
        }
    }
  return (
    <Stack spacing={2} direction='row' sx={{m:1}}>

        <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["Theme Page", "Influencer"]}
              onInputChange={(e,value)=>handleCategoryfilter(e,value)}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Category" variant="standard" />}
            />
        <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["1","2","3"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Vendor-Type" variant="standard" />}
            />
        <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["1","2","3"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Platform" variant="standard" />}
            />
        <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["1","2","3"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Cycle" variant="standard" />}
            />
        <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["1","2","3"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Movie" variant="standard" />}
            />
        </Stack>
  )
}

export default VendorFilters