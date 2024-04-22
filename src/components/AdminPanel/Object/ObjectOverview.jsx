// import { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { Link } from "react-router-dom";
// import { FaEdit } from "react-icons/fa";
// import DeleteButton from "../DeleteButton";
// import axios from "axios";
// import FormContainer from "../FormContainer";
// import jwtDecode from "jwt-decode";
// import { baseUrl } from "../../../utils/config";

// const ObjectOverview = () => {
//   const [search, setSearch] = useState("");
//   const [datas, setData] = useState([]);
//   const [filterData, setFilterData] = useState([]);
//   const [contextData, setDatas] = useState([]);

//   const storedToken = sessionStorage.getItem("token");
//   const decodedToken = jwtDecode(storedToken);
//   const userID = decodedToken.id;
//   useEffect(() => {
//     if (userID && contextData.length === 0) {
//       axios
//         .get(
//           `${baseUrl}`+`get_single_user_auth_detail/${userID}`
//         )
//         .then((res) => {
//           setDatas(res.data);
//         });
//     }
//   }, [userID]);

//   function getData() {
//     axios.get(baseUrl+"get_all_objs").then((res) => {
//       setData(res.data.data);
//       setFilterData(res.data.data);
//     });
//   }

//   useEffect(() => {
//     getData();
//   }, []);

//   useEffect(() => {
//     const result = datas.filter((d) => {
//       return (
//         d.obj_name?.toLowerCase().match(search.toLowerCase()) ||
//         d.soft_name?.toLowerCase().match(search.toLowerCase())
//       );
//     });
//     setFilterData(result);
//   }, [search]);

//   const columns = [
//     {
//       name: "S.No",
//       cell: (row, index) => <div>{index + 1}</div>,
//       width: "9%",
//       sortable: true,
//     },
//     {
//       name: "Object Name",
//       selector: (row) => row.obj_name,
//       sortable: true,
//     },
//     {
//       name: "Software Name",
//       selector: (row) => row.soft_name,
//     },
//     {
//       name: "Department",
//       selector: (row) => row.dept_name,
//     },
//     {
//       name: "Action",
//       cell: (row) => (
//         <>
//           {contextData &&
//             contextData[2] &&
//             contextData[2].update_value === 1 && (
//               <Link to={`/admin/object-update/${row.obj_id}`}>
//                 <button
//                   title="Edit"
//                   className="btn btn-outline-primary btn-sm user-button"
//                 >
//                   <FaEdit />{" "}
//                 </button>
//               </Link>
//             )}
//           {contextData &&
//             contextData[2] &&
//             contextData[2].delete_flag_value === 1 && (
//               <DeleteButton
//                 endpoint="obj_delete"
//                 id={row.obj_id}
//                 getData={getData}
//               />
//             )}
//         </>
//       ),
//       allowOverflow: true,
//       width: "22%",
//     },
//   ];

//   return (
//     <>
//       <FormContainer
//         mainTitle="Object"
//         link="/admin/object-master"
//         buttonAccess={
//           contextData &&
//           contextData[2] &&
//           contextData[2].insert_value === 1 &&
//           true
//         }
//       />

//       <div className="card">
//         <div className="data_tbl table-responsive">
//           <DataTable
//             title="Object Overview"
//             columns={columns}
//             data={filterData}
//             fixedHeader
//             // pagination
//             fixedHeaderScrollHeight="64vh"
//             highlightOnHover
//             subHeader
//             subHeaderComponent={
//               <input
//                 type="text"
//                 placeholder="Search here"
//                 className="w-50 form-control"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             }
//           />
//         </div>
//       </div>
//     </>
//   );
// };



