import { Button, TextField } from "@mui/material";
import { Page } from "@react-pdf/renderer";
import axios from "axios";
import { useState } from "react";
import classes from "./forgetPassword.module.css";
import SendIcon from "@mui/icons-material/Send";
import loginlogo from "../../assets/img/logo/logo_login1.png";
import { Link } from "react-router-dom";
import {baseUrl} from '../../utils/config'

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(email);
    if (email.trim() === "") {
      // alert("Please enter email");
      setErrMessage("Please enter Email !");
      return;
    } else {
      axios
        .post(baseUrl+"forgot_pass", {
          user_email_id: email,
        })
        .then((res) => {
          // console.log(res);
          if (res.data.message === "Successfully Sent email.") {
            // alert("Email sent successfully");
            setErrMessage("Email sent successfully !");
            setEmail("");
          } else {
            // alert(res.data.message);
            setErrMessage("No such email found in database");
          }
        });
    }
  };

  return (
    <>
      {/* <div className={classes.background}>
        <div
          style={{
            display: "grid",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className={classes.form}
          >
            <div
              className={`d-flex flex-column justify-content-center align-items-center  p-5 border-radius-3 ${classes.formCh} `}
            >
              <p style={{ marginBottom: "30px" }}>
                Please fill associated email id to get your password
              </p>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <Button type="submit" className="mt-3">
                <SendIcon variant="contained" />
              </Button>
              <p>{errMessage}</p>
            </div>
          </form>
        </div>
      </div> */}

      <section className="section authwrapper">
        <div className="authbox">
          <div
            className="authtext authbrand_spacing"
            style={{ display: "none" }}
          >
            <h1>Welcome.</h1>
            <p>
              To Creativefuel <br /> A Leading Marketing Agency. <br /> Let's
              onboard you to your next home.
            </p>
          </div>
          <div className="authlogo authbrand_spacing">
            <img src={loginlogo} alt="CreativeFuel" />
          </div>
          <div className="authform_area">
            <div className="authform_head">
              <h2>Forgot Password</h2>
              <p>Please fill associated email id to get your password</p>
            </div>

            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="authform">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="Email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-icon btn_primary" type="submit">
                    <i className="fas fa-arrow-right" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning btn-xs"
                    style={{ float: "right" }}
                  >
                    <Link to={`/login`}>Login</Link>
                  </button>
                </div>
                <div className="form-group errorMessage">
                  <p>{errMessage}</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
