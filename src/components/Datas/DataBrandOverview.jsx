import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import FormContainer from "../AdminPanel/FormContainer";
import UserNav from "../Pantry/UserPanel/UserNav";
import FieldContainer from "../AdminPanel/FieldContainer";
import imageIcon from "./image-icon.png";
import DeleteButton from "../AdminPanel/DeleteButton";

const DataBrandOverview = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [backupData, setBackupData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [contentData, setContentData] = useState([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [platformData, setPlatformData] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [countData, setCountData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);

  async function getData() {
    await axios
      .get("http://34.93.221.166:3000/api/get_all_datas")
      .then((res) => {
        setCountData(res.data);
        const responseData = res.data;
        const uniqueBrandName = new Set();
        const filteredData = responseData.filter((item) => {
          if (!uniqueBrandName.has(item.data_name)) {
            uniqueBrandName.add(item.data_name);
            return true;
          }
          return false;
        });
        setData(filteredData);
        setBackupData(filteredData);
      });

    axios
      .get("http://34.93.221.166:3000/api/get_all_data_categorys")
      .then((res) => setCategoryData(res.data.simcWithSubCategoryCount));

    axios
      .get("http://34.93.221.166:3000/api/get_all_data_brands")
      .then((res) => setBrandData(res.data));

    axios
      .get("http://34.93.221.166:3000/api/get_all_users")
      .then((res) => setEmployeeData(res.data.data));

    axios
      .get("http://34.93.221.166:3000/api/get_all_data_platforms")
      .then((res) => setPlatformData(res.data));
    axios

      .get("http://34.93.221.166:3000/api/get_all_data_content_types")
      .then((res) => setContentData(res.data));
  }

  const getBrandCount = (brandName, data) => {
    const count = countData.filter(
      (item) => item.data_name === brandName
    ).length;
    return count;
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "" && selectedUser === "" && selectedBrand === "" && selectedContent === "" && selectedPlatform === "") {
      setData(backupData);
    } else {
      const filteredData = backupData.filter(
        (item) =>
          (selectedCategory === "" || item.cat_id === selectedCategory) &&
          (selectedUser === "" || item.created_by === selectedUser) &&
          (selectedBrand === "" || item.brand_id === selectedBrand) &&
          (selectedContent === "" || item.content_type_id === selectedContent) &&
          (selectedPlatform === "" || item.platform_id === selectedPlatform)
      );
      setData(filteredData);
    }
  }, [selectedCategory, selectedUser, selectedBrand, selectedContent, selectedPlatform]);  

  const deleteBrand = async (brand_name) => {
    await axios
      .delete(
        `http://34.93.221.166:3000/api/delete_data_based_data/${brand_name}`
      )
      .then((res) => {
        getData();
      })
      .catch((error) => {
        console.error("Error deleting brand:", error);
      });
  };

  return (
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg h100vh">
          <div className="container">
            <div className="action_heading">
              <div className="action_title">
                <FormContainer mainTitle="Data" link="/data-brand-master" />
              </div>
              <div className="action_btns">
                <Link to="/data-content-type">
                  <button type="button" className="btn btn-primary btn-sm">
                    Content Type
                  </button>
                </Link>
                <Link to="/data-platform">
                  <button type="button" className="btn btn-primary btn-sm">
                    Platform
                  </button>
                </Link>
                <Link to="/data-brand">
                  <button type="button" className="btn btn-primary btn-sm">
                    Brand
                  </button>
                </Link>
                <Link to="/data-brand-category">
                  <button type="button" className="btn btn-primary btn-sm">
                    Category
                  </button>
                </Link>
                <Link to="/data-brand-sub-category">
                  <button type="button" className="btn btn-primary btn-sm">
                    Sub Category
                  </button>
                </Link>
                <Link to="/data-brand-master">
                  <button type="button" className="btn btn-primary btn-sm">
                    Create Data
                  </button>
                </Link>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body pb0 pb4">
                <div className="row thm_form">
                  <FieldContainer
                    label="Category"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {categoryData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.category_name}
                      </option>
                    ))}
                  </FieldContainer>
                  <FieldContainer
                    label="Brand"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {brandData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.brand_name}
                      </option>
                    ))}
                  </FieldContainer>
                  <FieldContainer
                    label="Content type"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedContent}
                    onChange={(e) => setSelectedContent(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {contentData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.content_name}
                      </option>
                    ))}
                  </FieldContainer>
                  <FieldContainer
                    label="Platform"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {platformData.map((data) => (
                      <option key={data._id} value={data._id}>
                        {data.platform_name}
                      </option>
                    ))}
                  </FieldContainer>
                  <FieldContainer
                    label="Upload By"
                    Tag="select"
                    fieldGrid={4}
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Please select</option>
                    {employeeData.map((data) => (
                      <option key={data.user_id} value={data.user_id}>
                        {data.user_name}
                      </option>
                    ))}
                  </FieldContainer>
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                    <div className="form-group">
                      <label className="form-label">Search</label>
                      <input
                        className="form-control"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by brand name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="summary_cards flex-row row">
              {data.length > 0 &&
                data
                  .filter((detail) =>
                    detail.data_name?.toLowerCase().includes(search.toLowerCase()) || detail.data_type?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((detail) => {
                    return (
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="summary_card">
                          <div className="summary_cardtitle">
                            <h5>
                              <span>{detail.data_name}</span>
                            </h5>
                            <div className="summary_cardaction">
                              <Link to={`/data-brand-update/${detail._id}`}>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </Link>
                              {/* <Link to={`/brand-view/${detail.logo_id}`}>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                title="View"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                            </Link> */}
                              <DeleteButton
                                endpoint="delete_data_based_data"
                                id={detail.data_name}
                                getData={getData}
                              />
                              {/* <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete"
                                onClick={() => deleteBrand(detail.data_name)}
                              >
                                <i className="bi bi-trash3"></i>
                              </button> */}
                            </div>
                          </div>
                          <div className="summary_cardbody">
                            <Link to={`/data-brand-view/${detail._id}`}>
                              <div className="summary_cardrow flex-column">
                                <div className="summary_box text-center ml-auto mr-auto">
                                  {(detail.data_type == 'jpg' || detail.data_type == 'png' || detail.data_type == 'jpeg') ? 
                                    (<img
                                      src={detail.data_image}
                                      width="100%"
                                      height="100%"
                                    />): 
                                    (<img
                                      src={imageIcon}
                                      width="80px"
                                      height="80px"
                                    />)
                                  }
                                </div>
                                <div className="summary_box col">
                                  <h4>
                                    <span>Type</span>
                                    {detail.data_type}
                                  </h4>
                                </div>
                                <div className="summary_box col">
                                  <h4>
                                    <span>Category</span>
                                    {detail.category_name}
                                  </h4>
                                </div>
                                <div className="summary_box col">
                                  <h4>
                                    <span>Content type</span>
                                    {detail.content_type_name}
                                  </h4>
                                </div>
                                <div className="summary_box col">
                                  <h4>
                                    <span>Platform</span>
                                    {detail.platform_name}
                                  </h4>
                                </div>
                                <div className="summary_box col">
                                  <h4>
                                    <span>Date</span>
                                    {detail.created_at.split("T")[0]}
                                  </h4>
                                </div>
                                <div className="summary_box col">
                                  <h4>
                                    <span>Image count</span>
                                    {getBrandCount(detail.data_name)}
                                  </h4>
                                </div>
                                <div className="summary_box col">
                                  <h4>
                                    <span>Uploaded by</span>
                                    {detail.created_by_name}
                                  </h4>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DataBrandOverview;
