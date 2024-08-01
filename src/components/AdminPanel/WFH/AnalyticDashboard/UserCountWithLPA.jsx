import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { baseUrl } from "../../../../utils/config";

function UserCountWithLPA() {
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

  const getData = async () => {
    try {
      const res = await axios.get(baseUrl + "get_salary_by_LPA");
      setGraphData(res.data.data);
      console.log(res.data.data, 'lpa');
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const createSeriesData = (data) => {
    const categories = [];
    const seriesData = [];

    data.forEach(item => {
      const range = Object.keys(item)[0];
      const count = Object.values(item)[0];
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
        colors: ['#85D5CA'],
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
                  height={250}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCountWithLPA;
