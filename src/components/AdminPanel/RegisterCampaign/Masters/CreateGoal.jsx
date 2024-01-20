import React from 'react'
import CreateMaster from './CreateMaster'

const CreateGoal = () => {
  return (
    <>
      <CreateMaster name={"Goal"}
      data ={[{label:"name",payload:"name"},
      {label:"description",payload:"description"}
      ]}/>
    </>
  )
}

export default CreateGoal
