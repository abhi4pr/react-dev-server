import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import CampaignDetails from "./CampaignDetails";
import * as XLSX from "xlsx";
import { baseUrl } from "../../../utils/config";
import SummaryDetails from "./SummrayDetailes";

const TempPlanCreation = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [payload, setPayload] = useState([]);
  const location = useLocation();
  const executionExcel = location.state?.executionExcel;
  const param = useParams();
  const id = param.id;

  const [postData, setPostData] = useState({});

  const handleChange = (event, rowIndex) => {
    const { name, value } = event.target;
    setPostData((prevData) => ({
      ...prevData,
      [rowIndex]: {
        ...prevData[rowIndex],
        [name]: value
      }
    }));
  };
  const getPageData = async () => {
    try {
      const Fdata = await axios.get(
        `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
      );
      setPageData(Fdata.data.body);
      setFilteredData(Fdata.data.body);
      if (executionExcel !== undefined) {
        const urlData = await axios.post(
          baseUrl + `get_excel_data_in_json_from_url`,
          {
            excelUrl: executionExcel,
          }
        );
        const filteredDataU = urlData.data.filter((item) => item.Sno !== "");
        const normalizeString = (str) => {
          return str
            ? str
                .trim()
                .toLowerCase()
                .replace(/\u200B/g, "")
            : "";
        };
        const matchedDataWithPId = filteredDataU.map((itemU) => {
          const normalizedName = normalizeString(itemU.Name);
          const matchedPage = Fdata.data.body.find((item) => {
            return normalizedName === normalizeString(item.page_name);
          });
          if (matchedPage) {
            return {
              Sno: itemU.Sno,
              page_name: itemU.Name,
              page_link: itemU.Link,
              follower_count: itemU["Follower Count"],
              PostCount: itemU["Post Count"],
              p_id: matchedPage.p_id,
              cat_name: matchedPage.cat_name,
            };
          } else {
            return {
              Sno: itemU.Sno,
              page_name: itemU.Name,
              page_link: itemU.Link,
              follower_count: itemU["Follower Count"],
              PostCount: itemU["Post Count"],
            };
          }
        });
        const filteredMatchedData = matchedDataWithPId.filter(
          (item) => item.page_name !== "Poetsgram"
        );
        setFilteredData(filteredMatchedData);
      }
    } catch (error) {
      console.error("Error fetching page data", error);
    }
  };

  useEffect(() => {
    getPageData();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const secondSheetName = workbook.SheetNames[1];
          const worksheet = workbook.Sheets[secondSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const uploadedPageNames = jsonData
            .slice(1)
            .map((row) => row[1])
            .filter((name) => name)
            .map((name) => name.trim().toLowerCase());
          const matchedData = filterData(uploadedPageNames);
          setFilteredData(matchedData);
        } catch (error) {
          console.error("Error reading or parsing file", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const filterData = (uploadedPageNames) => {
    return pageData.filter((item) =>
      uploadedPageNames.includes(item.page_name.trim().toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const selectedPages = filteredData.filter((row) =>
        selectedRows.includes(row.p_id)
      );
      const pages = selectedPages.map((page) => ({
        p_id: page.p_id,
        page_name: page.page_name,
        page_link: page.page_link,
        cat_name: page.cat_name,
        follower_count: page.follower_count,
        postPerPage: page.posts_per_page || 1,
        storyPerPage: page.story_per_page || 1,
      }));
  
      const postResult = await axios.post(`${baseUrl}opcampaignplan`, {
        campaignId: id,
        campaignName: "Test Campaign",
        planName: "Test Plan",
        pages: pages,
      });
  
      // Navigate to the new path upon successful submission
      navigate('/admin/op-registered-campaign');
    } catch (error) {
      console.error("Error posting data", error);
    }
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "",
      width: 10,
    },
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => {
        const rowIndex = filteredData?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      renderCell: (params) => {
        const link = params.row.page_link;
        return (
          <div style={{ color: "blue" }}>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {params.row.page_name}
              </a>
            )}
          </div>
        );
      },
    },
    {
      field: "page_link",
      headerName: "Page Link",
      width: 250,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
    },
    {
      field: "follower_count",
      headerName: "Follower Count",
      width: 150,
    },
    {
      field: "posts_per_page",
      headerName: "Posts",
      width: 140,
      renderCell: (params) => (
        <input
          type="number"
          name={`posts_${params.rowIndex}`}
          className="form-control border border-primary"
          value={postData[params.rowIndex]?.posts || 1}
          onChange={(event) => handleChange(event, params.rowIndex)}
        />
      ),
    },
    {
      field: "story_per_page",
      headerName: "Story ",
      width: 140,
      renderCell: (params) => (
        <input type="number" className="form-control border border-primary" value={"1"} />
      ),
    },
  ];
  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);

    const selectedData = filteredData.filter((row) =>
      selectedIds.includes(row.p_id)
    );
    setPayload(selectedData);
  };
  return (
    <>
      <FormContainer mainTitle="Plan Creation" link="true" />
      <CampaignDetails cid={id} />
      <div>
        <label> Upload Excel</label>
        <br />
        <input
          type="file"
          accept=".xlsx, .xls"
          placeholder="Excel"
          onChange={handleFileUpload}
        />
      </div>
      <div style={{}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 0.5,
            height: "700px",
            width: `${selectedRows.length > 0 && "100%"}`,
          }}
        >
          <DataGrid
            rows={filteredData}
            columns={columns}
            getRowId={(row) => row.p_id}
            checkboxSelection
            pagination
            onRowSelectionModelChange={(row) => handleSelectionChange(row)}
            rowSelectionModel={selectedRows?.map((row) => row)}
          />
          <SummaryDetails
            payload={payload}
            campName={"campValue"}
            drawer={false}
          />
        </div>
      </div>
      <button
        className="btn btn-outline-danger rounded-pill"
        onClick={handleSubmit}
        style={{ width: "10%" }}
      >
        Submit
      </button>
    </>
  );
};
export default TempPlanCreation;
