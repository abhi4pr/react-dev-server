import React, { useEffect, useState } from "react";
import "./Table.css";
import { useRef } from "react";
import PaginationComp from "./TableComponent/PaginationComp";
import Dropdown from "./TableComponent/Dropdown";
import TableToolkit from "./TableComponent/TableToolkit";
import RenderedTable from "./TableComponent/RenderedTable";
import { set } from "date-fns";

const CustomTable = ({
  columns,
  data,
  fixedHeader = true,
  Pagination = false,
  dataLoading = false,
  rowSelectable,
}) => {
  const [columnsheader, setColumns] = useState(columns);
  const [resizing, setResizing] = useState(null);
  const [widths, setWidths] = useState(columns);
  const [itemsPerPage, setItemsPerPage] = useState(
    Pagination && Pagination.length > 0 ? Pagination[0] : 10
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [ascFlag, setAscFlag] = useState({ ...columns?.map(() => true) });
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) => column.showCol === undefined ? true : column.showCol)
  );
  const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editablesRows, setEditablesRows] = useState(
    columns.map((column) => (column.editable === undefined ? false : column.editable))
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [sortedData, setSortedData] = useState([])
  const filteredData = searchQuery
    ? data?.filter(item => (columnsheader.map(column => column.key).some(key => item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase()))))
    : data;


  let pagination = Pagination?.length > 0 ? Pagination : [10, 50, 100];

  const tabledata = pagination
    ? filteredData?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data;

  const toggleColumnVisibility = (index) => {
    setVisibleColumns(
      visibleColumns.map((visible, i) => (i === index ? !visible : visible))
    );
  };
  useEffect(() => {
    setSortedData(tabledata)
  }, [itemsPerPage, currentPage, searchQuery])

  // setSortedData(tabledata?.sort((a, b) => {
  //   if (a[sortKey] < b[sortKey]) {
  //     return sortDirection === "asc" ? -1 : 1;
  //   }
  //   if (a[sortKey] > b[sortKey]) {
  //     return sortDirection === "asc" ? 1 : -1;
  //   }
  //   return 0;
  // }))

  useEffect(() => {
    setColumns(columns);
    setWidths(columns);
    setAscFlag({ ...columns?.map(() => true) });
    setVisibleColumns(columns.map((column) => column.showCol === undefined ? true : column.showCol));
    setEditablesRows(
      columns.map((column) => (column.editable === undefined ? false : column.editable))
    );
    setSortedData(tabledata);
  }, [dataLoading, columns]);

  return (
    <div className="table-pagination-container">
      <TableToolkit
        columnsheader={columnsheader}
        setVisibleColumns={setVisibleColumns}
        visibleColumns={visibleColumns}
        data={data}
        selectedRowsIndex={selectedRowsIndex}
        setSelectedRowsData={setSelectedRowsData}
        selectedRowsData={selectedRowsData}
        toggleColumnVisibility={toggleColumnVisibility}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="table-container">
        {
          <RenderedTable
            dataLoading={dataLoading}
            data={data}
            setSortKey={setSortKey}
            fixedHeader={fixedHeader}
            rowSelectable={rowSelectable}
            visibleColumns={visibleColumns}
            columnsheader={columnsheader}
            ascFlag={ascFlag}
            selectAll={selectAll}
            setColumns={setColumns}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            selectedRowsIndex={selectedRowsIndex}
            setSelectedRowsIndex={setSelectedRowsIndex}
            setSelectAll={setSelectAll}
            setAscFlag={setAscFlag}
            resizing={resizing}
            setResizing={setResizing}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            widths={widths}
            setWidths={setWidths}
            sortedData={sortedData}
            setSortedData={setSortedData}
            editableRows={editablesRows}

          />
        }
      </div>
      {Pagination && (
        <PaginationComp
          data={data}
          Pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default CustomTable;
