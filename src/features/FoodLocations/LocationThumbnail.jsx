import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Grid, Paper } from "@mui/material";
import { baseURL } from "../../Constants/env";
LocationThumbnail.propTypes = {
  location: PropTypes.object,
};
const ThumbnailImage = styled("img")(({ theme, isSelected }) => ({
  borderRadius: "0.5em",
  objectFit: "cover",
  width: "100%",
  height: "490px",
  cursor: "pointer",
  "&:hover": {
    opacity: 1,
  },
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    position: "relative",
    overflow: "hidden",
  }));
  
function LocationThumbnail(location) {
  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item xs={12}>
        <Item>
          <ThumbnailImage
            src={`${baseURL}${location?.location?.image}`}
            alt={location?.location?.name}
            isSelected
          />
        </Item>
      </Grid>
    </Grid>
  );
}

export default LocationThumbnail;
