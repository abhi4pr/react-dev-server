import DateISOtoNormal from "../../../../../utils/DateISOtoNormal";


export const ViewBrandCategoryColumns = [
  { key: "Serial_no", name: "S.NO", renderRowCell: (row, index) => index + 1, width: 100, sortable: true },
  { key: "brandCategory_name", name: "Brand Category Name", renderRowCell: (row) => row.brandCategory_name, width: 100, sortable: true, showCol: true },
  { key: "created_date", name: "Created Date", renderRowCell: (row) => DateISOtoNormal(row.created_date), width: 100, sortable: true, showCol: true },
  { key: "action", name: "Actions", renderRowCell: () => <button className="icon-1"><i className="bi bi-pencil" /></button>, width: 100, sortable: true, showCol: true },

];