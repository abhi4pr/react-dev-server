import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const CasestudyTabulerData = ({ backupData, brandData,brandCategory,brandSubCatData }) => {
  const [enrichedData, setEnrichedData] = useState([]);

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

  const columns = [
    {
        field: "S.NO",
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
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={enrichedData}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row._id}
        // disableColumnResize={false}
        // disableColumnReorder={false}
      />
    </div>
  );
};

export default CasestudyTabulerData;
