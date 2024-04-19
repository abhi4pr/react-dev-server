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
  
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const tableId = '661f8aaef8af207af006cdb8';

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
        <div className="data_tbl table-responsive">
          
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
              </tr>
            </thead>
            <tbody>
              {datas.map((row, index) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ObjectOverview;