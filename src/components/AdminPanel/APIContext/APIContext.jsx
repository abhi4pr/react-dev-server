import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import {baseUrl} from '../../../utils/config'

const ApiContextData = createContext();
const APIContext = ({ children }) => {
  const [userContextData, setUserContextData] = useState([]);
  const [DepartmentContext, setDepartmentContext] = useState([]);
  const [contextData, setContextData] = useState([]);
  const [loading, setLoading] = useState(false);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const ContextDept = decodedToken.dept_id;
  const RoleIDContext = decodedToken.role_id;
  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setContextData(res.data);
        });
    }

    axios.get(baseUrl+"get_all_users").then((res) => {
      setUserContextData(res.data.data);
      setLoading(true);
    });

    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentContext(res.data);
      });
  }, [userID]);

  return (
    <ApiContextData.Provider
      value={{
        userContextData,
        loading,
        DepartmentContext,
        contextData,
        userID,
        ContextDept,
        RoleIDContext,
      }}
    >
      {children}
    </ApiContextData.Provider>
  );
};

const useAPIGlobalContext = () => {
  return useContext(ApiContextData);
};

export { APIContext, ApiContextData, useAPIGlobalContext };
