import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { InstaContext } from "../InstaApiContext";
import { useContext } from "react";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "Green",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(255,255,0) 0%, rgb(233,64,87) 50%, rgb(255,255,0) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(0,100,0) 0%, rgb(0,100,0) 50%, rgb(0,100,0) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <CheckCircleOutlineIcon />,
    2: <CancelOutlinedIcon />,
    3: <HelpOutlineOutlinedIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const decisions = ["Promotional", "Non-Promotional", "Not Sure"];
const steps = ["Selector", "Interpretor", "Auditor"];

export default function CustomizedSteppers({ step, users, post, contextData }) {
  // const { users } = useContext(InstaContext);
  // console.log(step);
  let name = ["", "", ""];
  let status = [0, 0, 0];
  // console.log(post);
  // console.log(users);
  if (step == 1) {
    const selectorname = users.find(
      (element) => element.user_id == post.selector_name
    );
    // console.log(selectorname);
    if (selectorname != undefined) {
      name[0] = selectorname.user_name;
    }

    status[0] = post.selector_decision;
  } else if (step == 2) {
    const selectorname = users.find(
      (element) => element.user_id == post.selector_name
    );
    // console.log(selectorname, users.length);
    const interpretorname = users.find(
      (element) => element.user_id == post.interpretor_name
    );
    // console.log(selectorname, interpretorname);
    if (selectorname != undefined) {
      name[0] = selectorname.user_name;
    }
    if (interpretorname != undefined) {
      name[1] = interpretorname.user_name;
    }
    status[0] = post.selector_decision;
    status[1] = post.interpretor_decision;
    // console.log(name);
  } else if (step == 3) {
    const selectorname = users.find((element) => {
      return element.user_id == post.selector_name;
    });
    const interpretorname = users.find((element) => {
      return element.user_id == post.interpretor_name;
    });
    const auditorname = users.find((element) => {
      return element.user_id == post.auditor_name;
    });
    // console.log(selectorname, interpretorname, auditorname);
    if (selectorname != undefined) {
      name[0] = selectorname.user_name;
    }
    if (interpretorname != undefined) {
      name[1] = interpretorname.user_name;
    }
    if (auditorname != undefined) {
      name[2] = auditorname.user_name;
    }

    status[0] = post.selector_decision;
    status[1] = post.interpretor_decision;
    status[2] = post.auditor_decision;
  }
  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={step}
        connector={<QontoConnector />}
      >
        {decisions.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>
              {decisions[status[index] - 1]}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stepper
        alternativeLabel
        activeStep={step}
        connector={<ColorlibConnector />}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{name[index] + " " + label}</StepLabel>
            {/* StepIconComponent={ColorlibStepIcon} */}
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
