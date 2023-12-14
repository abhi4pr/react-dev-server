import PropTypes from "prop-types";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

export const OverviewBudget = (props) => {
  const { complete, pending, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {value}
            </Typography>

            {/* <Typography variant="h4">{value}</Typography> */}

            <Avatar
              sx={{
                backgroundColor: "success.main",
                height: 46,
                width: 46,
              }}
            >
              <Typography variant="h6">{complete}</Typography>
            </Avatar>
            <Typography variant="h6">Complete</Typography>
            <Avatar
              sx={{
                backgroundColor: "error.main",
                height: 46,
                width: 46,
              }}
            >
              <Typography variant="h6">{pending}</Typography>
              {/* <SvgIcon> */}
              {/* <CurrencyRupeeIcon /> */}
              {/* </SvgIcon> */}
            </Avatar>
            <Typography variant="h6">Pending</Typography>
          </Stack>
        </Stack>
        {/* {difference && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? "success" : "error"} fontSize="small">
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={positive ? "success.main" : "error.main"}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Since last month
            </Typography>
          </Stack>
        )} */}
      </CardContent>
    </Card>
  );
};

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
