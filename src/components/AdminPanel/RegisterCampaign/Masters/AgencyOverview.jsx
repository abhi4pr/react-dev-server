import React, { useEffect, useState } from 'react'
import OverView from './OverView'
import axios from 'axios'

const AgencyOverview = () => {

    const [agencyData,setAgencyData]=useState([])
    const getAgencyInfo=async ()=>{
        const data=await axios.get('http://192.168.29.114:3000/api/agency')
        setAgencyData(data.data.result)
    }

    const hardReload=()=>{
        getAgencyInfo()
    }
    useEffect(()=>{
        getAgencyInfo()
    },[])
  return (
    <div>
      <OverView name={"agency"} data={agencyData} hardReload={hardReload}/>
    </div>
  )
}

export default AgencyOverview
