import { Box } from "@mui/system";
import PropTypes from "prop-types";
import React from "react";
import FilterByCategory from "./Filter/FilterByCategory";
import FoodSort from "./FilterSort";
import { Grid } from "@mui/material";
import FilterByType from "./Filter/FilterByType";
import MultipleFilter from "./Filter/MultipleFilter";

FoodFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

function FoodFilter({ filters, onChange }) {
  const handleMultipleFilterChange = (values) => {
    if (!onChange) return;
    if (values.province_name) {
      const newFilters = { ...filters, ...values };
      newFilters.district_name = "";
      newFilters.ward_name = "";
      onChange(newFilters);
    } else if (values.district_name) {
      const newFilters = { ...filters, ...values };
      newFilters.ward_name = "";
      onChange(newFilters);
    } else {
      const newFilters = { ...filters, ...values };
      onChange(newFilters);
    }
  };

  const onRemove = (values) => {
    const newFilters = { ...filters };
    newFilters.province_name = "";
    newFilters.district_name = "";
    newFilters.ward_name = "";
    newFilters._sort = "";
    newFilters.min_rating = "";
    newFilters.category_id = "";
    newFilters.food_type = "";
    onChange(newFilters);
  };

  return (
    <Box>
      <div
        className="d-flex justify-content-end"
        style={{ paddingLeft: "14px" }}
      >
        <MultipleFilter
          filters={filters}
          onChange={handleMultipleFilterChange}
          onRemove={onRemove}
        />
      </div>
    </Box>
  );
}

export default FoodFilter;
