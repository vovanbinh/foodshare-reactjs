import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Box, Rating, Typography } from "@mui/material";
import { baseURL } from "../../../Constants/env";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PlaceIcon from "@mui/icons-material/Place";
import dayjs from "dayjs";
import { useParams } from "react-router-dom/cjs/react-router-dom";

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
  food: PropTypes.object,
};

function Food({ food }) {
  const history = useHistory();
  const { category } = useParams();

  const handleClick = () => {
    history.push(`/foods/${category}/${food?.slug}`);
  };

  return (
    <FoodContainer margin={1.5} onClick={handleClick}>
      <Box padding={1}>
        <img
          style={{ borderRadius: "5px", objectFit: "cover" }}
          src={`${baseURL}${food.images[0]?.image_url}`}
          alt={food.title}
          width="100%"
          height="222"
        />
      </Box>
      <Typography padding={1} variant="body3">
        {dayjs(food.created_at).format("DD/MM/YYYY HH:mm")}
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
        {food.title}
      </Typography>
      <Typography padding={1} className="text-success" variant="body1">
        <PlaceIcon />
        {food.formatted_address}
      </Typography>
      <Typography padding={0.5}>
        <Rating
          name="half-rating-read"
          defaultValue={food?.average_rating ?? 0}
          precision={0.1}
          readOnly
        />
      </Typography>
    </FoodContainer>
  );
}

export default Food;
