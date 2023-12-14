import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "./scrollbar";
import { SeverityPill } from "./severity-pill";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewLatestOrders = ({products,sx}) => {
  // const { products , sx } = props;
  const columns =[{field:'id',headerName:"ID" ,width:"20"},{field:'cust_name' ,headerName:"Customer Name",width:"150"},{field:'sale_booking_date',headerName:"Sales Booking Date",width:"150"},{field:'execution_status',headerName:"Status",width:"150",renderCell: (params) => {
    return params.row.execution_status == "1" ? (
      <Button
        size="small"
        color="success"
        variant="outlined"
        // fontSize="inherit"
      >
        Done
      </Button>
    ) : params.row.execution_status =="2" ? (
      <Button
        size="small"
        color="success"
        variant="outlined"
        // fontSize="inherit"
      >
        Accepted
      </Button>
    ) : params.row.execution_status == "0" ? (
      <Button
        size="small"
        color="default" // You can choose the appropriate color for "Pending"
        variant="outlined"
        // fontSize="inherit"
      >
        Pending
      </Button>
    ) : (
      <Button
        size="small"
        color="error"
        variant="outlined"
        fontSize="inherit"
      >
        Rejected
      </Button>
    );
    
  }}]
const topFiveProducts = products.filter(e=>e.execution_status==1).slice(0, 5);
  // const { orders = [], sx } = props;
  // const columns = [
  //   { field: "id", headerName: "ID" },
  //   { field: "ref", headerName: "Name" },
  //   { field: "amount", headerName: "Amount" },
  //   { field: "params.name", headerName: "Name" },
  //   { field: "createdAt", headerName: "Date" },
  //   { field: "status", headerName: "Status" },
  // ];
  return (
    <Card sx={sx}>
    <CardHeader title="Latest Executed" />
    <DataGrid
      rows={topFiveProducts}
      columns={columns}
      getRowId={(row) => row.id}
    />
    <Divider />
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <Link to="/admin/exeinventory">
        <Button
          color="inherit"
          endIcon={<SvgIcon fontSize="small"><ArrowRightIcon /></SvgIcon>}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Link>
    </CardActions>
  </Card>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};