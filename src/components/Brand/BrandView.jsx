import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";

const BrandView = () => {
  const { toastAlert } = useGlobalContext();
  const [brand, setBrand] = useState("");
  const [logo, setLogo] = useState("");
  const [image, setImage] = useState("JPG");
  const [size, setSize] = useState("");
  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [logos, setLogos] = useState([]);
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);
  const [category, setCategory] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://34.93.221.166:3000/api/getlogodata/${id}`).then((res) => {
      const fetchedData = res.data;
      const { 
        brand_name,
        upload_logo,
        remark,
        cat_name
      } = fetchedData;
      setBrand(brand_name);
      setLogo(upload_logo);
      setRemark(remark);
      setCategory(cat_name);
      setBrandData(fetchedData);
    });
  }, [id]);

  useEffect(() => {
    axios.get(`http://34.93.221.166:3000/api/logodata/${brand}`).then((res) => {
      setLogos(res.data);
    });
  }, [brand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg ">
          <div className="container">
            <FormContainer
              mainTitle="Brand"
              title="Brand"
              handleSubmit={handleSubmit}
            >
              <FieldContainer
                label="Brand Name"
                type="text"
                value={brand}
                disabled
                onChange={(e) => {
                  setBrand(e.target.value);
                }}
              />

              <div className="row">
                {logos.map((detail)=>(
                  <div className="col-md-3 card" style={{margin:"0 0 10px 0"}}>
                    <img className="card-img-top" src={detail.upload_logo} style={{height:"220px"}} />
                    <div className="card-body">      
                    </div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">Extension - {detail.image_type}</li>
                      <li className="list-group-item">Resolution - {detail.size}</li>
                      <li className="list-group-item">Size - {detail.size_in_mb}</li>
                      <li className="list-group-item">Category - {detail.cat_name}</li>
                    </ul>
                    <div className="card-body">
                      <button type="button" className="btn btn-success">
                        <a href={detail.upload_logo} target="_blank" rel="noopener noreferrer" > {" "} Download{" "} </a>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </FormContainer>
          </div>
        </div>
      </div>
      <div style={{ margin: "0 0 0 10%", width: "80%" }}></div>
    </>
  );
};

export default BrandView;
