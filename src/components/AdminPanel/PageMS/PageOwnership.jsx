import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";

const PageOwnership = () => {
  const { toastAlert } = useGlobalContext();
  const [pageId, setPageId] = useState("");
  const [ownerVendorId, setOwnerVendorId] = useState("");
  const [sharingPer, setSharingPer] = useState("");
  const [ownerships, setOwnerships] = useState(""); 
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowData, setRowData] = useState({});
  const [ownerUpdate, setOwnerUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");
  const [pageIdUpdate, setPageIdUpdate] = useState("");
  const [ownerVendorIdUpdate, setOwnerVendorIdUpdate] = useState("");
  const [sharingPerUpdate, setSharingPerUpdate] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(`${baseUrl}getPageOwnerList`)
      .then((res) => {
        setFilterData(res.data.data);
        setData(res.data.data);
        console.log("dddddddd",res.data.data)
      });
  };

  useEffect(() => {
    getData();
  }, []);

   useEffect(() => {
    const result = data.filter((d) => {
       return d.ownership_type?.toLowerCase().includes(search.toLowerCase());
     });
     setFilterData(result);
   }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}addPageOwner`, {
      ownership_type: ownerships,
      description: description,
      pageMast_id: pageId,
      vendorMast_id: ownerVendorId,
      sharing_per: sharingPer,
      created_by: userID
    })
    .then(() => {
      toastAlert("Submitted");
      setOwnerships("");
      setDescription("");
      setPageId("");
      setOwnerVendorId("");
      setSharingPer("");
      getData();
    });
  };


  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    
    {
      name: "Ownership",
      selector: (row) => row.ownership_type, 
    },
    {
      name: "Description",
      selector: (row) => row.description, 
    },
    {
      name: "PageMast Id",
      selector: (row) => row.pageMast_id, 
    },
    {
      name: "VendorMast Id",
      selector: (row) => row.vendorMast_id, 
    },
    {
      name: "Sharing Per",
      selector: (row) => row.sharing_per, 
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleRowData(row)}
            data-toggle="modal" data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton
            endpoint="deletePageOwner" 
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ]

  const handleRowData = (row) => {
    setRowData(row);
    setOwnerUpdate(row.ownership_type); 
    setDescriptionUpdate(row.description);
    setPageIdUpdate(row.pageMast_id);
    setOwnerVendorIdUpdate(row.vendorMast_id);
    setSharingPerUpdate(row.sharing_per);
};

  const handleModalUpdate = () => {
    axios.put(baseUrl + `updatePageOwner/${rowData._id}`, { 
      ownership_type: ownerUpdate, 
      description: descriptionUpdate,
      pageMast_id: pageIdUpdate,
      vendorMast_id: ownerVendorIdUpdate,
      sharing_per: sharingPerUpdate,

      updated_by: userID
    })
    .then(() => {
      toastAlert("Successfully Update");
      getData();
      setOwnerUpdate("");
      setDescriptionUpdate("");
      setPageIdUpdate("");
      setOwnerVendorIdUpdate("");
      setSharingPerUpdate("");

    });
  };


  return (
    <>
      <FormContainer
        mainTitle="Page Ownership"
        title="Add New Ownership"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Ownership Name *"
          value={ownerships}
          required={true}
          onChange={(e) => setOwnerships(e.target.value)}
        />
        <FieldContainer
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FieldContainer
          label="Page ID *"
          type="number"
          value={pageId} 
          required={true}
          onChange={(e) => setPageId(e.target.value)}
        />
        <FieldContainer
          label="Owner Vendor ID *"
          type="number"
          value={ownerVendorId} 
          required={true}
          onChange={(e) => setOwnerVendorId(e.target.value)}
        />
        <FieldContainer
          label="Sharing Per *"
          type="number"
          value={sharingPer}
          required={true}
          onChange={(e) => setSharingPer(e.target.value)}
        />
      </FormContainer>

    
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Page Category Overview" 
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search Here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>

      <div id="myModal" className="modal fade" role="dialog">
        <div className="modal-dialog">

          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Update</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="ownerships *"
                value={ownerUpdate}
                required={true}
                onChange={(e) => setOwnerUpdate(e.target.value)}
              />

              <FieldContainer
                label="Description"
                value={descriptionUpdate}
                required={true}
                onChange={(e) => setDescriptionUpdate(e.target.value)}
              />

               <FieldContainer
                label="Page ID"
                type="number"
                value={pageIdUpdate}
                required={true}
                onChange={(e) => setPageIdUpdate(e.target.value)}
              />

               <FieldContainer
                label="Vendor ID"
                type="number"
                value={ownerVendorIdUpdate}
                required={true}
                onChange={(e) => setOwnerVendorIdUpdate(e.target.value)}
              />

               <FieldContainer
                label="Sharing Per"
                type="number"
                value={sharingPerUpdate}
                required={true}
                onChange={(e) => setSharingPerUpdate(e.target.value)}
              />
              
            </div>
            <div className="modal-footer">
              <button type="button" 
                className="btn btn-primary" 
                data-dismiss="modal"
              >Close</button>
              <button type="button" 
                className="btn btn-success" 
                onClick={handleModalUpdate}
                data-dismiss="modal"
              >Update</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PageOwnership;
