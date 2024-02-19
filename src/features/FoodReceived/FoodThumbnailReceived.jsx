import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { baseURL } from "../../Constants/env";

FoodThumbnailReceived.propTypes = {
  food: PropTypes.object,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  position: "relative",
  overflow: "hidden",
}));

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

const ThumbnailImageDetail = styled("img")(({ theme, isSelected }) => ({
  borderRadius: "0.5em",
  objectFit: "cover",
  padding: "2px",
  width: "100px",
  height: "100px",
  opacity: isSelected ? 1 : 0.5,
  transition: "opacity 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    opacity: 1,
  },
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "40%",
  transform: "translateY(-50%)",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
}));

function FoodThumbnailReceived({ food }) {
  const [displayedImage, setDisplayedImage] = useState(0);
  const [showArrows, setShowArrows] = useState(true);

  useEffect(() => {
    if (food?.imageUrls && food?.imageUrls.length > 4) {
      setShowArrows(true);
    } else {
      setShowArrows(false);
    }
  }, [food?.images, food]);

  const handleThumbnailClick = (index) => {
    setDisplayedImage(index);
  };

  const handleMoveLeft = () => {
    setDisplayedImage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleMoveRight = () => {
    setDisplayedImage((prev) =>
      prev < (food?.imageUrls?.length || 0) - 1 ? prev + 1 : prev
    );
  };

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item xs={12}>
        <Item>
          {showArrows && (
            <NavigationButton
              style={{ left: 2, marginLeft: "8px" }}
              onClick={handleMoveLeft}
            >
              <ChevronLeftIcon />
            </NavigationButton>
          )}
          <ThumbnailImage
            src={`${baseURL}${food?.imageUrls?.[displayedImage]}`}
            alt={food?.title}
            isSelected
          />

          {showArrows && (
            <NavigationButton
              style={{ right: 2, marginRight: "8px" }}
              onClick={handleMoveRight}
            >
              <ChevronRightIcon />
            </NavigationButton>
          )}
          <Grid
            item
            xs={12}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            {food?.imageUrls?.map((image, index) => (
              <ThumbnailImageDetail
                key={index}
                src={`${baseURL}${image}`}
                alt={`${index}`}
                isSelected={index === displayedImage}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </Grid>
        </Item>
      </Grid>
    </Grid>
  );
}

export default FoodThumbnailReceived;

