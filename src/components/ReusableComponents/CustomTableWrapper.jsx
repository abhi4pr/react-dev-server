import React, { Children } from 'react'

const CustomTableWrapper = ({ children, title }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h4 className='card-title'>{title}</h4>
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}

export default CustomTableWrapper