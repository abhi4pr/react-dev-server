import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import FormContainer from "../../FormContainer";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeCommentTwoToneIcon from "@mui/icons-material/ModeCommentTwoTone";
import { Box, Button, Modal } from "@mui/material";
import {baseUrl} from '../../../../utils/config'

// var desturctureData;
const ExpertiesOverview = () => {
  const [getExpertiesData, setGetExpertiesData] = useState([]);

  // const handleClose = () => setOpen(false);
  const [open2, setOpen2] = React.useState(false);
  const [expertieareadata, setExpertieAreaData] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [followercount, setFollowerCount] = useState([]);
  const handleOpen2 = (params) => {
    setOpen2(true);
    setExpertieAreaData(params.row.area_of_expertise.category);
    setFollowerCount(params.row.area_of_expertise.follower_count);
    setPlatform(params.row.area_of_expertise.platform);
  };

  const handleClose2 = () => setOpen2(false);

  const ExpertiesData = async () => {
    const Experties = await axios.get(
      baseUrl+"expertise"
    );
    const setexdata = Experties.data.data;
    setGetExpertiesData(setexdata);
  };

  useEffect(() => {
    ExpertiesData();
  }, []);
  const style = {
    position: "absolute",
    top: "50%",
    left: "60%",
    borderRadius: "10px",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

  const handleDelete = (userId) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${baseUrl}`+`expertise/${userId}`)
            .then(() => {
              // Check if no error occurred and then show the success alert
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your file has been deleted.",
                "success"
              );
              ExpertiesData();
            })
            .catch(() => {
              showErrorAlert();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)"
          );
        }
      });
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = getExpertiesData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "exp_name",
      headerName: "Expert Name",
      width: 180,
      sortable: true,
    },
    {
      field: "action",
      headerName: "Area Of Expertise",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={() => handleOpen2(params)} variant="text">
              <ModeCommentTwoToneIcon />
            </Button>
          </div>
        );
      },
    },

    {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Link to={`/admin/expeties-update/${params.row.exp_id}`}>
            <EditIcon sx={{ gap: "4px", margin: "5px", color: "blue" }} />
          </Link>

          <DeleteOutlineIcon
            sx={{ gap: "4px", margin: "15px" }}
            color="error"
            onClick={() => handleDelete(params.row.user_id)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <FormContainer
        mainTitle="Expert Overview"
        link="/admin/experties"
        buttonAccess={true}
      />
      <div className="data_tbl" style={{ height: "64vh", width: "100%" }}>
        <DataGrid
          rows={getExpertiesData}
          columns={columns}
          getRowId={(row) => row.exp_id}
        />
      </div>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2>Category</h2>
          {expertieareadata.map((d) => (
            <h4>{d}</h4>
          ))}
          <h2>Follower Count</h2>
          {followercount.map((d) => (
            <h4>{d}</h4>
          ))}
          <h2>Platform</h2>
          {platform.map((d) => (
            <h4>{d}</h4>
          ))}
        </Box>
      </Modal>
    </div>
  );
};

export default ExpertiesOverview;
