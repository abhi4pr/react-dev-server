import React from 'react'
import CreateMaster from './CreateMaster'

const CreateIndustry = () => {
  return (
    <div>
       <CreateMaster name={"Industry"}
      data ={[{label:"name",payload:"name"},
      {label:"description",payload:"description"}
      ]}/>
    </div>
  )
}

export default CreateIndustry
