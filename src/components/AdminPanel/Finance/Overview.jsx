import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Overview = (props) => {
  const { data } = props;
  console.log(data, "data >>>");
  // const [filteredData, setFilteredData] = useState([]);

  // const filterData = () => {
  //   switch (selectedRange) {
  //     case "0-10k":
  //       setFilteredData(
  //         pendingReqData?.filter((data) => data?.balance_amount <= 10000)
  //       );
  //       break;
  //     case "10k-50k":
  //       setFilteredData(
  //         pendingReqData?.filter(
  //           (data) =>
  //             data?.balance_amount > 10000 && data?.balance_amount <= 50000
  //         )
  //       );
  //       break;
  //     case "50k-100k":
  //       setFilteredData(
  //         pendingReqData?.filter(
  //           (data) =>
  //             data?.balance_amount > 50000 && data?.balance_amount <= 100000
  //         )
  //       );
  //       break;
  //     case "100k-above":
  //       setFilteredData(
  //         pendingReqData?.filter((data) => data?.balance_amount > 100000)
  //       );
  //       break;
  //     default:
  //       setFilteredData(pendingReqData);
  //   }
  // };

  const calculateTotalAmount = (data) => {
    return data?.reduce(
      (total, item) => total + parseFloat(item.balance_amount),
      0
    );
  };

  return (
    <div>
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>count</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0-10k</td>
                <td>
                  {data?.filter((item) => item.balance_amount <= 10000).length}
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter((item) => item.balance_amount <= 10000)
                  )}
                </td>
              </tr>

              <tr>
                <td>10k-50k</td>
                <td>
                  {
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 10000 &&
                        item.balance_amount <= 50000
                    ).length
                  }
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 10000 &&
                        item.balance_amount <= 50000
                    )
                  )}
                </td>
              </tr>

              <tr>
                <td>50k-100k</td>
                <td>
                  {
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 50000 &&
                        item.balance_amount <= 100000
                    ).length
                  }
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 50000 &&
                        item.balance_amount <= 100000
                    )
                  )}
                </td>
              </tr>

              <tr>
                <td>100k-above</td>
                <td>
                  {data?.filter((item) => item.balance_amount >= 100000).length}
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter((item) => item.balance_amount >= 100000)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
