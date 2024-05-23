import React from 'react'
import CustomTable from '../../../../CustomTable/CustomTable'
import CustomTableWrapper from '../../../../ReusableComponents/CustomTableWrapper'



const View = ({ data, columns, isLoading, title }) => {
    console.log(data, columns);
    return (

        <CustomTableWrapper title={title}>
            <CustomTable
                columns={columns}
                data={data}
                fixedHeader
                dataLoading={isLoading}
                Pagination
            />
        </CustomTableWrapper>

    )
}

export default View