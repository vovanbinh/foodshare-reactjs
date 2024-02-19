import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import FoodInformation from "../components/FoodInformation";
import FoodThumbnail from "../components/FoodThumbnail";
import useFoodDetail from "../hooks/useFoodDetail";
import RatingAndReceiver from "../components/RatingAndReceiver";
import FacebookIcon from "@mui/icons-material/Facebook";
DetailPage.propTypes = {};

function DetailPage(props) {
  const { foodSlug } = useParams();
  const { food, loading } = useFoodDetail(foodSlug);
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
  const shareOnFacebook = () => {
    const currentURL = window.location.href;
    if (window.FB) {
      window.FB.ui(
        {
          method: "share",
          href: "https://itdragons.com/",
        },
        (response) => {
          console.log(response);
        }
      );
    }
  };
  return (
    <Container>
      <Box marginTop={12} style={{ minHeight: "700px" }}>
        <Typography variant="h4"> Chi tiết Thực Phẩm</Typography>
        <button
          className="btn text-white"
          style={{ backgroundColor: "#ED6C02", marginTop: "10px" }}
          onClick={shareOnFacebook}
        >
          <FacebookIcon />
          Share
        </button>
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
            <RatingAndReceiver ratings={food?.ratings} foodId={food?.food?.id} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DetailPage;
