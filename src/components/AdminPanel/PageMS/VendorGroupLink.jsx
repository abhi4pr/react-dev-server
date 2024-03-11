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
import Select from "react-select";

const VendorGroupLink = () => {
  const { toastAlert } = useGlobalContext();
  const [groupLink, setGroupLink] = useState("");
  const [description, setDescription] = useState("");
  const [vendorId, setVendorId] = useState("")
  const [linkTypeId, setLinkTypeId] = useState("")
  const [vendorTypes, setVendorTypes] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([])
  const [rowData, setRowData] = useState({})
  const [groupLinkUpdate, setGroupLinkUpdate] = useState("")
  const [descriptionUpdate, setDescriptionUpdate] = useState("")
  const [vendorIdUpdate, setVendorIdUpdate] = useState("")
  const [linkTypeIdUpdate, setLinkTypeIdUpdate] = useState("")

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl+"getAllVendorGroupList")
      .then((res) => {
        setVendorTypes(res.data.data);
        setFilterData(res.data.data);
    });

    axios.get(baseUrl + "vendorAllData").then((res) => {
        setVendorData(res.data.tmsVendorkMastList);
    });
    axios.get(baseUrl + "getAllGroupLink").then((res) => {
        setGroupData(res.data.data);
    });
  };

  useEffect(() => {
    getData();
  },[])

  useEffect(() => {
    const result = vendorTypes.filter((d) => {
      return d.group_link.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + "addVendorGroup", {
      vendorMast_id: vendorId,
      group_link_type_id: linkTypeId,
      group_link: groupLink,
      description: description,
      created_by: userID
    })
    .then(() => {
      // setIsFormSubmitted(true);
      toastAlert("Submitted");
      setGroupLink("")
      setDescription("")
      getData()
    });
  };

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Vendor Group Link",
      selector: (row) => row.group_link,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name
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
            endpoint="deleteVendorGroup"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const handleRowData = (row) =>{
    setRowData(row);
    setGroupLinkUpdate(row.group_link);
    setDescriptionUpdate(row.description);
    setVendorIdUpdate(row.PMSVendorMasts_data.type_id);
    setLinkTypeIdUpdate(row.PMSGroupLinks_data.link_type);
  }

  const handleModalUpdate = () => {
    axios.put(baseUrl+`updateVendorGroup/${rowData._id}`, {
      vendorMast_id: vendorIdUpdate,
      group_link_type_id: groupLinkUpdate,
      group_link: groupLinkUpdate,
      description: descriptionUpdate,
      updated_by: userID
    })
    .then(() => {
      toastAlert("Successfully Update");
      getData();
      setGroupLinkUpdate("")
      setDescriptionUpdate("")
      setVendorIdUpdate('');
      setLinkTypeIdUpdate('');
    });
  };

  return (
    <>
      <FormContainer
        mainTitle="Vendor group link"
        title="Vendor group link"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Group Link *"
          value={groupLink}
          required={true}
          onChange={(e) => setGroupLink(e.target.value)}
        />
        
        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Vendor id <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={vendorData.map((option) => ({
              value: option._id,
              label: option.vendorMast_name,
            }))}
            value={{
              value: vendorId,
              label:
                vendorData.find((role) => role._id === vendorId)?.vendorMast_name ||
                "",
            }}
            onChange={(e) => {
              setVendorId(e.value);
            }}
          ></Select>
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Group link type id <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={groupData.map((option) => ({
              value: option._id,
              label: option.link_type,
            }))}
            value={{
              value: linkTypeId,
              label:
                groupData.find((role) => role._id === linkTypeId)?.link_type ||
                "",
            }}
            onChange={(e) => {
              setLinkTypeId(e.value);
            }}
          ></Select>
        </div>

      </FormContainer>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Vendor group link Overview"
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
                label="Group Link *"
                value={groupLinkUpdate}
                required={true}
                onChange={(e) => setGroupLinkUpdate(e.target.value)}
              />

              <FieldContainer
                label="Description"
                value={descriptionUpdate}
                required={false}
                onChange={(e) => setDescriptionUpdate(e.target.value)}
              />

            <div className="form-group col-6">
              <label className="form-label">
                Vendor id <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={vendorData.map((option) => ({
                  value: option._id,
                  label: option.vendorMast_name,
                }))}
                value={{
                  value: vendorId,
                  label:
                    vendorData.find((role) => role._id === vendorIdUpdate)?.vendorMast_name ||
                    "",
                }}
                onChange={(e) => {
                  setVendorIdUpdate(e.value);
                }}
              ></Select>
            </div>

            <div className="form-group col-6">
              <label className="form-label">
                Group link type id <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={groupData.map((option) => ({
                  value: option._id,
                  label: option.link_type,
                }))}
                value={{
                  value: linkTypeId,
                  label:
                    groupData.find((role) => role._id === linkTypeIdUpdate)?.link_type ||
                    "",
                }}
                onChange={(e) => {
                  setLinkTypeIdUpdate(e.value);
                }}
              ></Select>
            </div>
            
            </div>
            <div className="modal-footer">
              <button type="button" 
                className="btn btn-danger" 
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

export default VendorGroupLink;