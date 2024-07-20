import {
  Autocomplete,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { formatNumber } from "../../../utils/formatNumber";
import axios from "axios";

function CommunityHeader({
  rows,
  setRows,
  allRows,
  pagecategory,
  rowSelectionModel,
  projectxpages,
  reload,setReload
 
}) {
  const [teamCreated, setTeamCreated] = useState({ totalCor: 0, teamCount: 0 });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const result = processRecords(allRows);
    setTeamCreated(result);
    // console.log("resultt",result?.totalPaidPost);
  }, [allRows]);

  const processRecords = (rows) => {
    let totalCor = 0;
    let teamCount = 0;
    let totalPaidPost = 0;
    rows.forEach((record) => {
      if (record.teamInfo?.team?.cost_of_running) {
        totalCor += record.teamInfo.team.cost_of_running;

        if (record.teamInfo.team.team_count > 0) {
          teamCount++;
        }
      }
      if (record.paidPosts?.count > 0) {
        totalPaidPost += record.paidPosts?.count;

        
      }
    });

    return {
      totalCor: totalCor,
      teamCount: teamCount,
      totalPaidPost :totalPaidPost 
    };
  };


  const handleAllTeam = () => {
    setRows(allRows);
  };
  const handlePendingTeam = () => {
    const pendingTeam = allRows.filter(
      (record) => !record.teamInfo.team.cost_of_running
    );
    setRows(pendingTeam);
    // console.log(pendingTeam.length)
  };
  const handleCreatedTeam = () => {
    const createdTeam = allRows.filter(
      (record) => record.teamInfo.team.team_count > 0
    );
    setRows(createdTeam);
  };

  const handleCategoryChange = (event, value) => {
    // Find the category object based on the selected category name
    const selectedCategoryObject = pagecategory.find(
      (category) => category.category_name === value
    );
    if (selectedCategoryObject) {
      const filteredRows = allRows.filter(
        (record) =>
          record.reportStatus.previousDay.pageCategoryId ==
          selectedCategoryObject?.category_id
      );
      if (rowSelectionModel.length == 0) {
        setRows(filteredRows);
      }
      setSelectedCategory(selectedCategoryObject);
    }
    if (value === null || value === "") {
      handleCategoryClear();
    }
    // console.log(value, selectedCategoryObject, "selectedCategoryObject");
  };
  const handleCategoryClear = () => {
    setSelectedCategory(null);
    setRows(allRows);
  };

  const handleUpdateCategory = async () => {
    if (selectedCategory == null) {
      alert("Please select category first");
    }
    console.log(projectxpages, "projectxpages", selectedCategory);
    // return;
    // Assuming rowSelectionModel contains the selected page names
    const selectedPageNames = rowSelectionModel; // Replace with your actual rowSelectionModel array

    // Filter the projectxpages array to get the pages that need to be updated
    const pagesToUpdate = projectxpages.filter((page) =>
      selectedPageNames.includes(page.page_name)
    );
    console.log(pagesToUpdate, "pagesToUpdate");
    // Loop through the filtered pages and make API calls to update them
    for (const page of pagesToUpdate) {
      try {
        const response = await axios.put(
          `https://insights.ist:8080/api/projectxupdate`,
          {
            id: page.id,
            page_category_id: selectedCategory.category_id,
          }
        );

        // console.log(
        //   `Updated page ${page.page_name} successfully`,
        //   response.data
        // );
      } catch (error) {
        console.error(`Failed to update page ${page.page_name}`, error);
        alert("There is some error while updating category")
      }
    }
    setReload(!reload);
    alert("Please check the update Category")
  };

  return (
    <Stack direction="row" justifyContent="space-evenly" sx={{ mt: 2 }}>
      <Badge badgeContent={allRows.length} color="secondary">
        <Button onClick={handleAllTeam} variant="outlined">
          All Team{" "}
        </Button>
      </Badge>
      <Badge badgeContent={teamCreated?.teamCount} color="success">
        <Button onClick={handleCreatedTeam} variant="outlined">
          Team Created
        </Button>
      </Badge>
      <Badge
        badgeContent={allRows.length - teamCreated?.teamCount}
        color="error"
      >
        <Button onClick={handlePendingTeam} variant="outlined">
          Team Pending
        </Button>
      </Badge>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={pagecategory.map((ele) => ele.category_name)}
        sx={{ width: 200 }}
        // onClear={handleCategoryClear}
        onInputChange={handleCategoryChange}
        renderInput={(params) => (
          <TextField size="small" {...params} label="Category" />
        )}
      />
      {teamCreated?.totalCor > 0 && (
        <Chip label={`COR : ${formatNumber(teamCreated?.totalCor)}`} />
      )}
      {teamCreated?.totalPaidPost > 0 && (
        <Chip label={`Paid-Post : ${formatNumber(teamCreated?.totalPaidPost)}`} />
      )}
      {rowSelectionModel.length > 0 && (
        <Button onClick={handleUpdateCategory} variant="outlined">
          Update-Category
        </Button>
      )}
    </Stack>
  );
}

export default CommunityHeader;
