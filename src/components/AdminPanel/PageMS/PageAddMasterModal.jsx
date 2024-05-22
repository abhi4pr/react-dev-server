import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  setCloseShowAddModal,
  setCloseShowPageInfoModal,
} from "../../Store/PageMaster";
import { useEffect, useState } from "react";
import { Autocomplete, Box, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import jwtDecode from "jwt-decode";
import {
  useAddPageCategoryMutation,
  useAddPlatformPriceMutation,
  useAddProfileTypeMutation,
  useGetAllPriceListQuery,
  useUpdatePageCategoryMutation,
  useUpdateProfileTypeMutation,
} from "../../Store/PageBaseURL";
import { useGlobalContext } from "../../../Context/Context";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";

export default function PageAddMasterModal() {
  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const open = useSelector((state) => state.pageMaster.showAddModal);
  const modalType = useSelector((state) => state.pageMaster.modalType);
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.pageMaster.rowData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm();

  const [title, setTitle] = useState("");

  const handleClose = () => {
    dispatch(setCloseShowAddModal());
    setValue("name", "");
    setValue("description", "");
  };

  const [addProfileType] = useAddProfileTypeMutation();
  const [updateProfileType] = useUpdateProfileTypeMutation();
  const [addCategory] = useAddPageCategoryMutation();
  const [updateCategory] = useUpdatePageCategoryMutation();

  useEffect(() => {
    if (modalType === "Profile Type") {
      setTitle("Add Profile Type");
    } else if (modalType === "Profile Type Update") {
      setTitle("Update Profile Type");
      setValue("name", rowData.profile_type);
      setValue("description", rowData.description);
    } else if (modalType === "Category") {
      setTitle("Add Category");
    } else if (modalType === "Category Update") {
      setTitle("Update Category");
      setValue("name", rowData.page_category);
      setValue("description", rowData.description);
    } else if (modalType === "Price Type") {
      setTitle("Add Price Type");
    }
  }, [modalType, rowData]);

  const formSubmit = (data) => {
    const obj = {
      profile_type: data.name,
      description: data.description,
      updated_by: userID,
      _id: rowData._id,
      created_by: userID,
    };

    if (modalType === "Profile Type") {
      addProfileType(obj)
        .unwrap()
        .then(() => {
          toastAlert("Profile Type Added Successfully");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType === "Profile Type Update") {
      updateProfileType(obj)
        .unwrap()
        .then(() => {
          toastAlert("Profile Type Updated Successfully");
          handleClose();
          dispatch(setCloseShowPageInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType === "Category") {
      delete obj.updated_by;
      delete obj.profile_type;
      obj.page_category = data.name;
      addCategory(obj)
        .unwrap()
        .then(() => {
          toastAlert("Category Added Successfully");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType === "Category Update") {
      delete obj.updated_by;
      delete obj.profile_type;
      obj.page_category = data.name;
      updateCategory(obj)
        .unwrap()
        .then(() => {
          toastAlert("Category Updated Successfully");
          handleClose();
          dispatch(setCloseShowPageInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    }
  };

  const {
    data: platformData,
    islaoding: isPlatformLoading,
    error,
  } = useGetPmsPlatformQuery();
  const platformList = platformData?.data || [];

  const {
    data: priceData,
    islaoding: isPriceLoading,
    error: priceError,
  } = useGetAllPriceListQuery();
  const priceList = priceData?.data || [];

  const [addPlatformPrice] = useAddPlatformPriceMutation();

  if (modalType === "Price Type" || modalType === "Price Type Update") {
    const priceTypeFormSubmit = (data) => {
      console.log("object");
      console.log(data);
      const obj = {
        price_type_id: priceList.find(
          (price) => price.price_type === data.priceType
        )?._id,
        platform_id: platformList.find(
          (platform) => platform.platform_name === data.platform
        )._id,
        description: data.description,
        created_by: userID,
      };
      addPlatformPrice(obj)
        .unwrap()
        .then(() => {
          toastAlert("Price Type Added Successfully");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    };
    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit2(priceTypeFormSubmit)}>
              <Autocomplete
                id="price-type-autocomplete"
                options={priceList.map((option) => ({
                  priceType: option.price_type,
                  value: option._id,
                }))}
                getOptionLabel={(option) => option.priceType}
                style={{ width: 300 }}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderInput={(params) => (
                  <TextField
                    {...register2("priceType", {
                      required: "Please Select the Price Type",
                    })}
                    {...params}
                    label="Price Type *"
                    variant="outlined"
                    helperText={errors2.priceType?.message}
                    error={Boolean(errors2.priceType)}
                  />
                )}
              />
              <Autocomplete
                id="platform-autocomplete"
                options={platformList?.map((option) => ({
                  platformName: option.platform_name,
                  value: option._id,
                }))}
                getOptionLabel={(option) => option.platformName || ""}
                style={{ width: 300 }}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                onChange={(event, newValue) => {
                  setValue("platform", newValue ? newValue.value : "");
                  console.log(newValue.value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...register2("platform", {
                      required: "Please Select the Platform",
                    })}
                    {...params}
                    label="Platform *"
                    variant="outlined"
                    helperText={errors2.platform?.message}
                    error={Boolean(errors2.platform)}
                  />
                )}
              />

              <TextField
                label="Description"
                required={false}
                {...register2("description")}
              />
              <DialogActions>
                <Button autoFocus type="submit">
                  Sbumit
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(formSubmit)}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name *"
              type="text"
              fullWidth
              {...register("name", {
                required: "Please Enter the Name",
                maxLength: 80,
              })}
              helperText={errors.name?.message}
              error={Boolean(errors.name)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              {...register("description")}
            />
            <DialogActions>
              <Button autoFocus type="submit">
                Sbumit
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
