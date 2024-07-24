import React from 'react'
import WFHDUsersGrapf from './WFHDUsersGraph'
import UserCountInCards from './UserCountInCards'
import SalaryDetailsInLineChart from './SalaryDetailsInLineChart'
import BirthdayAndWorkAniCard from './BirthdayAndWorkAniCard'

const AnalyticDashboard = () => {
  return (
    <>
    <div>AnalyticDashboard</div>
    <UserCountInCards/>
    <div className="row">
      <div className="col-4">
    <WFHDUsersGrapf/>
    </div>
    <div className="col-6">
    <SalaryDetailsInLineChart/>
    </div>
    </div>
    <BirthdayAndWorkAniCard/>
    </>
  )
}

export default AnalyticDashboard