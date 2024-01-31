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

export default function ExeHistory() {
  const id = useParams();
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
    axios
      .get(`${baseUrl}`+`get_exe_ip_count_history/${id.id}`)
      .then((res) => {
        const data = res.data.data.filter((e) => {
          return e.isDeleted !== true;
        });
        setData(data);
      });
  };

  useEffect(() => {
    apiCall();
    axios.get(baseUrl+"get_all_users").then((res) => {
      setAllUsers(res.data.data);
    });
  }, []);

  const handleDeleteRowData = (data) => {
    setRowData(data);
    handleClickOpenDeleteHistoryConFirmation();
  };

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
      field: "creation_date",
      headerName: "Creation Date",
      readerCell: (params) => {
        return (
          <div>
            {params.row?.creation_date ? (
              <>
                {new Date(params.row.creation_date).toISOString().substr(8, 2)}/
                {new Date(params.row.creation_date).toISOString().substr(5, 2)}/
                {new Date(params.row.creation_date).toISOString().substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "executive_name",
      headerName: "Executive Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.user_id ? (
              <>
                {
                  allUsers.filter((e) => e.user_id == params.row.user_id)[0]
                    ?.user_name
                }
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "reach",
      headerName: "Reach",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.reach ? (
              <>
                {params.row.reach} {params.row.percentage_reach}&nbsp;
                {params.row.reach_upload_image_url && (
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
              ""
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
              ""
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
              ""
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
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "stats_for",
      headerName: "Stats For",
      width: 150,
    },
    {
      field: "quater",
      headerName: "Quater",
      width: 150,
    },
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
              ""
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
              ""
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
              ""
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
              ""
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
              ""
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
              ""
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
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "story_view_date",
      headerName: "Story View Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.story_view_date ? (
              <>
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.story_view_date)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row.end_date ? (
              <>
                {new Date(params.row.end_date).toISOString().substr(8, 2)}/
                {new Date(params.row.end_date).toISOString().substr(5, 2)}/
                {new Date(params.row.end_date).toISOString().substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "creation_date",
      headerName: "Creation Date",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {new Date(params.row.creation_date).toISOString().substr(8, 2)}/
            {new Date(params.row.creation_date).toISOString().substr(5, 2)}/
            {new Date(params.row.creation_date).toISOString().substr(2, 2)}
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
      {" "}
      <div style={{ width: "100%", margin: "0 0 0 0%" }}>
        <UserNav />
        <FormContainer
          mainTitle="Stats History"
          link="/ip-master"
          buttonAccess={buttonAccess}
        />
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
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
