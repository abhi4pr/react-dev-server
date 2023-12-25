import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";

const BrandMast = () => {
  const [brandName, setBrandName] = useState("");
  const [brnadData, setBrandData] = useState([]);
  const [Brnadfilter, setBrnadFilter] = useState([]);
  const [search, setSearch] = useState("");

  const [brandId, setBrandId] = useState(0);
  const [brandNameUpdate, setBrandNameUpdate] = useState("");

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Brnad Name",
      selector: (row) => row.asset_brand_name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModal"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleBrandData(row)}
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="delete_asset_brand"
            id={row.asset_brand_id}
            getData={getBrandData}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://34.93.221.166:3000/api/add_asset_brand",
        {
          asset_brand_name: brandName,
        }
      );
      getBrandData();
    } catch (error) {
      console.log(error);
    }
  };
  async function getBrandData() {
    const res = await axios.get(
      "http://34.93.221.166:3000/api/get_all_asset_brands"
    );
    setBrandData(res.data.data);
    setBrnadFilter(res.data.data);
  }

  useEffect(() => {
    getBrandData();
  }, []);

  const handleBrandData = (row) => {
    console.log(row, "data");
    setBrandId(row.asset_brand_id);
    setBrandNameUpdate(row.asset_brand_name);
  };
  const handleBrandUpdate = () => {
    axios
      .put("http://34.93.221.166:3000/api/update_asset_brand", {
        asset_brand_id: brandId,
        asset_brand_name: brandNameUpdate,
      })
      .then((res) => {
        getBrandData();
      });
  };

  useEffect(() => {
    const result = brnadData.filter((d) => {
      return d.asset_brand_name.toLowerCase().match(search.toLocaleLowerCase());
    });
    setBrnadFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Brand"
          title="Add Brand"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Brand Overview"
              columns={columns}
              data={Brnadfilter}
              fixedHeader
              // pagination
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
      {/* Update  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Brand Update
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Brand Name"
                fieldGrid={12}
                value={brandNameUpdate}
                onChange={(e) => setBrandNameUpdate(e.target.value)}
              ></FieldContainer>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleBrandUpdate}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandMast;
