import React, { useEffect, useState } from 'react'
import OverView from './OverView'
import axios from 'axios'

const ServicesOverview = () => {

    const [serviceData,setServiceData]=useState([])
    const getServiceInfo=async ()=>{
        const data=await axios.get('http://192.168.29.114:3000/api/services')
        setServiceData(data.data.result)
    }

    const hardReload=()=>{
        getServiceInfo()
    }
    useEffect(()=>{
        getServiceInfo()
    },[])
  return (
    <div>
      <OverView name={"service"} data={serviceData} hardReload={hardReload}/>
    </div>
  )
}

export default ServicesOverview
