import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { Box, Container } from "@mui/system";
import Food from "./Food";
FoodList.propTypes = {};
FoodList.defaultProps = {
  data: [],
};
function FoodList({ data }) {
  return (
    <Box>
      <Grid marginTop={1} container>
        {data.map((food) => (
          <Grid item key={food.id} xs={12} sm={6} lg={3}>
            <Food food={food} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FoodList;
