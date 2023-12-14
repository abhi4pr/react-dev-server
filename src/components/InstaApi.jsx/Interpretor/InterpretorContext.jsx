import { createContext, useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useParams } from "react-router-dom";

export const InstaInterpretorContext = createContext();
let step = 0;
function InterpretorContext({ children }) {
  const { creatorName } = useParams();
  const [brands, setBrands] = useState([]);
  const [allcampaign, setAllCampaign] = useState([]);
  const [pagedetail, setPagedetail] = useState([]);
  const [pagecategory, setPageCategory] = useState([]);
  const [brandSubCategory, setBrandSubCategory] = useState([]);
  const [brandsobj, setBrandsobj] = useState([]);
  const [agency, setAgency] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [reloadcampaign, setReloadcampaign] = useState(false);
  const [reloadbrands, setReloadbrands] = useState(false);

  useEffect(() => {
    const firstApiRequest = axios.post(
      "http://34.93.221.166:3000/api/getprojectx",
      {
        page_name: creatorName,
      }
    );

    const secondApiRequest = axios.get(
      "http://34.93.221.166:3000/api/insta_brand"
    );

    Promise.all([firstApiRequest, secondApiRequest])
      .then(([firstApiResponse, secondApiResponse]) => {
        const ftrarr = [];
        // for (let i = 0; i < secondApiResponse.data.data.length; i++) {
        //   ftrarr.push(secondApiResponse.data.data[i].brand_name);
        // }

        setBrands(ftrarr);
        setBrandsobj(secondApiResponse.data.data);
        setPagedetail(firstApiResponse.data.data);
        // console.log(firstApiResponse.data.data, "getprojectx");
        // console.log(secondApiResponse.data.data, "brands");
        setLoading(true);
        return axios.get(
          `http://34.93.221.166:3000/api/projectxpagecategory/${firstApiResponse.data.data.page_category_id}`
        );
      })
      .then((thirdApiResponse) => {
        setPageCategory(thirdApiResponse.data.data);
        // console.log(thirdApiResponse.data.data, "projectxpagecategory");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [reloadbrands]);
  useEffect(() => {
    axios.get("http://34.93.221.166:3000/api/brandSubCategory").then((res) => {
      setBrandSubCategory(res.data.data);
      // console.log(res.data.data, "projectxSubCategory");
    });
    axios.get("http://34.93.221.166:3000/api/agency").then((res) => {
      setAgency(res.data.data);
      // console.log(res.data.data);
    });
  }, []);
  useEffect(() => {
    axios.get("http://34.93.221.166:3000/api/campaign").then((res) => {
      setAllCampaign(res.data.data);
    });
  }, [reloadcampaign]);

  // const set = new Set();
  // let bradcat = [],
  //   count = 0;
  // for (let i = 0; i < brandsobj.length; i++) {
  //   if (set.has(brandsobj[i].brand_id)) {
  //   } else {
  //     set.add(brandsobj[i].brand_id);
  //     bradcat.push(brandsobj[i].brand_id);
  //     count++;
  //   }
  // }
  // console.log(bradcat);

  return (
    <>
      <InstaInterpretorContext.Provider
        value={{
          brands,
          brandsobj,
          pagedetail,
          pagecategory,
          isLoading,
          allcampaign,
          brandSubCategory,
          agency,
          setReloadcampaign,
          reloadcampaign,
          reloadbrands,
          setReloadbrands,
        }}
      >
        {children}
      </InstaInterpretorContext.Provider>
    </>
  );
}
export default InterpretorContext;
