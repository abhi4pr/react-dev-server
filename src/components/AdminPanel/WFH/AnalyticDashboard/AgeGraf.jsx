import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { baseUrl } from "../../../../utils/config";

function AgeGraf() {
  const [graphData, setGraphData] = useState([]);
  const [viewOption, setViewOption] = useState("male");
  const [state, setState] = useState({
    series: [
      {
        name: "Count",
        data: [],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      colors: ['#C9DF7F'],
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
          dataLabels: {
            total: {
              enabled: false,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          },
            columnWidth: '60px'
        },
    },
    dataLabels: {
        enabled: false  // Disable all data labels
      },
    xaxis: {
        type: "category",
        categories: [],
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    },
  });

useEffect(() => {
    axios
      .post(baseUrl + "get_user_graph_data_of_wfhd", {
        caseType: "age",
      })
      .then((res) => {
        setGraphData(res.data);
      });
  }, []);


  const createSeriesData = (data) => {
    const categories = [];
    const seriesData = [];

    data.forEach(item => {
      const range = item.age;
      const count = item.userCount;
      categories.push(range);
      seriesData.push(count);
    });

    const apexobj = {
      series: [
        {
          name: "Count",
          data: seriesData,
        },
      ],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'last',
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        xaxis: {
          type: "category",
          categories: categories,
        },
        legend: {
          position: 'right',
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      },
    };
    return apexobj;
  };

  useEffect(() => {
    if (graphData.length > 0) {
      const apexobject = createSeriesData(graphData);
      setState(apexobject);
    }
  }, [graphData]);

  return (
    <div className="row">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="card">
          <div className="card-body pb0">
            {state && graphData.length > 0 && (
              <div className="allSelChart thmChart">
                <ReactApexChart
                  options={state.options}
                  series={state.series}
                  type="bar"
                  height={300}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgeGraf;
