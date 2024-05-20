import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setCloseShowAddModal } from "../../Store/PageMaster";
import { useEffect, useState } from "react";
import { Box, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

export default function PageAddMasterModal() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const open = useSelector((state) => state.pageMaster.showAddModal);
  const modalType = useSelector((state) => state.pageMaster.modalType);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [title, setTitle] = useState("");

  const handleClose = () => {
    dispatch(setCloseShowAddModal());
  };

  useEffect(() => {
    if (modalType === "Profile Type") {
      setTitle("Add Profile Type");
    }
  }, []);

  const formSubmit = (data) => {
    console.log(data);
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