import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import axios from "axios";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const ObjectOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10); 
  const [filters, setFilters] = useState([]);
  
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const tableId = '661f8aaef8af207af006cdb8';

  // custom dynamic table code starts here

  const getTableData = async() => {
    await axios.get(baseUrl + `get_dynamic_table_data/${tableId}`)
      .then((res) => {
        const initialColumns = res.data.data[0].column_order_Obj || 
        ["Created_by","Dept_id","dept_name","obj_id","obj_name","soft_name","_id"];
        setColumns(initialColumns);
      });
  }
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const newColumns = [...columns];
    const draggedColumn = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    axios.put(`${baseUrl}`+`edit_dynamic_table_data`,{
      _id: tableId,
      column_order_Obj: newColumns
    });
    setColumns(newColumns);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleColumn = (columnName) => {
    let newColumns;
    if (columns.includes(columnName)) {
      newColumns = columns.filter((col) => col !== columnName);
    } else {
      newColumns = [...columns, columnName];
    }
    axios.put(`${baseUrl}` + `edit_dynamic_table_data`, {
      _id: tableId,
      column_order_Obj: newColumns
    })
    .then(() => {
      setColumns(newColumns);
      getTableData();
    })
    .catch((error) => {
      console.error('Error editing dynamic table data:', error);
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getPageCount = () => {
    return Math.ceil(datas.length / itemsPerPage);
  };

  const getPageData = (datas) => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return datas.slice(startIndex, endIndex);
  };

  // custom dynamic table code ends here

  // multiple filter code start here

  const addFilter = () => {
    const defaultColumn = columns[0]; 
    const newFilters = [...filters, { column: defaultColumn, value: '' }];
    setFilters(newFilters);
  };

  const updateFilterColumn = (index, column) => {
    const updatedFilters = [...filters];
    updatedFilters[index].column = column;
    setFilters(updatedFilters);
  };

  const getUniqueColumnValues = (columnName) => {
    const uniqueValues = new Set();
    datas.forEach((item) => {
      if (columnName in item) {
        uniqueValues.add(item[columnName]);
      }
    });
    return Array.from(uniqueValues);
  };
  
  const filterDataFun = (filters) => {
    let filteredData = [...datas];
    filters.forEach((filter) => {
      const { column, value } = filter;
      if (value !== '') {
        filteredData = filteredData.filter((item) => {
          const itemValue = String(item[column]).toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    setFilterData(filteredData);
  };

  const handleFilterChange = (index, column, value) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { column, value };
    setFilters(updatedFilters);
    filterDataFun(updatedFilters);
  };


  // multiple filter code end here

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);

  function getData() {
    axios.get(baseUrl+"get_all_objs").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
    getTableData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return (
        d.obj_name?.toLowerCase().match(search.toLowerCase()) ||
        d.soft_name?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  return (
    <>
      <FormContainer
        mainTitle="Object"
        link="/admin/object-master"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          true
        }
      />

      <div className="card">
        <div className="makeInRow" style={{display:"flex"}}>
          <div>
            <button onClick={toggleDrawer} className="btn btn-primary">Hide/Show Columns</button>
            {drawerOpen && (
              <div className="drawer">
                {Object.keys(datas[0]).map((key) => (
                  <div key={key} onClick={() => toggleColumn(key)}>
                    <input type="checkbox" checked={columns.includes(key)} readOnly />
                    {key}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="search-container">
            <input
              className="form-control w-50"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>

          <div className="filter-container">
            {filters.map((filter, index) => (
              <div key={index} className="filter">
                <select
                  className='form-control'
                  value={filter.column}
                  onChange={(e) => {
                    const column = e.target.value;
                    updateFilterColumn(index, column); 
                  }}
                >
                  {columns.map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
                {filter.column && (
                  <select
                    className='form-control'
                    value={filter.value}
                    onChange={(e) => handleFilterChange(index, filter.column, e.target.value)}
                  >
                    <option value="">Select Value</option>
                    {getUniqueColumnValues(filter.column).map((value, i) => (
                      <option key={i} value={value}>{value}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            <button className="btn btn-success" onClick={addFilter}>Add Filter</button>
            {/* <button className="btn btn-warning" onClick={applyFilters}>Apply Filters</button> */}
          </div>
        </div>

          <div className="data_tbl table-responsive">
          <table className="table border table-striped mt-2">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    className="bg-default"
                    key={column}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {column}
                  </th>
                ))}
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {getPageData(filterData).map((row, index) => (
              // {getPageData(search ? filterData : datas).map((row, index) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column}>{row[column]}</td>
                  ))}
                  <td>
                    <Link to={`/admin/object-update/${row.obj_id}`}>
                      <button title="Edit" className="btn btn-outline-primary btn-sm-user-button">
                        <FaEdit />{" "}
                      </button>
                    </Link>
                    <DeleteButton 
                      endpoint={"obj_delete"}
                      id={row.obj_id}
                      getData={getData}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>{currentPage + 1} of {getPageCount()}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === getPageCount() - 1}
            >
              Next
            </button>
          </div>
        
      </div>
    </>
  );
};

export default ObjectOverview;