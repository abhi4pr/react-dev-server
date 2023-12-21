import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  TextField,
  Autocomplete,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import CampaignDetailes from "./CampaignDetailes";
import Assigned from "./Assigned";

//imports for radio button
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

let options = [];
const Follower_Count = [
  "<10k",
  "10k to 100k ",
  "100k to 1M ",
  "1M to 5M ",
  ">5M ",
];

const CreateAssign = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [allPageData, setAllPageData] = useState([]);
  const [commit, setCommit] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [singlePhaseData, setSinglePhaseData] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [payload, setPayload] = useState([])
  const [expertiseData, setExpertiseData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [campaignId, setcampaignId] = useState("");
  const [externalExpert, setExternalExpert] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState(null)
  const [radioSelected, setRadioSelected] = useState('all')

  const categoryAutocompleteRef = useRef();

  const getPhaseData = async () => {
    try {
      let response = await axios.get(
        `http://localhost:3000/api/campaignphase/singlephase/${id}`
      );
      const getPhaseAssignment = await axios.get(`http://localhost:3000/api/assignment/phase/${id}`)

      if (getPhaseAssignment?.data?.data.length > 0) {
        setSinglePhaseData(getPhaseAssignment?.data?.data);
        setFilteredPages(getPhaseAssignment?.data?.data);
        setPayload(getPhaseAssignment?.data?.data);
      } else {

        setSinglePhaseData(response?.data?.data?.pages);
        setFilteredPages(response?.data?.data?.pages);
        setPayload(response?.data?.data?.pages);
      }


      setcampaignId(response?.data?.data?.pages[0].campaignId);
      setCommit(response?.data?.data?.commitment);
    } catch (error) {
      console.error("Error fetching phase data:", error);
    }
    const pageData = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    setAllPageData(pageData.data.body);
  };

  //getting all experties information 

  const ExpertiseDa = async () => {
    try {
      const response = await axios.get(
        "http://34.93.221.166:3000/api/expertise"
      );
      const res = response.data.data;
      setExpertiseData(res);
    } catch {
      console.log("not fatch data");
    }
  };

  //submiting the assignment
  const handleSubmitAssign = async () => {
    try {
      const createAssignment = await axios.post(`http://localhost:3000/api/assignment/bulk`, { pages: payload });

      // navigate("/admin/excusionCampaign");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
   setFilteredPages(payload)
   setRadioSelected('all')
  }, [externalExpert]);

  useEffect(() => {
    getPhaseData();
    ExpertiseDa();
  }, []);

  const categorySet = () => {
    singlePhaseData?.forEach((data) => {
      if (!options.includes(data.cat_name)) {
        options.push(data.cat_name);
      }
    });
  };
  useEffect(() => {
    if (singlePhaseData.length > 0) {
      categorySet();
    }
  }, [singlePhaseData]);


  const categoryChangeHandler = (e, op) => {

    setSelectedCategory(op);
  };

  const categorySelector = (radioData) => {
    if (selectedCategory.length > 0 && selectedFollower) {
      //if there is a selected category and selected follower
      const page = radioData.filter((pages) => {
        //based on the selected follower a condition will be executed

        if (selectedFollower == "<10k") {
          if (selectedCategory.length > 0) {
            //if there is category selected then this
            return (
              Number(pages.follower_count) <= 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            //if there is no category selected
            return Number(pages.follower_count) <= 10000;
          }
        }
        if (selectedFollower == "10k to 100k ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000
            );
          }
        }
        if (selectedFollower == "100k to 1M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000
            );
          }
        }

        if (selectedFollower == "1M to 5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000
            );
          }
        }
        if (selectedFollower == ">5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) > 5000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) > 5000000;
          }
        }
        // return selectedCategory.includes(pages.cat_name)
      });
      //to set the filtered page
      setFilteredPages(page);
    } else if (selectedCategory.length > 0 && !selectedFollower) {
      //in case category is present but follower count is not selected
      const page = radioData.filter((pages) => {
        return selectedCategory.includes(pages.cat_name);
      });
      setFilteredPages(page);
      // setSelectedFollower(null)
    } else if (selectedCategory.length == 0 && !selectedFollower) {
      setFilteredPages(radioData);
    } else if (selectedCategory.length == 0 && selectedFollower) {
    }
  }
  useEffect(() => {

    const radioData = payload?.filter(page => {
      if (radioSelected == 'all') {
        return page
      } else {

        return page.ass_status == radioSelected
      }
    })

    categorySelector(radioData)
  }, [selectedCategory]);

  const followerSelector = (radioData) => {
    if (selectedFollower) {
      const page = radioData.filter((pages) => {
        if (selectedFollower == "<10k") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) <= 10000;
          }
        }
        if (selectedFollower == "10k to 100k ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000
            );
          }
        }
        if (selectedFollower == "100k to 1M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000
            );
          }
        }
        if (selectedFollower == "1M to 5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000
            );
          }
        }
        if (selectedFollower == ">5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) > 5000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) > 5000000;
          }
        }
        // return selectedCategory.includes(pages.cat_name)
      });
      setFilteredPages(page);
    } else {
      if (selectedCategory.length > 0) {
        const page = radioData.filter((pages) => {
          return selectedCategory.includes(pages.cat_name);
        });
        setFilteredPages(page);
      } else setFilteredPages(radioData);
    }
  }
  useEffect(() => {
    const radioData = payload?.filter(page => {
      if (radioSelected == 'all') {
        return page
      } else {

        return page.ass_status == radioSelected
      }
    })

    followerSelector(radioData)

  }, [selectedFollower]);


  const handleSelectionChange = (selectedIds) => {
    console.log(selectedIds)
    setSelectedRows(selectedIds);
  };


  const handleExternalExpertChange = (event, newValue) => {
    
    setLoading(true)
    const data=payload.map(page=>{
      if(selectedRows.includes(page.p_id)){
        return {...page,ass_to:newValue.value,exp_name:newValue.label,ass_status:'pending',
        expert:newValue?{label:newValue.label,value:newValue.value}:null
      }
    }else return page
  })
  
  setPayload(data)
  setFilteredPages([])
  setExternalExpert(newValue)
    // setSelectedRows([])

    setLoading(false)
    
  };

  console.log(filteredPages);
  const handleExpertsChange = (event, newValue, params) => {
    console.log(event, newValue, params);
    const data = payload.map(page => {
      if (page.p_id == params.row.p_id) {
        return { ...page, ass_to: newValue.all.exp_id, exp_name: newValue.label, ass_status: newValue == null ? 'unassigned' : 'pending' }
      } else return page
    })

    console.log(data)
    setPayload(data)
  };
  const followerChangeHandler = (e, op) => {
    setSelectedFollower(op);
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const assignModalfn = (newPayload) => {
    setPayload(newPayload);
  }

  const handleRadioChange = (e) => {
    setRadioSelected(e.target.value)

    setSelectedCategory([])
    setSelectedFollower(null)
    const cat=document.getElementById('combo-box-demo')
    const spans=cat.getElementsByTagName('span')
    while (spans.length > 0) {
      spans[0].parentNode.removeChild(spans[0]);
  }
  
    const data = payload?.filter(page => {
      if (e.target.value == 'all') {


        return page
      } else {

        return page.ass_status == e.target.value
      }
    })
    setFilteredPages(data)
  }
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = singlePhaseData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      editable: true,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
      editable: true,
    },

    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
      editable: true,
    },
    {
      field: "page_link",
      headerName: "Page Link",
      width: 150,
      editable: true,
    },
    {
      field: "expert",
      headerName: "Experts",
      width: 190,
      renderCell: (params) => {
        return (
          !loading && 
            <Autocomplete
              value={  params.row.expert ? params.row.expert?.label : params.row.exp_name}
              // value={ params.row?.expert?.label}
              isOptionEqualToValue={(option, value) => {
                option.value === value.value && option.value == value.label;
              }}
              options={expertiseData.map((user) => ({
                label: user.exp_name,
                value: user.exp_id,
                all: user
              }))}
              onChange={(event, newValue) =>
                handleExpertsChange(event, newValue, params)
              }
              renderInput={(params) => <TextField {...params} />}
              fullWidth
            />
          
        );
      },
    },
    {
      field: "postPerPage",
      headerName: "Post / Page",
      width: 150,
      editable: true,
    },
    {
      field: "postRemaining",
      headerName: "Post Remain",
      width: 150,
      editable: true,
    },
  ];

  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>Create Assignment</h2>
        </div>
      </div>
      <Typography variant="h5" component="h5" sx={{ mb: 2 }}>
        Campaign Detailes
      </Typography>
      <CampaignDetailes cid={campaignId} />
      <Typography
        variant="h5"
        component="h5"
        style={{ marginTop: "10px", marginBottom: "15px" }}
      >
        Phase Detailes
      </Typography>

      <Paper>
        <TextField
          label="Phase "
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
          value={singlePhaseData[0]?.phaseName}
          sx={{ m: 2 }}
        />
        <TextField
          label="plan Name"
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
          value={singlePhaseData[0]?.planName}
          sx={{ m: 2 }}
        />
        {commit?.map((item) => (
          <Box sx={{ display: "flex" }}>
            <TextField
              label="Commitment"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              value={item.commitment}
              sx={{ m: 2 }}
            />
            <TextField
              label="Value"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              value={item.value}
              sx={{ m: 2 }}
            />
          </Box>
        ))}
      </Paper>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={radioSelected}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="all" control={<Radio />} label="all" />
          <FormControlLabel value="unassigned" control={<Radio />} label="unassigned" />
          <FormControlLabel value="pending" control={<Radio />} label="assigned" />

        </RadioGroup>
      </FormControl>
      <Box sx={{ display: "flex", m: 2 }}>
        <div className="col-sm-12 col-lg-3">
          <Autocomplete
            value={externalExpert}
            options={expertiseData.map((user) => ({
              label: user.exp_name,
              value: user.exp_id,
              all: user
            }))}
            onChange={handleExternalExpertChange}
            renderInput={(params) => (
              <TextField {...params} label="External Expert" />
            )}
            fullWidth
          />
        </div>
        <div className="col-sm-12 col-lg-3">

          <Autocomplete
            multiple
            id="combo-box-demo"
            options={options}
            ref={categoryAutocompleteRef}
            renderInput={(params) => <TextField {...params} label="Category" />}
            onChange={categoryChangeHandler}
          />
        </div>

        <div className="col-sm-12 col-lg-3">
          {" "}
          <Autocomplete
            id="combo-box-demo-2"
            options={Follower_Count}
            getOptionLabel={(option) => option}
            sx={{ width: 200 }}
            renderInput={(params) => (
              <TextField {...params} label="Follower Count" />
            )}
            onChange={followerChangeHandler}
          />
        </div>
        <Box>
          <Button variant="outlined" onClick={handleOpenModal}>
            {" "}
            Assigned Task
          </Button>
        </Box>
      </Box>


      <Box sx={{ height: loading ? 100 : 500, width: "100%" }}>
        {!loading && (
          <DataGrid
            rows={filteredPages}
            columns={columns}
            getRowId={(row) => row.p_id}
            pageSizeOptions={[5]}
            checkboxSelection
            onRowSelectionModelChange={(row) => handleSelectionChange(row)}
            rowSelectionModel={selectedRows.map((row) => row)}
          />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" sx={{ m: 2 }} onClick={handleSubmitAssign}>
          Create Assignment{" "}
        </Button>
      </Box>
      <Assigned
        open={isModalOpen}
        handleClose={handleCloseModal}
        data={payload}
        assignModalfn={assignModalfn}
      />

    </>
  );
};

export default CreateAssign;
