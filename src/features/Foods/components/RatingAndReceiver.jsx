import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DetailPageRating from "./DetailPageRating";
import RecieverList from "./RecieverList";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

RatingAndReceiver.propTypes = {
  ratings: PropTypes.object,
  foodId: PropTypes.number,
};
export default function RatingAndReceiver(props) {
  const [value, setValue] = React.useState(0);
  const ratings = props.ratings;
  const foodId = props.foodId;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Phản Hồi" {...a11yProps(0)} />
          <Tab label="Người Nhận" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DetailPageRating ratings={ratings} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <RecieverList foodId={foodId} />
      </CustomTabPanel>
    </Box>
  );
}
