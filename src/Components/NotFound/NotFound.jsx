import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

NotFound.propTypes = {};

function NotFound(props) {
  return (
    <Box marginTop={35} className="text-center">
      <Typography variant="h1">Trang Này không tồn tại</Typography>
    </Box>
  );
}

export default NotFound;
