import React from "react";
import { saveAs } from "file-saver";
// import XLSX from "xlsx";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";

const PageTemplate = () => {
  const createExcelTemplate = () => {
    const headers = ["s_no", "pagename"];
    const data = [];

    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const blob = new Blob(
      [s2ab(XLSX.write(wb, { bookType: "xlsx", type: "binary" }))],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(blob, "template.xlsx");
  };
  // Convert string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };
  return (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      type="file"
      onClick={createExcelTemplate}
    >
      Template
    </Button>
  );
};

export default PageTemplate;
