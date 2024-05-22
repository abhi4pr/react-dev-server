import React, { useEffect } from 'react'
import Dropdown from './Dropdown'
import '../Table.css'
const TableToolkit = ({ toggleColumnVisibility, setVisibleColumns, columnsheader, visibleColumns, setSelectedRowsData, selectedRowsIndex, data }) => {
    useEffect(() => {
        const selectedRowData = selectedRowsIndex.map(index => data[index]);
        setSelectedRowsData(selectedRowData);
    }, [selectedRowsIndex, data]);
    return (
        <div className="table-toolkit">
            <Dropdown

                btnHtml={<button className='dropdown-btn'>column</button>}

            >

                <div className="">
                    <div>
                        <input
                            type="checkbox"
                            checked={visibleColumns.some(column => column)}
                            onChange={(e) => setVisibleColumns(visibleColumns.map(() => e.target.checked))}
                        />
                        Show/Hide All
                    </div>

                    {columnsheader.map((column, index) => (
                        <div key={index}>
                            <input type="checkbox" checked={visibleColumns[index]} onChange={() => toggleColumnVisibility(index)} />
                            {column.name}
                        </div>
                    ))}
                </div>

            </Dropdown >
        </div>
    )
}

export default TableToolkit