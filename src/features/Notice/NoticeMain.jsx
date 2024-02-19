import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import Notice from "./Notice";
import Badge from "@mui/material/Badge";
import userApi from "../../Api/userApi";
import NoticeDonatedFood from "./NoticeDonatedFood";
import transactionsApi from "../../Api/transaction";

function TabPanel(props) {
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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function NoticeMain(props) {
  const history = useHistory();
  const location = useLocation();
  const [totalNoticeSub, setTotalNoticeSub] = useState(0);
  const [totalNoticeTrans, setTotalNoticeTrans] = useState(0);

  const loadTotalTrans = async () => {
    try {
      const dataRes = await transactionsApi.getTotalNoticeTransaction();
      setTotalNoticeTrans(dataRes);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadTotalTrans();
  }, []);
  const reloadTotalTrans = () => {
    loadTotalTrans();
  };

  const loadTotalSub = async () => {
    (async () => {
      try {
        const dataRes = await transactionsApi.getTotalNoticeSub();
        setTotalNoticeSub(dataRes);
      } catch (error) {
        console.log(error);
      }
    })();
  };
  useEffect(() => {
    loadTotalSub();
  }, []);
  const reloadTotalSub = () => {
    loadTotalSub();
  };

  const getTabIndexFromUrl = () => {
    const matches = location.pathname.match(/\/notification\/(\w+)/);
    return matches ? getTabIndex(matches[1]) : null;
  };

  const getTabIndex = (tabName) => {
    switch (tabName) {
      case "transactions":
        return 0;
      case "donatedFoods":
        return 1;
      default:
        return null;
    }
  };
  const getTabName = (index) => {
    switch (index) {
      case 0:
        return "transactions";
      case 1:
        return "donatedFoods";
      default:
        return "";
    }
  };
  const [activeIndex, setActiveIndex] = useState(getTabIndexFromUrl() || 0);

  const handleChange = (event, newValue) => {
    setActiveIndex(newValue);
    const path = `/notification/${getTabName(newValue)}`;
    if (location.pathname !== path) {
      history.push(path);
    }
  };

  useEffect(() => {
    const initialTabIndex = getTabIndexFromUrl();
    if (initialTabIndex !== null && initialTabIndex !== activeIndex) {
      setActiveIndex(initialTabIndex);
    }
  }, [location.pathname, activeIndex]);

  return (
    <Box
      marginTop={14}
      marginBottom={4}
      className="ms-2 mx-2"
      style={{ display: "flex", justifyContent: "center"}}
    >
      <Paper className="col-lg-7 col-md-10 col-12 " elevation={3}>
        <Typography className="p-3 fs-2" style={{ color: "#ED6C02" }}>
          Thông Báo
        </Typography>
        <Tabs
          value={activeIndex}
          onChange={handleChange}
          aria-label="notification"
        >
          <Tab
            style={{ color: "#ED6C02" }}
            label={`Giao dịch${
              totalNoticeTrans > 0 ? ` (${totalNoticeTrans})` : ""
            }`}
          />
          <Tab
            style={{ color: "#ED6C02" }}
            label={`Nhận thực phẩm${
              totalNoticeSub > 0 ? ` (${totalNoticeSub})` : ""
            }`}
          />
        </Tabs>
        <TabPanel value={activeIndex} index={0}>
          <Notice reloadTotalTrans={reloadTotalTrans} />
        </TabPanel>
        <TabPanel value={activeIndex} index={1}>
          <NoticeDonatedFood reloadTotalSub={reloadTotalSub}/>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default NoticeMain;
