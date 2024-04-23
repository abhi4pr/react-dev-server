import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";

const PurchaseDashboard = () => {
  const [pendingReqData, setPendingReqData] = useState([]);
  const [filterPendingReqData, setFilterPendingReqData] = useState([]);
  const [paymentDoneData, setPaymentDoneData] = useState([]);
  const [filterPaymentDoneData, setFilterPaymentDoneData] = useState([]);
  const [gstData, setGSTData] = useState([]);
  const [filterGstData, setFilterGSTData] = useState([]);
  const [tdsData, setTDSData] = useState([]);
  const [filterTdsData, setFilterTDSData] = useState([]);
  const [discardData, setDiscardData] = useState([]);
  const [filterDiscardData, setFilterDiscardData] = useState([]);

  const callApi = () => {
    //PENDING PAYMENT REQUEST API
    let remindData = "";
    axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
      )
      .then((res) => {
        remindData = res.data.body;
      });

    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const pendingPmt = res.data.modifiedData;
      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = res.data.body.filter((item) => {
            return !pendingPmt.some(
              (item2) => item.request_id === item2.request_id
            );
          });

          let c = res.data.body.filter((item) => {
            return remindData.some(
              (item2) => item.request_id === item2.request_id
            );
          });

          y.push(...c); // Merging the filtered items with items matching certain conditions

          let mergedArray = [...y, ...c];

          // Creating a set of unique request_ids from the merged data
          let t = new Set(mergedArray.map((item) => item.request_id));
          mergedArray = Array.from(t).map((request_id) => {
            return mergedArray.find((item) => item.request_id === request_id);
          });

          mergedArray = mergedArray.filter(
            (item) => item.status == 0 || item.status == 3 || item.status == 2
          );
          setPendingReqData(mergedArray);
          setFilterPendingReqData(mergedArray);
        });
    });

    axios.get(`${baseUrl}` + `get_all_payment_mode`).then((res) => {
      //   setPaymentModeData(res.data);
    });

    // axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
    //   setUserName(res.data.user_name);
    // });

    //PAYMENT DONE API :-
    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const pmtDone = res.data.modifiedData;
      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = pmtDone.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some((item2) => item.request_id == item2.request_id);
          });
          setPaymentDoneData(u);
          setFilterPaymentDoneData(u);
        });
    });

    axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
      )
      .then((res) => {});

    // axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {});

    // GST HOLD API  :-

    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const gstHold = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = gstHold.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some(
              (item2) =>
                item.request_id == item2.request_id &&
                item2.gst_Hold_Bool == true
            );
          });
          setGSTData(u);
          setFilterGSTData(u);
        });
    });
    // TDS DEDUCTED API  :-

    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const tdsDeduct = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = tdsDeduct.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some(
              (item2) =>
                item.request_id == item2.request_id &&
                item2.tds_Deduction_Bool == true
            );
          });
          setTDSData(u);
          setFilterTDSData(u);
        });
    });

    // DISCARD API  :-
    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const discard = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = discard.filter((item) => {
            if (item.status == 2) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some((item2) => item.request_id == item2.request_id);
          });
          setDiscardData(u);
          setFilterDiscardData(u);
        });
    });

    axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
      )
      .then((res) => {});

    // axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {});
  };

  useEffect(() => {
    callApi();
  }, []);

  //   console.log(
  //     pendingReqData
  //       //   .map((item) => item?.request_amount)
  //       .reduce((total, item) => total + parseFloat(item.request_amount), 0),
  //     //   .toLocaleString("en-IN"),
  //     "PENDING DATA  "
  //   );
  return (
    <div>
      <div className="pack flex-row" style={{ gap: "16px" }}>
        <div className="fin-card w-50">
          <div
            className="pack flex-row w-100"
            style={{ gap: "32px", padding: "20px" }}
          >
            <div className="fd-circle">
              {/* <img src={giftwo} alt="gif" /> */}
            </div>
            <div className="pack d-flex flex-column" style={{ gap: "15px" }}>
              <h4>Pending Payment Request</h4>
              <div className="scroll-con">
                <div className="scroller">
                  <h1>0</h1>
                  {pendingReqData?.map((item, index) => (
                    <h1>{index + 1}</h1>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="pack d-flex flex-column w-100"
            style={{ gap: "10px", padding: "20px" }}
          >
            <div className="pack sb">
              <h6>Requested Amount</h6>{" "}
              <h6>
                {" "}
                {pendingReqData?.reduce(
                  (total, item) => total + parseFloat(item.request_amount),
                  0
                )}
              </h6>
            </div>
            <div className="pack sb">
              <h6>Balance Amount</h6>
              <h6>
                {" "}
                {pendingReqData?.reduce(
                  (total, item) => total + parseFloat(item.balance_amount),
                  0
                )}
              </h6>
            </div>
            <div className="pack sb">
              <h6>Base Amount</h6>
              <h6>
                {pendingReqData?.reduce(
                  (total, item) => total + parseFloat(item.base_amount),
                  0
                )}
              </h6>
            </div>
            <div className="pack sb">
              <h6>Paid Amount</h6>
              <h6>
                {" "}
                {pendingReqData?.reduce(
                  (total, item) => total + parseFloat(item.paid_amount),
                  0
                )}
              </h6>
            </div>
            <div className="pack sb">
              <h6>GST Amount</h6>
              <h6>
                {" "}
                {pendingReqData?.reduce(
                  (total, item) => total + parseFloat(item.gst_amount),
                  0
                )}
              </h6>
            </div>
            <div className="pack sb">
              <h6>Outstanding</h6>
              <h6>
                {" "}
                {pendingReqData?.reduce(
                  (total, item) => total + parseFloat(item.outstandings),
                  0
                )}
              </h6>
            </div>
          </div>
        </div>
      </div>
      <div className="pack flex-row" style={{ gap: "16px" }}>
        <div className="fin-card w-50">
          <div
            className="pack flex-row w-100"
            style={{ gap: "32px", padding: "20px" }}
          >
            <div className="fd-circle">
              {/* <img src={giftwo} alt="gif" /> */}
            </div>
            <div className="pack d-flex flex-column" style={{ gap: "15px" }}>
              <h4> Payment Done</h4>
              <div className="scroll-con">
                <div className="scroller">
                  <h1>0</h1>
                  {paymentDoneData?.map((item, index) => (
                    <h1>{index + 1}</h1>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="pack d-flex flex-column w-100"
            style={{ gap: "10px", padding: "20px" }}
          >
            <div className="pack sb">
              <h6>Requested Amount</h6>{" "}
              <h6>
                {" "}
                {paymentDoneData?.reduce(
                  (total, item) => total + parseFloat(item.request_amount),
                  0
                )}
              </h6>
            </div>
            <div className="pack sb">
              <h6>Base Amount</h6>
              <h6>
                {" "}
                {paymentDoneData?.reduce(
                  (total, item) => total + parseFloat(item.base_amount),
                  0
                )}
              </h6>
            </div>
            <div className="pack sb">
              <h6>GST Amount</h6>
              <h6>
                {paymentDoneData?.reduce(
                  (total, item) => total + parseFloat(item.gst_amount),
                  0
                )}
              </h6>
            </div>
            <div className="pack sb">
              <h6>Outstanding</h6>
              <h6>
                {" "}
                {pendingReqData?.reduce(
                  (total, item) => total + parseFloat(item.outstandings),
                  0
                )}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDashboard;
