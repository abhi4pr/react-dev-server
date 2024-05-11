import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { setCloseWhatsappModal } from "../../Store/PageOverview";
import { Link } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function VendorWhatsappLinkModla() {
const links = useSelector(state=>state.PageOverview.whatsappLink)
  const dispatch = useDispatch();
  const showWhatsappModal = useSelector(
    (state) => state.PageOverview.showWhatsappModal
  );
  const handleClose = () => {
    dispatch(setCloseWhatsappModal());
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={showWhatsappModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Modal title
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
       {links.map((link,i)=>(
         <Typography key={i} gutterBottom>
       {i+1} <Link rel="stylesheet" className="link-primary" target="__blank" href={link} >  {link}</Link>
         </Typography>
         ))}
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant="contained" color="error" onClick={handleClose}>
            Clsoe
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
