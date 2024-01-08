import React from 'react'
import { useEffect, useState, useCallback, useRef } from "react";

import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Paper,
    TextField,
    Button,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import axios from 'axios';

let options = [];
const Follower_Count = [
    "<10k",
    "10k to 100k ",
    "100k to 1M ",
    "1M to 5M ",
    ">5M ",
];

const page_health = ["Active", "nonActive"];
let x;

const PageDetailingNew = ({ pageName, data }) => {

    const [allPageData, setAllPageData] = useState([]);
    const [payload, setPayload] = useState([])
    const [filteredPages, setFilteredPages] = useState([])
    const [planPages, setPlanPages] = useState([])

    const [selectedRows, setSelectedRows] = useState([]);
    const [radioSelected, setRadioSelected] = useState('all')

    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedFollower, setSelectedFollower] = useState(null)



    useEffect(() => {

        getPageData();
    }, []);

    useEffect(() => {
        if (allPageData?.length > 0) {
            categorySet();
        }
    }, [allPageData]);

    useEffect(() => {
        if (selectedRows.length == 0) {
            setPayload([])
        } else {
            const data = planPages.filter(page => {
                if (selectedRows.includes(page.p_id)) {
                    return page
                }
            })

            setPayload(data)
        }

    }, [selectedRows]);

    useEffect(() => {
        filterHandler()
    }, [radioSelected, selectedCategory,selectedFollower])



    const getPageData = async () => {
        try {
            const pageData = await axios.get(
                `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
            );

            setAllPageData(pageData.data.body);
            setPlanPages(pageData.data.body)
            setFilteredPages(pageData.data.body)
        } catch (error) {

        }


    };

    const categorySet = () => {
        allPageData.forEach((data) => {
            if (!options.includes(data.cat_name)) {

                options.push(data.cat_name);
            }
        });
    };


    const handleSelectionChange = (selectedIds) => {

        setSelectedRows(selectedIds);
    };

    const handleRadioChange = (e) => {

        const value = e.target.value;
        setRadioSelected(value);

    }

    const categoryChangeHandler = (e, op) => {

        setSelectedCategory(op)
    }

    const followerChangeHandler = (e, op) => {
        setSelectedFollower(op)
    }



    const filterHandler = () => {
        // console.log(radioSelected)
        const newSelectedRow = selectedRows
        const radioData = planPages?.filter(page => {
            if (radioSelected == 'all') {
                return page
            } else if (radioSelected == 'selected') {
                // console.log("first")
                if (selectedRows.includes(page.p_id)) {
                    return page
                }
            } else {
                if (!selectedRows.includes(page.p_id)) {
                    return page
                }
            }
        })

        if (selectedCategory?.length > 0 && selectedFollower) {
            //if there is a selected category and selected follower
            const data = radioData.filter((pages) => {
                //based on the selected follower a condition will be executed

                if (selectedFollower == "<10k") {
                    if (selectedCategory?.length > 0) {
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
                    if (selectedCategory?.length > 0) {
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
                    if (selectedCategory?.length > 0) {
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
                    if (selectedCategory?.length > 0) {
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
                    if (selectedCategory?.length > 0) {
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
            x = selectedRows
            setFilteredPages(data);
        } else if (selectedCategory?.length > 0 && !selectedFollower) {
            //in case category is present but follower count is not selected
            const data = radioData.filter((pages) => {
                return selectedCategory.includes(pages.cat_name);
            });
            console.log(data)
            x = selectedRows
            setFilteredPages(data);
            // setSelectedFollower(null)
        } else if (selectedCategory?.length == 0 && !selectedFollower) {
            console.log(radioData)
            x = selectedRows
            setFilteredPages(radioData);
        } else if (selectedCategory?.length == 0 && selectedFollower) {
        }


        // setFilteredPages(data)
    }
    
    console.log(selectedCategory)
    console.log(selectedFollower)


    useEffect(() => {
        setSelectedRows(x)
    }, [filteredPages])

    const columnForPages = [
        {
            field: "S.NO",
            headerName: "S.NO",
            width: 90,
            renderCell: (params) => {
                const rowIndex = planPages.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "page_name",
            headerName: "Pages",
            width: 150,
            editable: true,
            renderCell: (params) => {
                // console.log(params)
                return params?.row?.status == false ? (
                    <Autocomplete
                        id="combo-box-demo"
                        options={options}
                        getOptionLabel={(option) => option}
                        sx={{ width: 300 }}
                        renderInput={(param) => (
                            <TextField {...param} label={params.row.page_name} />
                        )}
                        onChange={(e) =>
                            pageReplacement(e, params.row, planPages.indexOf(params.row))
                        }
                    />
                ) : (
                    params.page_name
                );
            },
        },
        {
            field: "follower_count",
            headerName: "Follower",
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
            field: "post_page",
            headerName: "Post / Page",
            width: 150,

            renderCell: (params) => {
                return (
                    <input
                        style={{ width: "60%" }}
                        type="number"
                        value={
                            params.row.postPerPage !== null
                                ? params.row.postPerPage
                                : params.value || ""
                        }
                        placeholder={params.row.postPerPage || ""}
                    // onChange={(e) => handlePostPerPageChange(e, params)}
                    />
                );
            },
        },
        {
            field: "remainingPages",
            headerName: "remainingPages",
            width: 150,
            renderCell: (params) => {
                return (
                    <input
                        style={{ width: "60%" }}
                        type="number"
                        disabled
                        placeholder={params.row.postRemaining}
                    />
                );
            },
        },
        {
            field: "Action",
            headerName: "Action",
            width: 150,
            editable: true,
            //   renderCell: (params) => {
            //     return (
            //       <Button onClick={() => removePage(params)}>
            //         <DeleteIcon />
            //       </Button>
            //     );
            //   },
        },
    ]


    return (
        <>
            <Paper sx={{ marginTop: "2rem", padding: "1rem" }}>

                <FormControl >
                    <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={radioSelected}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="all" control={<Radio />} label="all" />
                        <FormControlLabel value="selected" control={<Radio />} label="selected" />
                        <FormControlLabel value="unselected" control={<Radio />} label="unselected" />
                        {/* <FormControlLabel value="assigned" control={<Radio />} label="assigned" />
                        <FormControlLabel value="rejected" control={<Radio />} label="rejected" /> */}

                    </RadioGroup>

                </FormControl>
            </Paper>
            <Paper sx={{ display: "flex", justifyContent: "space-around", marginTop: "1rem", padding: "1rem" }}>
                <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={options}
                    sx={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                    onChange={categoryChangeHandler}
                />
                <Autocomplete
                    id="combo-box-demo"
                    options={Follower_Count}
                    getOptionLabel={(option) => option}
                    sx={{ width: 200 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Follower Count" />
                    )}
                    onChange={followerChangeHandler}
                />
                <Autocomplete
                    id="combo-box-demo"
                    options={page_health}
                    getOptionLabel={(option) => option}
                    sx={{ width: 200 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Page health" />
                    )}
                />
                <TextField
                    label="Search"
                    variant="outlined"
                //   onChange={handleSearchChange}
                />
                <Box>
                    <Button variant="contained" sx={{ m: 1 }}>
                        Copy / paste
                    </Button>
                    <Button variant="contained" sx={{ m: 1 }}>
                        Add More Pages
                    </Button>
                </Box>
            </Paper>
            <Box sx={{ p: 2 }}>
                <TextField
                    id="outlined-basic"
                    InputLabelProps={{ shrink: true }}
                    label="Post/pages"
                    variant="outlined"
                // onChange={handlePost}
                />
            </Box>
            <Paper sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <Box sx={{ height: 700, width: "65%" }}>
                    <DataGrid
                        rows={filteredPages || []}
                        columns={columnForPages}
                        getRowId={(row) => row.p_id}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        onRowSelectionModelChange={(row) => handleSelectionChange(row)}
                        rowSelectionModel={selectedRows?.map((row) => row)}
                        getRowClassName={(params) => {
                            return params.row.status == false ? "unavailable" : "available";
                        }}
                        sx={{
                            ml: 2,
                            ".unavailable": {
                                bgcolor: " #FF4433",
                                "&:hover": {
                                    bgcolor: "#E30B5C",
                                },
                            },
                        }}
                    />
                </Box>

            </Paper>
        </>
    )
}

export default PageDetailingNew