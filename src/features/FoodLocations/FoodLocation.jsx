import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { baseURL } from "../../../src/Constants/env";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PlaceIcon from "@mui/icons-material/Place";
import dayjs from "dayjs";

const FoodContainer = styled(Box)({
  position: "relative",
  cursor: "pointer",
  border: "1px solid #efefef",
  borderRadius: "0.5em",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "1px 1px 4px #ed6c02",
    borderRadius: "0.5em",
  },
});

FoodContainer.propTypes = {
  data: PropTypes.object,
};

function FoodLocation({ data }) {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/food-donation-locations/${data.slug}`);
  };
  
  return (
    <FoodContainer margin={1.5} onClick={handleClick}>
      <Box padding={1}>
        <img
          style={{ borderRadius: "5px", objectFit: "cover" }}
          src={`${baseURL}${data.image}`}
          alt={data.name}
          width="100%"
          height="222"
        />
      </Box>
      <Typography padding={1} variant="body3">
        {dayjs(data.created_at).format("DD/MM/YYYY HH:mm")}
      </Typography>
      <Typography
        padding={1}
        variant="body2"
        sx={{
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
          WebkitLineClamp: 2,
          minHeight: "4em",
        }}
      >
        {data.name}
      </Typography>
      <Typography padding={1} className="text-success" variant="body1">
        <PlaceIcon />
        {data.address}, {data.ward_name},{" "}
        {data.district_name}, {data.province_name}
      </Typography>
    </FoodContainer>
  );
}

export default FoodLocation;
