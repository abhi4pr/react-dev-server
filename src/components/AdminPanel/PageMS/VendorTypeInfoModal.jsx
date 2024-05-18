import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChangeVendorInfoModal,
  setModalType,
  setShowAddVendorModal,
  setVendorRowData,
} from "../../Store/VendorMaster";
import DataTable from "react-data-table-component";
import {
  useGetAllVendorQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPaymentMethodQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";

export default function VendorTypeInfoModal() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const open = useSelector((state) => state.vendorMaster.showVendorInfoModal);
  const modalType = useSelector((state) => state.vendorMaster.modalType);

  const [search, setSearch] = useState("");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([{}]);
  const [title, setTitle] = useState("");
  const [isLoading, setLoading] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {
    isLoading: vendorIsLoading,
    error: vendorError,
    data: vendorData,
    refetch: vendorRefetch,
  } = useGetAllVendorQuery();

  const {
    data: platformData,
    isLoading: platformIsLoading,
    error: platformError,
    refetch: platformRefetch,
  } = useGetPmsPlatformQuery();

  const {
    data: paymentData,
    isLoading: paymentIsLoading,
    error: paymentError,
    refetch: paymentRefetch,
  } = useGetPmsPaymentMethodQuery();

  const {
    data: payCycle,
    isLoading: payCycleIsLoading,
    error: payCycleError,
    refetch: payCycleRefetch,
  } = useGetPmsPayCycleQuery();

  const handleClose = () => {
    dispatch(handleChangeVendorInfoModal());
  };

  const handlePlatformRowData = (row) => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("UpdatePlatform"));
    dispatch(setVendorRowData(row));
  };

  const handleVendorRowData = (row) => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("UpdateVendor"));
    dispatch(setVendorRowData(row));
  };

  const handlePayentRowData = (row) => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("UpdatePayment"));
    dispatch(setVendorRowData(row));
  };

  const handlePayCycleRowData = (row) => {
    dispatch(setShowAddVendorModal());
    dispatch(setModalType("UpdatePayCycle"));
    dispatch(setVendorRowData(row));
  };

  const getData = () => {
    vendorRefetch();
    handleClose();
  };

  const vendorColumns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Type Name",
      selector: (row) => row.type_name,
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
            onClick={() => handleVendorRowData(row)}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton
            endpoint="deleteVendor"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const platformColumns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Platform Name",
      selector: (row) => row.platform_name,
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
            onClick={() => handlePlatformRowData(row)}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton
            endpoint="deletePlatform"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const paymentColumns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Pay Method",
      selector: (row) => row.payMethod_name,
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
            onClick={() => handlePayentRowData(row)}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton endpoint="deletePay" id={row._id} getData={getData} />
        </>
      ),
    },
  ];

  const payCycleColumns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Pay Cycle",
      selector: (row) => row.cycle_name,
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
            onClick={() => handlePayCycleRowData(row)}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton
            endpoint="deletePayCycle"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    if (modalType == "Vendor") {
      vendorRefetch();
      setColumns(vendorColumns);
      setTitle("Vendor Type Overview");
      setData(vendorData);
      setLoading(vendorIsLoading);
    } else if (modalType == "Platform") {
      platformRefetch();
      setColumns(platformColumns);
      setTitle("Platform Overview");
      setData(platformData);
      setLoading(platformIsLoading);
    } else if (modalType == "PaymentMethod") {
      paymentRefetch();
      setColumns(paymentColumns);
      setTitle("Payment Method Overview");
      setData(paymentData);
      setLoading(paymentIsLoading);
    } else if (modalType == "PayCycle") {
      payCycleRefetch();
      setColumns(payCycleColumns);
      setTitle("Pay Cycle Overview");
      setData(payCycle);
      setLoading(payCycleIsLoading);
    }
  }, [modalType]);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <div className="card">
            <div className="data_tbl table-responsive">
              {!isLoading ? (
                <DataTable
                  title="Vendor type Overview"
                  columns={columns}
                  data={data.data}
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
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="error" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}