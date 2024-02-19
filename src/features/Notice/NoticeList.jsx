import React from "react";
import PropTypes from "prop-types";
import { Box, Grid } from "@mui/material";
import NoticeItem from "./NoticeItem";

NoticeList.propTypes = {
  noticeList: [],
  loaddataNoticeItemt: PropTypes.func,
  reloadTotalTrans: PropTypes.func,
};

function NoticeList(props) {
  const noticeList = props.noticeList;
  const loaddataNoticeItemt = props.loaddataNoticeItemt;
  const reloadTotalTrans = props.reloadTotalTrans;
  return (
    <Box>
      <Grid marginTop={1} container>
        {noticeList.map((notice, index) => (
          <Grid item key={index}>
            <NoticeItem
              notice={notice}
              loaddataNoticeItemt={loaddataNoticeItemt}
              reloadTotalTrans={reloadTotalTrans}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default NoticeList;
