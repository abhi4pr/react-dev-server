import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import UserNav from "../Pantry/UserPanel/UserNav";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { set } from "date-fns";
import DeleteHistoryConfirmation from "./DeleteHistoryConfirmation";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import OndemandVideoTwoToneIcon from "@mui/icons-material/OndemandVideoTwoTone";
import { baseUrl } from "../../utils/config";

export default function ExeHistory({ pageRow }) {
  const { id } = useParams();
  const [buttonAccess, setButtonAccess] = useState(false);
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [openDeleteHistoryConFirmation, setOpenDeleteHistoryConFirmation] =
    useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const handleClickOpenDeleteHistoryConFirmation = () => {
    setOpenDeleteHistoryConFirmation(true);
  };
  const handleCloseDeleteHistoryConFirmation = () => {
    setOpenDeleteHistoryConFirmation(false);
  };

  const apiCall = () => {
    // console.log(pageRow.pageRow)
    axios
      .get(`${baseUrl}` + `v1/states_history/${id ?? pageRow?.pageRow?._id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        console.log(data, "data");
        if (!data) return;
        setData([data]);
      });
  };

  useEffect(() => {
    apiCall();
    axios.get(baseUrl + "get_all_users").then((res) => {
      setAllUsers(res.data.data);
    });
  }, [id, pageRow]);

  const handleDeleteRowData = (data) => {
    setRowData(data);
    handleClickOpenDeleteHistoryConFirmation();
  };

  // "reach": 2342,
  //       "impression": 23432,
  //       "engagement": 23432,
  //       "story_view": 234,
  //       "story_view_date": "2002-04-23T00:00:00.000Z",
  //       "stats_for": "daily",
  //       "start_date": "2024-05-30T00:00:00.000Z",
  //       "end_date": "2024-05-30T00:00:00.000Z",
  //       "reach_image": "NA",
  //       "impression_image": "NA",
  //       "engagement_image": "NA",
  //       "story_view_image": "NA",
  //       "city1_name": "Raipur ",
  //       "city2_name": "Bhopal",
  //       "city3_name": "Bhopal",
  //       "city4_name": "Indore sfs",
  //       "city5_name": "Korba r",
  //       "percentage_city1_name": 2343,
  //       "percentage_city2_name": 324,
  //       "percentage_city3_name": 234,
  //       "percentage_city4_name": 234,
  //       "percentage_city5_name": 234,
  //       "city_image": "NA",
  //       "male_percent": 23412312,
  //       "female_percent": 23412313,
  //       "Age_13_17_percent": 234,
  //       "Age_upload": "NA",
  //       "Age_18_24_percent": 234,
  //       "Age_25_34_percent": 423,
  //       "Age_35_44_percent": 234,
  //       "Age_45_54_percent": 234,
  //       "Age_55_64_percent": 234,
  //       "Age_65_plus_percent": 34,
  //       "profile_visit": 32432,
  //       "country1_name": "American Samoa",
  //       "country2_name": "Albania",
  //       "country3_name": "Albania",
  //       "country4_name": "American Samoa",
  //       "country5_name": "Albania",
  //       "percentage_country1_name": 243,
  //       "percentage_country2_name": 342,
  //       "percentage_country3_name": 342,
  //       "percentage_country4_name": 234,
  //       "percentage_country5_name": 234,
  //       "country_image": "NA",
  //       "created_by": 712,
  //       "last_updated_by": 0,
  //       "status": 0,
  //       "createdAt": "2024-05-30T13:56:46.370Z",
  //       "updatedAt": "2024-05-30T14:11:04.159Z",
  //       "__v": 0

  const columns = [
    {
      field: "S.No",
      headerName: "S.No",
      renderCell: (params) => {
        const rowIndex = data.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "createdAt",
      headerName: "Creation Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.createdAt ? (
              <>
                {new Date(params.row.createdAt).toISOString().substr(8, 2)}/
                {new Date(params.row.createdAt).toISOString().substr(5, 2)}/
                {new Date(params.row.createdAt).toISOString().substr(2, 2)}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    // {
    //   field: "executive_name",
    //   headerName: "Executive Name",
    //   width: 200,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         {params.row?.user_id ? (
    //           <>
    //             {
    //               allUsers.filter((e) => e.user_id == params.row.user_id)[0]
    //                 ?.user_name
    //             }
    //           </>
    //         ) : (
    //           "NA"
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "reach",
      headerName: "Reach",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.reach ? (
              <>
                {params.row.reach} &nbsp;
                {params.row.reach_image && (
                  <a
                    key="reach"
                    href={params.row.reach_upload_image_url}
                    title="Reach Impression Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "impression",
      headerName: "Impression",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.impression ? (
              <>
                {params.row.impression} {params.row.percentage_impression}
                &nbsp;
                {params.row.impression_upload_image_url && (
                  <a
                    key="reach"
                    href={params.row.impression_upload_image_url}
                    title="Reach Impression Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "engagement",
      headerName: "Engagement",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.engagement ? (
              <>
                {params.row.engagement} {params.row.percentage_engagement}
                &nbsp;
                {params.row.engagement_upload_image_url && (
                  <a
                    key="engagement"
                    href={params.row.engagement_upload_image_url}
                    title="Engagement Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "story_view",
      headerName: "Story View",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.story_view ? (
              <>
                {params.row.story_view} {params.row.percentage_story_view}
                &nbsp;
                {params.row.story_view_upload_image_url && (
                  <a
                    key="storyImg"
                    href={params.row.story_view_upload_image_url}
                    title="Story View Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
                {params.row.story_view_upload_video_url && (
                  <a
                    key="storyVdo"
                    href={params.row.story_view_upload_video_url}
                    title="Story view Video"
                    download
                  >
                    <OndemandVideoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    // {
    //   field: "stats_for",
    //   headerName: "Stats For",
    //   width: 150,
    // },
    // {
    //   field: "quater",
    //   headerName: "Quater",
    //   width: 150,
    // },
    {
      field: "city1_name",
      headerName: "City 1",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city1_name ? (
              <>
                {params.row.city1_name} &nbsp;{" "}
                {params.row.percentage_city1_name}
                {params.row.city_image_upload_url && (
                  <a
                    key="cityImg"
                    href={params.row.city_image_upload_url}
                    title="City Image"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "city2_name",
      headerName: "City 2",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city2_name ? (
              <>
                {params.row.city2_name} &nbsp;{" "}
                {params.row.percentage_city2_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "city3_name",
      headerName: "City 3",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city3_name ? (
              <>
                {params.row.city3_name} &nbsp;{" "}
                {params.row.percentage_city3_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "city4_name",
      headerName: "City 4",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city4_name ? (
              <>
                {params.row.city4_name} &nbsp;{" "}
                {params.row.percentage_city4_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "city5_name",
      headerName: "City 5",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.city5_name ? (
              <>
                {params.row.city5_name} &nbsp;{" "}
                {params.row.percentage_city5_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "country1_name",
      headerName: "Country 1",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.country1_name ? (
              <>
                {params.row.country1_name} &nbsp;{" "}
                {params.row.percentage_country1_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "country2_name",
      headerName: "Country 2",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.country2_name ? (
              <>
                {params.row.country2_name} &nbsp;{" "}
                {params.row.percentage_country2_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "country3_name",
      headerName: "Country 3",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.country3_name ? (
              <>
                {params.row.country3_name} &nbsp;{" "}
                {params.row.percentage_country3_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "country4_name",
      headerName: "Country 4",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.country4_name ? (
              <>
                {params.row.country4_name} &nbsp;{" "}
                {params.row.percentage_country4_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "country5_name",
      headerName: "Country 5",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.country5_name ? (
              <>
                {params.row.country5_name} &nbsp;{" "}
                {params.row.percentage_country5_name}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "male_percent",
      headerName: "Male %",
      width: 150,
    },
    {
      field: "female_percent",
      headerName: "Female %",
      width: 150,
    },
    {
      field: "Age_13_17_percent",
      headerName: "Age 13-17 %",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.Age_13_17_percent ? (
              <>
                {params.row.Age_13_17_percent} &nbsp;{" "}
                {params.row.Age_upload_url && (
                  <a
                    key="cityVdo"
                    href={params.row.Age_upload_url}
                    title="Age Img"
                    download
                  >
                    <InsertPhotoTwoToneIcon
                      variant="contained"
                      color="primary"
                    />
                  </a>
                )}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "Age_18_24_percent",
      headerName: "Age 18-24 %",
      width: 150,
    },
    {
      field: "Age_25_34_percent",
      headerName: "Age 25-34 %",
    },
    {
      field: "Age_35_44_percent",
      headerName: "Age 35-44 %",
    },
    {
      field: "Age_45_54_percent",
      headerName: "Age 45-54 %",
    },
    {
      field: "Age_55_64_percent",
      headerName: "Age 55-64 %",
    },
    {
      field: "Age_65_plus_percent",
      headerName: "Age 65+ %",
    },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.start_date ? (
              <>
                {new Date(params.row.start_date).toISOString().substr(8, 2)}/
                {new Date(params.row.start_date).toISOString().substr(5, 2)}/
                {new Date(params.row.start_date).toISOString().substr(2, 2)}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    // {
    //   field: "story_view_date",
    //   headerName: "Story View Date",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         {params.row?.story_view_date ? (
    //           <>
    //             {new Date(params.row.story_view_date)
    //               .toISOString()
    //               .substr(8, 2)}
    //             /
    //             {new Date(params.row.story_view_date)
    //               .toISOString()
    //               .substr(5, 2)}
    //             /
    //             {new Date(params.row.story_view_date)
    //               .toISOString()
    //               .substr(2, 2)}
    //           </>
    //         ) : (
    //           "NA"
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "end_date",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => {
        const data = params.row.end_date;
        if (isNaN(Date.parse(data))) {
          console.error("Invalid date:", data);
          return null;
        }
        return (
          <div>
            {data ? (
              <>
                {new Date(data).toISOString().substr(8, 2)}/
                {new Date(data).toISOString().substr(5, 2)}/
                {new Date(data).toISOString().substr(2, 2)}
              </>
            ) : (
              "NA"
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => handleDeleteRowData(params.row)}
            variant="contained"
            color="primary"
          >
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <>
      {id ? (
        <FormContainer
          mainTitle={"Stats History"}
          link="/ip-master"
          buttonAccess={buttonAccess}
        />
      ) : (
        ""
      )}
      <div className={id?"card body-padding fx-head nt-head":""}>
        {data[0]?._id ? (
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            getRowId={(row) => row._id}
          />
        ) : (
          <h3 className="text-center">No Data Found</h3>
        )}
      </div>

      <DeleteHistoryConfirmation
        handleCloseDeleteHistoryConFirmation={
          handleCloseDeleteHistoryConFirmation
        }
        openDeleteHistoryConFirmation={openDeleteHistoryConFirmation}
        rowData={rowData}
        apiCall={apiCall}
      />
    </>
  );
}
