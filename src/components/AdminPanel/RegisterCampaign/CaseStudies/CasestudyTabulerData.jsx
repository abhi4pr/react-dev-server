import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { GridToolbarColumnsButton } from "@mui/x-data-grid";


function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
    </GridToolbarContainer>
  );
}

const CasestudyTabulerData = ({ backupData, brandData,brandCategory,brandSubCatData }) => {
  const [enrichedData, setEnrichedData] = useState([]);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [filterModel, setFilterModel] = useState({
    items: [
      {
        id: 1,
        field: "brandName",
        // value: [5000, 15000],
        // operator: 'between',
      },
    ],
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    S_NO: false,
    brandName: true,
    campaign_purpose: true,
    categoryName: true,
    subcat: false,
    designed_by: true,
    created_by_name: true,
    
  });


  useEffect(() => {
    const enrichedBackupData = backupData.map((data) => {
      const brand = brandData?.find((brand) => brand._id === data.brand_id);
      const category = brandCategory?.find((category) => category.category_id === data.brand_category_id);
      const subCat = brandSubCatData?.find((subcat) => subcat.sub_category_id === data.brand_sub_category_id);
      return {
        ...data,
        brandName: brand ? brand.brand_name : "",
        categoryName: category ? category.category_name : "",
        subcat: subCat ? subCat.sub_category_name : "",
    };
});

    setEnrichedData(enrichedBackupData);
  }, [backupData, brandData, brandCategory]); 

  // const columns = 


  // resizeing columns ---->
const [ columns, setColumns] = useState([
  {
      field: "S_NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = enrichedData?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
  {
    field: "brandName",
    headerName: "Brand",
    width: 180,
  },
  {
    field: "campaign_purpose",
    headerName: "Campaign",
    width: 180,
  },
  {
    field: "categoryName",
    headerName: "Category",
    width: 180,
  },
  {
    field: "subcat",
    headerName: "Sub Category",
    width: 180,
  },
  {
    field: "designed_by",
    headerName: "Designed by",
    width: 180,
  },
  {
    field: "created_by_name",
    headerName: "Uploaded by",
    width: 125, minWidth: 150, maxWidth: 200
  },
])
  const [resizingColumn, setResizingColumn] = React.useState(null);
  const [startX, setStartX] = React.useState(null);
  const handleMouseDown = (e, field) => {
    setResizingColumn(field);
    setStartX(e.clientX);
  };
  const handleMouseMove = (e) => {
    if (resizingColumn !== null && startX !== null) {
      // console.log(resizingColumn,"startX",startX)
      const deltaX = e.clientX - startX;
      handleResize(resizingColumn, deltaX);
      setStartX(e.clientX);
    }
  };
  const handleMouseUp = () => {
    setResizingColumn(null);
    setStartX(null);
  };
  const handleResize = (field, deltaX) => {
    const columnIndex = columns.findIndex((col) => col.headerName === field);
    // console.log(columnIndex,"columnIndex")
    const newColumns = [...columns];
    newColumns[columnIndex] = {
      ...newColumns[columnIndex],
      width: newColumns[columnIndex].width + deltaX,
    };
    setColumns(newColumns);
  };
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, startX]);
  const ResizableHeader = ({ field, width }) => (
    <div
      style={{ width: width + 'px', cursor: 'col-resize' }}
      onMouseDown={(e) => handleMouseDown(e, field)}
    >
      {field}
    </div>
  );
  const resizableColumns = columns.map((col) => ({
    ...col,
    headerAlign: 'center',
    renderHeader: (params) => (
      <ResizableHeader field={col.headerName} width={params.colDef.width} />
    ),
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={enrichedData}
        columns={resizableColumns}
        pageSize={5}
        getRowId={(row) => row._id}
        initialState={{
          sorting: {
            sortModel: [
              { field: "brandName", sort: "desc" },
            ],
          },
        }}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          panel: {
            anchorEl: filterButtonEl,
          },
          toolbar: {
            setFilterButtonEl,
          },
        }}
        filterModel={filterModel}
        onFilterModelChange={(model) =>
          setFilterModel(model)
        }
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
      />
    </div>
  );  
};

export default CasestudyTabulerData;
