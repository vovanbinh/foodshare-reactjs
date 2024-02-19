import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import FoodThumbnail from "../Foods/components/FoodThumbnail";
import FoodInformation from "../Foods/components/FoodInformation";
import RatingAndReceiver from "../Foods/components/RatingAndReceiver";
import useFoodDetail from "./hooks/useFoodDetail";

DetailPageDonated.propTypes = {};

function DetailPageDonated(props) {
  const { foodId } = useParams();
  const { food, loading } = useFoodDetail(foodId);
  if (loading) {
    return (
      <Box marginTop={9} sx={{ width: "100%" }}>
        <LinearProgress />
        <div style={{ minHeight: "700px" }}></div>
      </Box>
    );
  }
  if (!food || Object.keys(food).length === 0) {
    return (
      <Container>
        <Box marginTop={12} style={{ minHeight: "700px" }}>
          <Typography variant="h4">Chi tiết Thực Phẩm</Typography>
          <Typography color="error">Dữ liệu không tồn tại.</Typography>
        </Box>
      </Container>
    );
  }
  return (
    <Container>
      <Box marginTop={12} style={{ minHeight: "700px" }}>
        <Typography variant="h4"> Chi tiết Thực Phẩm</Typography>
        <Grid container marginBottom={2} spacing={2}>
          <Grid item xs={12} md={6}>
            <FoodThumbnail food={food} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FoodInformation food={food} />
          </Grid>
        </Grid>
        <Grid container marginBottom={4} spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <RatingAndReceiver ratings={food.ratings} foodId={food?.food?.id} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DetailPageDonated;
