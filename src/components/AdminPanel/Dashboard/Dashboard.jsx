import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCategory } from "react-icons/md";
import { BsFillSimFill } from "react-icons/bs";
import { TbBrandDenodo } from "react-icons/tb";
import { FaProductHunt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'

function Dashboard() {
  const [renderCount, setRenderCount] = useState(0);
  const [allsimData, getAllSimData] = useState([]);
  const [logoBrandData, getLogoBrandData] = useState([]);
  const [IntellectualProperty, getIntellectualProperty] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [loginUserData, setLoginUserData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [accountsPendingPaymentsCount, setAccountsPendingPaymentsCount] =
    useState([]);

  const navigate = useNavigate();

  function handleSim() {
    navigate("/sim-overview");
  }
  function handleBrand() {
    navigate("/brand-overview");
  }
  function handleDataBrand() {
    navigate("/data-brand-overview");
  }
  function handleIP() {
    navigate("/ip-overview");
  }

  const conditionToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(conditionToken);
  const userId = decodedToken.id;

  useEffect(() => {
    if (userId && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userId}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
    if (userId) {
      axios
        .get(`${baseUrl}`+`get_single_user/${userId}`)
        .then((res) => {
          setLoginUserData(res.data);
        });
    }
  }, []);

  useEffect(() => {
    setRenderCount(renderCount + 1);
    axios.get(baseUrl+"get_all_sims").then((res) => {
      getAllSimData(res.data.data);
    });
    axios.get(baseUrl+"get_logo_data").then((res) => {
      getLogoBrandData(res.data);
    });
    axios.get(baseUrl+"total_count_data").then((res) => {
      setAllData(res.data.distinctDataNamesCount);
    });
    axios
      .get(baseUrl+"get_all_instapages")
      .then((res) => {
        getIntellectualProperty(res.data);
      });
    axios.get(baseUrl+"get_finances").then((res) => {
      const response = res?.data;
      setAccountsPendingPaymentsCount(
        response?.filter((item) => item?.status_ == 0)
      );
    });
  }, []);

  const AllSimData = allsimData.length;
  const AllLogoBrandData = logoBrandData.length;
  const AllIntellectualProperty = IntellectualProperty.length;
  const AllData = allData;
  return (
    <>
      <div>
        <div className="form-heading">
          <div className="form_heading_title">
            <h2>Dashboard</h2>
          </div>
          {/* <Link to={`/admin/kra/${userId}`}>
            <button type="button" className="btn btn-outline-primary btn-sm">
              KRA
            </button>
          </Link> */}
        </div>
        <div className="row">
          {contextData && contextData[8] && contextData[8].view_value === 1 && (
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div className="d_infocard card shadow">
                <Link to="/pantry-user">
                  <div className="card-body">
                    <div className="d_infocard_txt">
                      <h3>Pantry</h3>
                      <h2>Order</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <MdOutlineCategory />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
          {contextData && contextData[9] && contextData[9].view_value === 1 && (
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div className="d_infocard card shadow">
                <Link to="/pantry-delivery">
                  <div className="card-body">
                    <div className="d_infocard_txt">
                      <h3>Pantry</h3>
                      <h2>Delivery</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <MdOutlineCategory />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
          {contextData &&
            contextData[15] &&
            contextData[15].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
                <div className="d_infocard card shadow">
                  <Link to="/admin/pantry-home">
                    <div className="card-body">
                      <div className="d_infocard_txt">
                        <h3>Pantry</h3>
                        <h2>Manager</h2>
                      </div>
                      <div className="d_infocard_icon">
                        <span>
                          <MdOutlineCategory />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          {/* {contextData &&
            contextData[11] &&
            contextData[11].view_value === 1 && (
              <>
                <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
                  <div className="d_infocard card shadow">
                    <div className="card-body" onClick={handleSim}>
                      <div className="d_infocard_txt">
                        <h3>Assets</h3>
                        <h2>{AllSimData}</h2>
                      </div>
                      <div className="d_infocard_icon">
                        <span>
                          <BsFillSimFill />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )} */}

          {/* {contextData &&
            contextData[40] &&
            contextData[40].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
                <Link className="collapse-item" to="/admin/asset-single-user">
                  <div className="d_infocard card shadow">
                    <div className="card-body">
                      <div className="d_infocard_txt">
                        <h2>Asset Single User</h2>
                      </div>
                      <div className="d_infocard_icon">
                        <span>
                          <FaProductHunt />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )} */}
          {contextData &&
            contextData[12] &&
            contextData[12].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
                <div className="d_infocard card shadow">
                  <div className="card-body" onClick={handleBrand}>
                    <div className="d_infocard_txt">
                      <h3>Logo Brand</h3>
                      <h2>{AllLogoBrandData}</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <TbBrandDenodo />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {contextData &&
            contextData[39] &&
            contextData[39].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
                <div className="d_infocard card shadow">
                  <div className="card-body" onClick={handleDataBrand}>
                    <div className="d_infocard_txt">
                      <h3>Data</h3>
                      <h2>{AllData}</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <TbBrandDenodo />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {contextData &&
            contextData[13] &&
            contextData[13].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
                <div className="d_infocard card shadow">
                  <div className="card-body" onClick={handleIP}>
                    <div className="d_infocard_txt">
                      <h3>InstaGram Page</h3>
                      <h2>{AllIntellectualProperty}</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <FaProductHunt />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {/* {contextData &&
            contextData[17] &&
            contextData[17].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
                <Link className="collapse-item" to="/admin/wfh-single-user">
                  <div className="d_infocard card shadow">
                    <div className="card-body">
                      <div className="d_infocard_txt">
                        <h2>WFH Single User</h2>
                      </div>
                      <div className="d_infocard_icon">
                        <span>
                          <FaProductHunt />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )} */}

          {loginUserData.department_name == "Accounts" && (
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div className="d_infocard card shadow">
                <div
                  className="card-body"
                  onClick={() => navigate("/admin/accounts-finance-overview")}
                >
                  <div className="d_infocard_txt">
                    <h3>Pending WFH Payments</h3>
                    <h2>{accountsPendingPaymentsCount?.length}</h2>
                  </div>
                  <div className="d_infocard_icon">
                    <span>
                      <FaProductHunt />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loginUserData.department_name == "Accounts" && (
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
              <div className="d_infocard card shadow">
                <div
                  className="card-body"
                  onClick={() => navigate("/admin/accounts-finance-dashboard")}
                >
                  <div className="d_infocard_txt">
                    <h2>Finance Dashboard</h2>
                    {/* <h2>{accountsPendingPaymentsCount?.length}</h2>  */}
                  </div>
                  <div className="d_infocard_icon">
                    <span>
                      <FaProductHunt />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Dashboard;
