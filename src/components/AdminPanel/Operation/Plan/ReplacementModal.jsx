import React, { useEffect, useState } from "react";
import { TextField, Modal, Button, Box, Typography,Autocomplete } from "@mui/material";
import axios from "axios";
import Select from "react-select";

const ReplacementModal = ({
  open,
  handleOpen,
  handleClose,
  selectedRow,
  plan,
}) => {
  const [pageData, setPageData] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [postPages, setPostpages] = useState([]);
  const [storyPages, setStorypages] = useState([]);

  console.log(pageData);

  useEffect(() => {
    const getPageData = async () => {
      try {
        const res = await axios.get(
          `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
        );
        const remainingData = res?.data?.body.filter(
            (item) =>
              !plan.some((selectedItem) => selectedItem.p_id === item.p_id)
          );
          setPageData(remainingData);
      } catch (error) {
        console.error("Error fetching page data: ", error);
      }
    };

    getPageData();
  }, []);

 

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Replace Pages
          </Typography>
          <hr />
          <Typography variant="h6" component="h6">
            Old page
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <TextField
              label="Page"
              variant="outlined"
              value={selectedRow?.page_name}
              fullWidth
              disabled
            />
            <TextField
              label="Follower"
              variant="outlined"
              value={selectedRow?.follower_count}
              fullWidth
              disabled
            />
            <TextField
              label="Post"
              variant="outlined"
              value={selectedRow?.postPerPage}
              fullWidth
              disabled
            />
            <TextField
              label="Story"
              variant="outlined"
              value={selectedRow?.storyPerPage}
              fullWidth
              disabled
            />
          </Box>
          <Typography variant="h6" component="h6">
            New Page
          </Typography>
          <Autocomplete
            id="combo-box-demo"
            multiple
            options={pageData}
            getOptionLabel={(option) => option?.page_name}
            onChange={(event, value) => setSelectedPages(value)}
            sx={{ width: 300, mb: 2 }}
            renderInput={(params) => <TextField {...params} label="Pages" />}
          />
        </Box>
<>
{selectedPages?.map(( page, index)=>(

    <Box>
          <TextField
                label="Page Name"
                value={page.page_name}
                disabled
                fullWidth
                margin="normal"
              />
    </Box>
))}
</>
       
      </Modal>
    </div>
  );
};

export default ReplacementModal;
