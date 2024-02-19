import React from "react";
import PropTypes from "prop-types";
import { Box, Paper } from "@mui/material";

ProficeSkeleton.propTypes = {};

function ProficeSkeleton(props) {
  return (
    <Box
      marginTop={10}
      marginBottom={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Paper
        className="col-lg-12 col-md-12 col-12 "
        elevation={3}
        style={{ minHeight: "700px" }}
      ></Paper>
    </Box>
  );
}

export default ProficeSkeleton;
