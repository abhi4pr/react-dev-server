import React from 'react'
import CustomTable from '../../../../CustomTable/CustomTable'
import CustomTableWrapper from '../../../../ReusableComponents/CustomTableWrapper'



const View = ({ data, columns, isLoading, title, rowSelectable = false, pagination = true }) => {

    return (

        <CustomTableWrapper title={title}>
            <CustomTable
                columns={columns}
                data={data}
                fixedHeader
                dataLoading={isLoading}
                Pagination={pagination}
                rowSelectable={rowSelectable}
            />
        </CustomTableWrapper>

    )
}

export default View