import { createContext, useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const InstaContext = createContext();
let step = 0;
function InstaApiContext({ children }) {
  const [creatorNames, setCreatorNames] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [contextData, setContextData] = useState([]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  useEffect(() => {
    const firstApiRequest = axios.get(
      "http://34.93.221.166:3000/api/get_all_users"
    );
    const secondApiRequest = axios.get(
      `http://34.93.221.166:3000/api/get_single_user_auth_detail/${userID}`
    );

    // Make the first two API requests concurrently
    Promise.all([firstApiRequest, secondApiRequest])
      .then(([firstApiResponse, secondApiResponse]) => {
        // Handle the responses from the first two API requests
        setUsers(firstApiResponse.data.data);
        setContextData(secondApiResponse.data);
        if (
          secondApiResponse.data &&
          secondApiResponse.data[27] &&
          secondApiResponse.data[27].view_value == 1 &&
          secondApiResponse.data[28].view_value == 1 &&
          secondApiResponse.data[29].view_value == 1
        ) {
          step = 3;
        } else if (
          secondApiResponse.data &&
          secondApiResponse.data[27] &&
          secondApiResponse.data[27].view_value == 1
        ) {
          step = 0;
        } else if (
          secondApiResponse.data &&
          secondApiResponse.data[28] &&
          secondApiResponse.data[28].view_value == 1
        ) {
          step = 1;
        } else if (
          secondApiResponse.data &&
          secondApiResponse.data[29] &&
          secondApiResponse.data[29].view_value == 1
        ) {
          step = 2;
        }
        // After the first two requests are completed, make the third API request
        return axios.post("http://34.93.221.166:3000/api/creator_name_count", {
          sortOrder: step,
        });
      })
      .then((thirdApiResponse) => {
        // Handle the response from the third API request
        setCreatorNames(thirdApiResponse.data.data);
        setLoading(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // localStorage.setItem("userlevel", step);
  // console.log(step);
  // localStorage.setItem(keyname, value)
  return (
    <>
      <InstaContext.Provider
        value={{
          users,
          userID,
          isLoading,
          contextData,
          setContextData,
          creatorNames,
          step,
        }}
      >
        {children}
      </InstaContext.Provider>
    </>
  );
}
export default InstaApiContext;
