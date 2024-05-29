import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import SkeletonLoader from "./SkeletonLoader";
import { set } from "date-fns";
const RenderedTable = ({
  data,
  fixedHeader,
  visibleColumns,
  rowSelectable,
  columnsheader,
  ascFlag,
  selectAll,
  currentPage,
  itemsPerPage,
  setSelectedRowsIndex,
  setSelectAll,
  setSortKey,
  setAscFlag,
  setResizing,
  setSortDirection,
  resizing,
  widths,
  setWidths,
  setColumns,
  sortedData,
  setSortedData,
  selectedRowsIndex,
  dataLoading,
  editableRows,
}) => {

  const [preventSelect, setPreventSelect] = useState(false);
  const [editflag, setEditFlag] = useState(false)
  const handleRowSelection = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    setSelectedRowsIndex((prevState) => {
      if (prevState.includes(actualIndex)) {
        return prevState.filter((i) => i !== actualIndex);
      } else {
        return [...prevState, actualIndex];
      }
    });
  };
  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedRowsIndex(data?.map((_, index) => index));
    } else {
      setSelectedRowsIndex([]);
    }
  };
  const sortFunc = (key, direction) => {
    setSortKey(key);
    setAscFlag({ ...ascFlag, [direction]: !ascFlag[direction] });
    setSortDirection(ascFlag[direction] ? "asc" : "desc");
  };
  const onMouseDown = (index) => (e) => {
    setResizing({
      index,
      startPos: e.clientX,
      startWidth: widths[index].width,
    });
    setPreventSelect(true);
  };
  const onMouseMove = (e) => {
    if (!resizing) return;
    const newWidths = [...widths];
    newWidths[resizing.index].width =
      resizing.startWidth + (e.clientX - resizing.startPos);
    setWidths(newWidths);
  };
  const onMouseUp = () => {
    setResizing(null);
    setPreventSelect(false);
  };
  useEffect(() => {
    if (resizing !== null) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [resizing, widths]);
  const onDragStart = (e, index) => {
    e.dataTransfer.setData("dragged", index);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDrop = (e, target) => {
    const draggedIndex = e.dataTransfer.getData("dragged");
    const newColumns = [...columnsheader];
    const draggedColumn = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(target, 0, draggedColumn);
    setColumns(newColumns);
    setWidths(newColumns);
  };
  const handelchange = (e) => {
    let newData = [...sortedData];
    newData[index] = { ...newData[index], [column.key]: e.target.value }
    setSortedData(newData);
    if (e.target.value === "" || editflag === false) {
      let prevData = [...sortedData];
      prevData[index] = { ...prevData[index], [column.key]: data[index][column.key] }
      setSortedData(prevData);
    }
  }

  return (
    <>
      {dataLoading ? (
        <SkeletonLoader />
      ) : (
        <table className={`${preventSelect ? "prevent-select" : ""}`}>
          <thead className={fixedHeader ? "sticky-header" : ""}>
            <tr>
              {visibleColumns.some((value) => value) && rowSelectable && (
                <th
                  style={{
                    width: "40px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "4px",
                    padding: "0",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columnsheader?.map(
                (column, index) =>
                  visibleColumns[index] && (
                    <th
                      key={index}
                      style={{
                        width: `${column.width ? column.width : 100}px`,
                      }}
                    >
                      <div className="table-header">
                        <div
                          className="header-title"
                          key={index}
                          draggable
                          onDragStart={(e) => onDragStart(e, index)}
                          onDragOver={onDragOver}
                          onDrop={(e) => onDrop(e, index)}
                        >
                          <p>{column.name}</p>
                        </div>
                        <div className="wrapper-filed">
                          <Dropdown
                            btnHtml={
                              <div className="col-opt">
                                <svg
                                  width="15px"
                                  height="30px"
                                  viewBox="0 0 16 16"
                                  fill="#959DA3"
                                  className="bi bi-three-dots-vertical"
                                >
                                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
                              </div>
                            }
                          >
                            {column.sortable && (
                              <button
                                onClick={() => {
                                  sortFunc(column.key, index);
                                }}
                              >
                                {ascFlag[index] ? "Desc" : "Asc"}
                              </button>
                            )}
                          </Dropdown>
                          <div
                            className="resizable"
                            onMouseDown={onMouseDown(index)}
                          >

                            |
                          </div>
                        </div>
                      </div>
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData?.length === 0 ? (
              <div className="empty-state">
                <h3>No Data Found</h3>
              </div>
            ) : (
              sortedData?.map((row, index) => (
                <tr key={index}>
                  {visibleColumns.some((value) => value) && rowSelectable && (
                    <td
                      style={{
                        paddingTop: "4px",
                        paddingLeft: "14px"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRowsIndex.includes(
                          (currentPage - 1) * itemsPerPage + index
                        )}
                        onChange={() => handleRowSelection(index)}
                      />
                    </td>
                  )}
                  {columnsheader.map(
                    (column, colIndex) =>
                      visibleColumns[colIndex] && (
                        <td key={colIndex}>
                          {console.log(column.key)}
                          {editableRows[colIndex] && editflag === index ? column.customEditElement ? column.customEditElement(row, index, setEditFlag, handelchange) : (<input className="form-input" type="text" placeholder={row[column.key]} onChange={(e) => handelchange(e)} />) : (column.renderRowCell
                            ? column.renderRowCell(row, index, setEditFlag, handelchange)
                            : row[column.key])}
                        </td>

                      ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </>
  );
};
export default RenderedTable;
