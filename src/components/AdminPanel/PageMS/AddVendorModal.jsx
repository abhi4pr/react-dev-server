import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  setCloseAddVendorModal,
  setVendorRowData,
} from "../../Store/VendorMaster";
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useAddPmsPayCycleMutation,
  useAddPmsPaymentMethodMutation,
  useAddPmsPlatformMutation,
  useAddPmsVendorTypeMutation,
  useUpdatePmsPayCycleMutation,
  useUpdatePmsPaymentMethodMutation,
  useUpdatePmsPlatformMutation,
  useUpdateVendorTypeMutation,
} from "../../Store/reduxBaseURL";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { useEffect, useState } from "react";

export default function AddVendorModal() {
  const { toastAlert, toastError } = useGlobalContext();
  const dispatch = useDispatch();
  const [vendorPost] = useAddPmsVendorTypeMutation();
  const [vendorUpdate] = useUpdateVendorTypeMutation();
  const [platformPost] = useAddPmsPlatformMutation();
  const [updatePlatform] = useUpdatePmsPlatformMutation();
  const [payMethodPost] = useAddPmsPaymentMethodMutation();
  const [updatePayMethod] = useUpdatePmsPaymentMethodMutation();
  const [addPayCycle] = useAddPmsPayCycleMutation();
  const [updatePayCycle] = useUpdatePmsPayCycleMutation();
  const open = useSelector((state) => state.vendorMaster.showAddVendorModal);
  const venodrRowData = useSelector(
    (state) => state.vendorMaster.vendorRowData
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const modalType = useSelector((state) => state.vendorMaster.modalType);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (venodrRowData?.type_name) {
      setValue("typeName", venodrRowData.type_name);
      setValue("description", venodrRowData.description);
    } else if (venodrRowData?.platform_name) {
      setValue("typeName", venodrRowData.platform_name);
      setValue("description", venodrRowData.description);
    } else if (venodrRowData?.payMethod_name) {
      setValue("typeName", venodrRowData.payMethod_name);
      setValue("description", venodrRowData.description);
    } else if (venodrRowData?.cycle_name) {
      setValue("typeName", venodrRowData.cycle_name);
      setValue("description", venodrRowData.description);
    }
  }, [venodrRowData]);

  const handleClose = () => {
    dispatch(setCloseAddVendorModal());
    setValue("typeName", null);
    setValue("description", null);
  };

  const formSubmit = async (data) => {
    const obj = {
      type_name: data.typeName,
      description: data.description,
      created_by: userID,
    };
    if (modalType == "UpdateVendor") {
      if (venodrRowData) {
        obj._id = venodrRowData._id;
        obj.updated_by = userID;
        vendorUpdate(obj)
          .unwrap()
          .then(() => {
            toastAlert("Vendor Type Updated");
            dispatch(setVendorRowData(null));
            setValue("typeName", null);
            setValue("description", null);
            handleClose();
          })
          .catch((err) => {
            toastError(err.message);
          });
        return;
      }
    } else if (modalType == "Vendor") {
      vendorPost(obj)
        .unwrap()
        .then(() => {
          toastAlert("Vendor Type Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
      return;
    } else if (modalType == "Platform") {
      delete obj.type_name;

      obj.platform_name = data.typeName;
      obj.description = data.description;

      platformPost(obj)
        .unwrap()
        .then(() => {
          toastAlert("Platform Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "UpdatePlatform") {
      delete obj.type_name;
      obj._id = venodrRowData._id;
      obj.platform_name = data.typeName;
      updatePlatform(obj)
        .unwrap()
        .then(() => {
          toastAlert("Platform Updated");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "PaymentMethod") {
      delete obj.type_name;
      obj.payMethod_name = data.typeName;
      obj.description = data.description;
      payMethodPost(obj)
        .unwrap()
        .then(() => {
          toastAlert("Payment Method Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "UpdatePayment") {
      delete obj.type_name;
      obj._id = venodrRowData._id;
      obj.payMethod_name = data.typeName;
      updatePayMethod(obj)
        .unwrap()
        .then(() => {
          toastAlert("Payment Method Updated");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "PayCycle") {
      delete obj.type_name;
      obj.cycle_name = data.typeName;
      obj.description = data.description;
      addPayCycle(obj)
        .unwrap()
        .then(() => {
          toastAlert("Payment Cycle Added");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType == "UpdatePayCycle") {
      delete obj.type_name;
      obj._id = venodrRowData._id;
      obj.cycle_name = data.typeName;
      updatePayCycle(obj)
        .unwrap()
        .then(() => {
          toastAlert("Payment Cycle Updated");
          dispatch(setVendorRowData(null));
          setValue("typeName", null);
          setValue("description", null);
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    }
  };

  useEffect(() => {
    if (modalType == "Platform") {
      setTitle("Add Platform");
    } else if (modalType == "Vendor") {
      setTitle("Add Vendor");
    } else if (modalType == "UpdateVendor") {
      setTitle("Update Vendor");
    } else if (modalType == "UpdatePlatform") {
      setTitle("Update Platform");
    } else if (modalType == "PaymentMethod") {
      setTitle("Add Payment Method");
    } else if (modalType == "UpdatePayment") {
      setTitle("Update Payment Method");
    } else if (modalType == "PayCycle") {
      setTitle("Add Payment Cycle");
    } else if (modalType == "UpdatePayCycle") {
      setTitle("Update Payment Cycle");
    }
  }, [modalType]);
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <fDialogContent>
          <Box noValidate component="form" onSubmit={handleSubmit(formSubmit)}>
            <TextField
              margin="dense"
              id="name"
              label="Type Name *"
              type="text"
              fullWidth
              {...register("typeName", {
                required: "Plese Enter the Type Name",
              })}
              helperText={errors.typeName?.message}
              error={Boolean(errors.typeName)}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              {...register("description")}
            />
            <DialogActions>
              <Button type="submit" variant="contained">
                submit
              </Button>
              <Button onClick={handleClose} variant="contained" color="error">
                Close
              </Button>
            </DialogActions>
          </Box>
        </fDialogContent>
      </Dialog>
    </>
  );
}
