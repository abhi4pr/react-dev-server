import React, { useEffect, useState } from 'react'
import OverView from './OverView'
import axios from 'axios'

const GoalOverview = () => {

    const [goalData,setGoalData]=useState([])
    const getGoalInfo=async ()=>{
        const data=await axios.get('http://34.93.221.166:3000/api/goal')
        setGoalData(data.data.result)
    }

    const hardReload=()=>{
        getGoalInfo()
    }
    useEffect(()=>{
        getGoalInfo()
    },[])
  return (
    <div>
      <OverView name={"Goal"} data={goalData} hardReload={hardReload}/>
    </div>
  )
}

export default GoalOverview
