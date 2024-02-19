import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { Box, Container } from "@mui/system";
import FoodLocation from "./FoodLocation";

FoodLocationList.propTypes = {
  data: PropTypes.object,
};

FoodLocationList.defaultProps = {
  data: [],
};
function FoodLocationList({ data }) {
  return (
    <Box>
      <Grid marginTop={1} container>
        {data.map((foodLocation) => (
          <Grid item key={foodLocation.id} xs={12} sm={6} lg={3}>
            <FoodLocation data={foodLocation} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FoodLocationList;
