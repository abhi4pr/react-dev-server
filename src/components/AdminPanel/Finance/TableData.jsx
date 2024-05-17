import React, { useState } from "react";

const TableData = ({ setColumnsData, columnsData, filterData }) => {
  console.log(
    columnsData,
    "column Data???------------------",
    filterData,
    "filter data ---------------------------------"
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
  };

  const getPageCount = () => {
    return Math.ceil(filterData.length / itemsPerPage);
  };

  const getPageData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filterData.slice(startIndex, endIndex);
  };

  return (
    <div>
      <div className="data_tbl table-responsive table_responsive">
        <table className="table border m-0">
          <thead>
            <tr>
              {columnsData?.map((column, index) => (
                <th key={index}>
                  <div className="MuiDataGrid-columnHeaderTitleContainer MuiDataGrid-columnHeader MuiDataGrid-columnHeader--sortable MuiDataGrid-columnHeader--sorted MuiDataGrid-withBorderColor">
                    <div className="MuiDataGrid-columnHeaderTitleContainerContent">
                      <div className="MuiDataGrid-columnHeaderTitle css-t89xny-MuiDataGrid-columnHeaderTitle head-font ">
                        {column}
                      </div>
                    </div>
                  </div>
                </th>
              ))}
              <th>
                <div className="MuiDataGrid-columnHeaderTitleContainer MuiDataGrid-columnHeader MuiDataGrid-columnHeader--sortable MuiDataGrid-columnHeader--sorted MuiDataGrid-withBorderColor">
                  <div className="MuiDataGrid-columnHeaderTitleContainerContent">
                    <div className="MuiDataGrid-columnHeaderTitle css-t89xny-MuiDataGrid-columnHeaderTitle head-font ">
                      Action
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {getPageData(filterData).map((row, index) => (
              <tr className="dt-row" key={row.id}>
                {columnsData?.map((column) => (
                  <td key={column}>
                    <div className="dt-row-col">{row[column]}</div>
                  </td>
                ))}
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-pagination pagination MuiDataGrid-footerContainer MuiDataGrid-withBorderColor css-wop1k0-MuiDataGrid-footerContainer sb">
        <div></div>
        <div className="MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular MuiTablePagination-toolbar css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar">
          <span>
            {currentPage + 1} of {getPageCount()}
          </span>
          <div className="MuiTablePagination-actions mr-4">
            <button
              className={`MuiButtonBase-root MuiIconButton-root  MuiIconButton-colorInherit MuiIconButton-sizeMedium css-zylse7-MuiButtonBase-root-MuiIconButton-root ${
                currentPage === 0 ? "Mui-disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <svg
                className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="KeyboardArrowLeftIcon"
              >
                <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"></path>
              </svg>
            </button>
            <button
              className={`MuiButtonBase-root MuiIconButton-root  MuiIconButton-colorInherit MuiIconButton-sizeMedium css-zylse7-MuiButtonBase-root-MuiIconButton-root ${
                currentPage === getPageCount() - 1 ? "Mui-disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === getPageCount() - 1}
            >
              <svg
                className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
                data-testid="KeyboardArrowRightIcon"
              >
                <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path>
              </svg>
            </button>
          </div>
          <div className="MuiTablePagination-actions mr-4">
            <div className="MuiInputBase-root MuiInputBase-colorPrimary MuiTablePagination-input css-16c50h-MuiInputBase-root-MuiTablePagination-select">
              <label className="mr-4" htmlFor="itemsPerPage">
                Items Per Page
              </label>
              <select
                style={{
                  borderRadius: "40px",
                  background: "var(--white)",
                  border: "none",
                }}
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="mr-4">Total Rows: {columnsData.length}</div>
        </div>
      </div>
    </div>
  );
};

export default TableData;
