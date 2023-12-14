import { createContext, useEffect, useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";
import axios from "axios";

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const toastAlert = (text) => {
    toast.success(text);
    setShowAlert(true);
    setAlertText(text);
  };
  const toastError = (text) => {
    toast.error(text);
    setShowAlert(true);
    setAlertText(text);
  };

  const storedToken = sessionStorage.getItem("token");
  useEffect(() => {
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      const userID = decodedToken.id;
      setToken(decodedToken);
      axios
        .get(
          `http://34.93.221.166:3000/api/get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setData(res.data);
        });
    }
  }, [storedToken]);

  return (
    <AppContext.Provider value={{ toastAlert, data, token, toastError }}>
      {children}
      {showAlert && (
        <>
          <ToastContainer autoClose={1500} />

          {/* {alertText} */}
        </>
      )}
    </AppContext.Provider>
  );
};
// Global Custom Hooks
const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider, useGlobalContext };
