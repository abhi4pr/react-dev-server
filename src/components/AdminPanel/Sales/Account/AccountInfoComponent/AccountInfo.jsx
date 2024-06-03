import React from "react";
import logo from "/logo.png";
import {
  AddressBook,
  CashRegister,
  ChartLineUp,
  File,
} from "@phosphor-icons/react";
import SalesDetail from "./SalesDetail";
import PocDetails from "./PocDetails";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleAccountQuery } from "../../../../Store/API/Sales/SalesAccountApi";
import DocumentTypDetails from "./DocumentTypDetails";
import SalesBookingDetails from "./SalesBookingDetails";
const AccountInfo = () => {
  const account = useParams();
  const navigate = useNavigate();
  const {
    data: SingleAccount,
    error: SingleAccountErr,
    isLoading: SingleAccountLoading,
  } = useGetSingleAccountQuery(account?.id);

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="AccountInfo">
      <div className="sales-sidebar">
        <div className="topbarBrand-1">
          <div className="branding">
            <div className="logo-1">
              <img className="logo-img" src={logo} alt="logo" width={40} />
            </div>
            <div className="brandtext">
              Creative <span>fuel</span>
            </div>
            <button className="icon-1 ml-4" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>
        </div>

        <div className="navbar-nav sidebar">
          <div className="links">
            <div className="nav-item nav-item-single">
              <div
                className="nav-btn nav-link"
                onClick={() => handleClickScroll("DetailView")}
              >
                <i className="ph">
                  <CashRegister weight="duotone" />
                </i>
                <span>Details</span>
              </div>
            </div>
            <div className="nav-item nav-item-single">
              <div
                className="nav-btn nav-link"
                onClick={() => handleClickScroll("ContactView")}
              >
                <i className="ph">
                  <AddressBook weight="duotone" />
                </i>

                <span>Contacts(POC)</span>
              </div>
            </div>
            <div className="nav-item nav-item-single">
              <div
                className="nav-btn nav-link"
                onClick={() => handleClickScroll("SalesView")}
              >
                <i className="ph">
                  <ChartLineUp weight="duotone" />
                </i>{" "}
                <span>Sales</span>
              </div>
            </div>
            <div className="nav-item nav-item-single">
              <div
                className="nav-btn nav-link"
                onClick={() => handleClickScroll("DocumentsView")}
              >
                <i className="ph">
                  <File weight="duotone" />
                </i>

                <span>Documents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sales-accountinfo-view">
        <section id="DetailView">
          <SalesDetail
            SingleAccount={SingleAccount}
            SingleAccountLoading={SingleAccountLoading}
          />
        </section>
        <section id="ContactView">
          <PocDetails
            SingleAccount={SingleAccount}
            SingleAccountLoading={SingleAccountLoading}
          />
        </section>
        <section id="SalesView">
          <SalesBookingDetails />
        </section>
        <section id="DocumentsView">
          <DocumentTypDetails
            SingleAccount={SingleAccount}
            SingleAccountLoading={SingleAccountLoading}
          />
        </section>
      </div>
    </div>
  );
};

export default AccountInfo;
