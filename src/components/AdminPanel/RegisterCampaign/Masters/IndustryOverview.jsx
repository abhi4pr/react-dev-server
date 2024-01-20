import React, { useEffect, useState } from 'react'
import OverView from './OverView'
import axios from 'axios'

const IndustryOverview = () => {

    const [industryData,setIndustryData]=useState([])
    const getIndustryInfo=async ()=>{
        const data=await axios.get('http://192.168.29.114:3000/api/industry')
        setIndustryData(data.data.result)
    }

    const hardReload=()=>{
        getIndustryInfo()
    }
    useEffect(()=>{
        getIndustryInfo()
    },[])
  return (
    <div>
        
      <OverView name={"industry"} data={industryData} hardReload={hardReload}/>
    </div>
  )
}

export default IndustryOverview
