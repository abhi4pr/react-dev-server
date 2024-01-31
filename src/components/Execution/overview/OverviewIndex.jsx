// import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Grid } from "@mui/material";
import { OverviewBudget } from "./overview-budget";
import { OverviewLatestOrders } from "./overview-latest-orders";
import { OverviewLatestProducts } from "./overview-latest-products";
import { OverviewSales } from "./overview-sales";
import { OverviewTasksProgress } from "./overview-tasks-progress";
import { OverviewTotalCustomers } from "./overview-total-customers";
import { OverviewTotalProfit } from "./overview-total-profit";
import { OverviewTraffic } from "./overview-traffic";
import AppWebsiteVisits from "./Overview-website-preview";
import axios from "axios";
import { useEffect, useState } from "react";

const now = new Date();

const OverviewIndex = () => {
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState([]);
  useEffect(() => {
    // const apiBodyData = [
    //   { status: "pending", filterCriteria: "m" },
    //   { status: "complete", filterCriteria: "m" },
    //   { status: "pending", filterCriteria: "w" },
    //   { status: "complete", filterCriteria: "w" },
    //   { status: "pending", filterCriteria: "q" },
    //   { status: "complete", filterCriteria: "q" },
    //   { status: "pending", filterCriteria: "y" },
    //   { status: "complete", filterCriteria: "y" },
    // ];

    const fetchData = async () => {
      const responseArray = [];

      axios
        .get(baseUrl+"get_exe_sum", {
          loggedin_user_id: 52,
        })
        .then((response) => {
          console.log(response.data, "this is resposne");
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      // for (const data of apiBodyData) {
      //   const formData = new URLSearchParams();
      //   formData.append("loggedin_user_id", 36);
      //   formData.append("filter_criteria", data.filterCriteria);
      //   formData.append("pendingorcomplete", data.status);

      //   try {
      //     const response = await axios.post(
      //       "https://sales.creativefuel.io/webservices/RestController.php?view=dashboardData",
      //       formData,
      //       {
      //         headers: {
      //           "Content-Type": "application/x-www-form-urlencoded",
      //         },
      //       }
      //     );

      //     responseArray.push({
      //       [data.filterCriteria + data.status]: response.data.body,
      //     });
      //   } catch (error) {
      //     console.error("Error:", error);
      //   }
      // }

      axios.get(baseUrl+"execution_graph").then((res) => {
        console.log(res.data, "this is response");
        setCounts(res.data);
        console.log(
          res.data.filter(
            (count) =>
              count.interval_type === "Weekly" && count.execution_status === 1
          )[0].count,
          "filter data"
        );
      });

      setCounts(responseArray);
    };
    setTimeout(() => {
      console.log(counts);
    }, 1000);
    fetchData();
  }, []);

  return (
    <>
      {/* <Head>
      <title>Overview | Devias Kit</title>
    </Head> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                complete={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Weekly" &&
                      count.execution_status === 1
                  )[0]?.count !== undefined
                    ? counts.filter(
                        (count) =>
                          count.interval_type === "Weekly" &&
                          count.execution_status === 1
                      )[0].count
                    : 0
                }
                pending={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Weekly" &&
                      count.execution_status === 0
                  )[0]?.count
                    ? counts.filter(
                        (count) =>
                          count.interval_type === "Weekly" &&
                          count.execution_status === 0
                      )[0].count
                    : 0
                }
                sx={{ height: "100%" }}
                value="Weekly Execution"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                complete={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Monthly" &&
                      count.execution_status === 1
                  )[0]?.count
                    ? counts.filter(
                        (count) =>
                          count.interval_type === "Monthly" &&
                          count.execution_status === 1
                      )[0].count
                    : 0
                }
                pending={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Monthly" &&
                      count.execution_status === 0
                  )[0]?.count
                    ? counts.filter(
                        (count) =>
                          count.interval_type === "Monthly" &&
                          count.execution_status === 0
                      )[0].count
                    : 0
                }
                sx={{ height: "100%" }}
                value="Monthly Execution"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                complete={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Quarterly" &&
                      count.execution_status === 1
                  )[0]?.count
                    ? counts.filter(
                        (count) =>
                          count.interval_type === "Quarterly" &&
                          count.execution_status === 1
                      )[0].count
                    : 0
                }
                pending={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Quarterly" &&
                      count.execution_status === 0
                  )[0]?.count
                    ? counts.filter(
                        (count) =>
                          count.interval_type === "Quarterly" &&
                          count.execution_status === 0
                      )[0].count
                    : 0
                }
                sx={{ height: "100%" }}
                value="Quaterly Execution"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget
                difference={12}
                complete={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Yearly" &&
                      count.execution_status === 1
                  )[0]?.count
                    ? counts.filter(
                        (count) =>
                          count.interval_type === "Yearly" &&
                          count.execution_status === 1
                      )[0].count
                    : 0
                }
                pending={
                  counts.filter(
                    (count) =>
                      count.interval_type === "Yearly" &&
                      count.execution_status === 0
                  )[0]?.count
                    ? counts.filter(
                        (count) =>
                          count.interval_type === "Yearly" &&
                          count.execution_status === 0
                      )[0].count
                    : 0
                }
                sx={{ height: "100%" }}
                value="Yearly Execution"
              />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AppWebsiteVisits
                title="Overview"
                // subheader="(+43%) than last year"
                chartLabels={[
                  "01/01/2003",
                  "02/01/2003",
                  "03/01/2003",
                  "04/01/2003",
                  "05/01/2003",
                  "06/01/2003",
                  "07/01/2003",
                  "08/01/2003",
                  "09/01/2003",
                  "10/01/2003",
                  "11/01/2003",
                ]}
                chartData={[
                  {
                    name: "Team A",
                    type: "column",
                    fill: "solid",
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                  {
                    name: "Team B",
                    type: "area",
                    fill: "gradient",
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                  {
                    name: "Team C",
                    type: "line",
                    fill: "solid",
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  },
                ]}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={["Inventory", "Pending", "Complete"]}
                sx={{ height: "100%" }}
              />
            </Grid>

            <Grid xs={12} md={6} lg={4}>
              <OverviewLatestProducts products={data} sx={{ height: "100%" }} />
            </Grid>
            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestOrders products={data} sx={{ height: "100%" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

// Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default OverviewIndex;
