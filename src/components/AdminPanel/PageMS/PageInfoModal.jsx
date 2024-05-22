import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  setCloseShowPageInfoModal,
  setModalType,
  setOpenShowAddModal,
  setRowData,
} from "../../Store/PageMaster";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import {
  useGetAllPageCategoryQuery,
  useGetAllProfileListQuery,
} from "../../Store/PageBaseURL";
import DeleteButton from "../DeleteButton";
import { FaEdit } from "react-icons/fa";

export default function PageInfoModal() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const open = useSelector((state) => state.pageMaster.showInfoModal);
  const dispatch = useDispatch();
  const modalType = useSelector((state) => state.pageMaster.modalType);

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);

  const handleClose = () => {
    dispatch(setCloseShowPageInfoModal());
  };
  const {
    data: profileList,
    error: profileListError,
    isLoading: ProfileListIsloading,
  } = useGetAllProfileListQuery();

  const {
    data: categoryList,
    error: categoryListError,
    isLoading: categoryListIsloading,
  } = useGetAllPageCategoryQuery();

  const handlRowClick = (row,Type) => {
    dispatch(setModalType(Type));
    dispatch(setOpenShowAddModal());
    dispatch(setRowData(row));
  };

  const getData = () => {};

  const profileTypeColumn = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Profile Type",
      selector: (row) => row.profile_type,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name, // Adjust to match your data model, if necessary
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm"
            onClick={() => handlRowClick(row,"Profile Type Update")}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="deleteProfile"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const categoryColumn = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Page Category Name",
      selector: (row) => row.page_category,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handlRowClick(row,"Category Update")}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton endpoint="deletePage" id={row._id} getData={getData} />
        </>
      ),
    },
  ];

  useEffect(() => {
    if (modalType === "Profile Type Info") {
      setTitle("Profile Type");
      setLoading(ProfileListIsloading);
      setData(profileList?.data);
      setColumns(profileTypeColumn);
    } else if (modalType === "Category Info") {
      setTitle("Category");
      setLoading(categoryListIsloading);
      setData(categoryList?.data);
      setColumns(categoryColumn);
    }
  }, [modalType]);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        fullWidth={true}
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DataTable
            title="Profile Overview"
            columns={columns}
            data={data}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search Here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Disagree
          </Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
