import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const Pages = ["tollywood_insta", "bollywood_insta"];
// eslint-disable-next-line react/prop-types
const ReplacePagesModal = ({ open, handleClose }) => {
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{mb:4}} variant="h6"  component="h2">
          Replace Page
        </Typography>
        <Autocomplete
          id="combo-box-demo"
          options={Pages}
          getOptionLabel={(option) => option}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Pages" />
          )}
          // onChange={followerChangeHandler}
        />
        <Box sx={{ display: "flex" }}>
          <TextField
            label="Page Name"
            defaultValue="bollywakae"
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category Name"
            defaultValue="Bollywood Page"
            disabled
            fullWidth
            sx={{ m: 2 }}
          />
          <TextField
            label="Follower Count"
            defaultValue="56099"
            disabled
            fullWidth
            margin="normal"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Close
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
          Replace  Request 
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReplacePagesModal;
